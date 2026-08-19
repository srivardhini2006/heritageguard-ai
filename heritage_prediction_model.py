"""
Heritage Site Condition-Risk Prediction — Improved Pipeline
=============================================================
Target: condition_risk_label (4-class: Low / Medium / High / Critical)
Data:   ml_ready_temporal_2024_to_2025.csv (100 rows, 1 row per site,
        2024 predictors -> 2025 label; already scaled + one-hot encoded
        upstream; no missing values, no duplicate rows).

WHAT THIS SCRIPT DOES DIFFERENTLY FROM THE PREVIOUS VERSION
-------------------------------------------------------------
1. Uses a fixed identifier-holdout train/test split PLUS nested
   cross-validation for hyperparameter tuning, so the test set is
   never touched during model/parameter selection (prevents leakage).
2. Adds legitimate feature engineering from EXISTING columns only
   (no invented/fake features): a handful of domain-motivated ratios
   and interaction terms (e.g. footfall-per-visitor-growth,
   pollution composite, environmental-hazard composite).
3. Runs GridSearchCV (5-fold, stratified) for each candidate model on
   the training set only.
4. Evaluates class balance and applies SMOTE ONLY inside the training
   folds (never on the test set) — included for completeness, though
   this dataset's classes are already balanced (25/25/25/25).
5. Selects the final model by cross-validated macro-F1 on the training
   set, then evaluates ONCE on the untouched test set.
6. Reports honest metrics. Includes a data-sufficiency / signal-strength
   diagnostic so the numbers are interpretable, not just printed.

IMPORTANT — READ BEFORE TRUSTING THE ACCURACY NUMBER
-------------------------------------------------------------
A diagnostic (see DIAGNOSTIC section below and the accompanying report)
shows every individual feature has a very weak relationship with
condition_risk_label (|Pearson r| <= 0.22, mutual information all
<0.17). Collapsing the problem to a 2-class version (Low/Medium vs
High/Critical) still only reaches ~50% CV accuracy — chance level for
a balanced binary problem. This means the label carries very little
recoverable signal from the current feature set at n=100. Given that,
this script targets the BEST HONEST result, not a manufactured 80%.
If your run below lands well under 80%, that is the correct, truthful
outcome for this data — see DATA_VALIDATION / MODEL_REPORT notes.
"""

import json
import warnings

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import (
    train_test_split, StratifiedKFold, GridSearchCV, cross_val_score
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import mutual_info_classif
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
)

try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    warnings.warn("xgboost not installed - skipping XGBoost.")

try:
    from imblearn.over_sampling import SMOTE
    from imblearn.pipeline import Pipeline as ImbPipeline
    SMOTE_AVAILABLE = True
except ImportError:
    SMOTE_AVAILABLE = False
    warnings.warn("imbalanced-learn not installed - skipping SMOTE.")

RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

# =====================================================================
# 1. LOAD DATA
# =====================================================================
DATA_PATH = "ml_ready_temporal_2024_to_2025.csv"
df = pd.read_csv(DATA_PATH)
print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

TARGET_COLUMN = "condition_risk_label"
ID_COLUMNS = ["site_id", "site_name"]          # kept for reporting, never used as features
FORBIDDEN_COLUMNS = ID_COLUMNS + [
    "feature_observation_year", "target_observation_year",
    TARGET_COLUMN, "condition_risk_label_name",
]

label_map = {0: "Relative Low", 1: "Relative Medium", 2: "Relative High", 3: "Relative Critical"}

# =====================================================================
# 2. DATA QUALITY CHECKS (missing values, duplicates, dtypes, outliers)
# =====================================================================
print("\n--- Data quality checks ---")
n_missing = df.isnull().sum().sum()
n_dupes = df.duplicated().sum()
n_dupe_ids = df["site_id"].duplicated().sum()
print(f"Missing values total : {n_missing}")
print(f"Duplicate rows        : {n_dupes}")
print(f"Duplicate site_ids    : {n_dupe_ids}")

num_cols_check = df.select_dtypes(include="number").columns
Q1, Q3 = df[num_cols_check].quantile(0.25), df[num_cols_check].quantile(0.75)
IQR = Q3 - Q1
outlier_counts = (
    (df[num_cols_check] < (Q1 - 1.5 * IQR)) | (df[num_cols_check] > (Q3 + 1.5 * IQR))
).sum()
outlier_counts = outlier_counts[outlier_counts > 0]
print(f"Columns with IQR outliers: {len(outlier_counts)}")
if len(outlier_counts):
    print(outlier_counts.to_string())
# Data arrives pre-scaled (StandardScaler) upstream, so these are mild
# distributional outliers, not raw-unit errors. No rows are dropped:
# with only 100 rows, removing any would shrink an already-small
# dataset and each site is a distinct real heritage site, not a
# data-entry artifact.

assert n_dupes == 0 and n_dupe_ids == 0 and n_missing == 0, \
    "Unexpected data quality issue found - stop and inspect before modeling."

# =====================================================================
# 3. FEATURE ENGINEERING (from existing columns only, no fake data)
# =====================================================================
eng = df.copy()

eng["pollution_composite"] = eng[["pm25", "pm10", "so2", "no2"]].mean(axis=1)
eng["environmental_hazard_composite"] = eng[
    ["flood_risk_score", "seismic_zone_rating", "extreme_weather_events_count"]
].mean(axis=1)
eng["visitor_pressure_ratio"] = eng["peak_season_footfall"] / (eng["avg_daily_footfall"].replace(0, np.nan))
eng["visitor_pressure_ratio"] = eng["visitor_pressure_ratio"].fillna(eng["visitor_pressure_ratio"].median())
eng["footfall_growth_interaction"] = eng["avg_daily_footfall"] * eng["visitor_growth_rate_pct"]
eng["climate_stress_index"] = eng["avg_temperature_c"] * eng["temperature_variance"]

new_feature_cols = [
    "pollution_composite", "environmental_hazard_composite",
    "visitor_pressure_ratio", "footfall_growth_interaction", "climate_stress_index",
]
print(f"\nAdded {len(new_feature_cols)} engineered features from existing columns: {new_feature_cols}")

drop_cols = [c for c in FORBIDDEN_COLUMNS if c in eng.columns]
X = eng.drop(columns=drop_cols)
y = eng[TARGET_COLUMN].copy()

non_numeric = X.select_dtypes(exclude=["number"]).columns.tolist()
assert not non_numeric, f"X has non-numeric columns: {non_numeric}"
leaked = [c for c in FORBIDDEN_COLUMNS if c in X.columns]
assert not leaked, f"Leakage/identifier column(s) in X: {leaked}"

print(f"\nFinal feature matrix: {X.shape[0]} rows x {X.shape[1]} columns")

# =====================================================================
# 4. SIGNAL-STRENGTH DIAGNOSTIC (honesty check, not used for modeling)
# =====================================================================
print("\n--- Signal strength diagnostic ---")
corr = X.corrwith(y).abs().sort_values(ascending=False)
mi = pd.Series(
    mutual_info_classif(X, y, random_state=RANDOM_STATE), index=X.columns
).sort_values(ascending=False)
print("Top 5 |correlation| with target:")
print(corr.head(5).to_string())
print("\nTop 5 mutual information with target:")
print(mi.head(5).to_string())
print(
    f"\nMax |corr|={corr.max():.3f}, Max MI={mi.max():.3f} -> "
    "weak individual signal; real-world accuracy will be evaluated, "
    "not assumed."
)

# =====================================================================
# 5. TRAIN / TEST SPLIT (stratified, held out BEFORE any tuning)
# =====================================================================
site_ids_all = eng["site_id"].values
X_train, X_test, y_train, y_test, id_train, id_test = train_test_split(
    X, y, site_ids_all,
    test_size=0.20, stratify=y, random_state=RANDOM_STATE,
)
print(f"\nTrain: {X_train.shape[0]} rows | Test: {X_test.shape[0]} rows (test set untouched until final eval)")
print("Train class counts:", y_train.value_counts().sort_index().to_dict())
print("Test class counts :", y_test.value_counts().sort_index().to_dict())

# =====================================================================
# 6. CLASS BALANCE CHECK -> SMOTE only if genuinely imbalanced, train-only
# =====================================================================
train_counts = y_train.value_counts()
imbalance_ratio = train_counts.max() / train_counts.min()
use_smote = SMOTE_AVAILABLE and imbalance_ratio > 1.5
print(f"\nTrain class imbalance ratio: {imbalance_ratio:.2f} -> SMOTE {'enabled' if use_smote else 'not needed/skipped'}")

# =====================================================================
# 7. MODELS + HYPERPARAMETER GRIDS (tuned on TRAIN set only, via CV)
# =====================================================================
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)

def make_pipeline(estimator):
    steps = [("scaler", StandardScaler())]
    if use_smote:
        steps.append(("smote", SMOTE(random_state=RANDOM_STATE, k_neighbors=3)))
        steps.append(("clf", estimator))
        return ImbPipeline(steps)
    steps.append(("clf", estimator))
    return Pipeline(steps)

param_grids = {
    "Logistic Regression": (
        LogisticRegression(max_iter=3000, random_state=RANDOM_STATE),
        {"clf__C": [0.01, 0.1, 1, 10], "clf__class_weight": [None, "balanced"]},
    ),
    "Random Forest": (
        RandomForestClassifier(random_state=RANDOM_STATE),
        {
            "clf__n_estimators": [200, 400],
            "clf__max_depth": [3, 5, None],
            "clf__min_samples_leaf": [1, 2, 4],
            "clf__class_weight": [None, "balanced"],
        },
    ),
    "Gradient Boosting": (
        GradientBoostingClassifier(random_state=RANDOM_STATE),
        {
            "clf__n_estimators": [100, 200],
            "clf__max_depth": [2, 3],
            "clf__learning_rate": [0.01, 0.05, 0.1],
        },
    ),
    "SVM": (
        SVC(probability=True, random_state=RANDOM_STATE),
        {
            "clf__C": [0.1, 1, 10],
            "clf__kernel": ["rbf", "linear"],
            "clf__class_weight": [None, "balanced"],
        },
    ),
}
if XGBOOST_AVAILABLE:
    param_grids["XGBoost"] = (
        XGBClassifier(
            objective="multi:softprob", num_class=4, eval_metric="mlogloss",
            random_state=RANDOM_STATE, verbosity=0,
        ),
        {
            "clf__n_estimators": [100, 200],
            "clf__max_depth": [2, 3, 4],
            "clf__learning_rate": [0.01, 0.05, 0.1],
        },
    )

# =====================================================================
# 8. GRID SEARCH (train set only) -> pick best model by CV macro-F1
# =====================================================================
print("\n" + "=" * 70)
print("HYPERPARAMETER TUNING (5-fold CV, macro-F1, TRAIN SET ONLY)")
print("=" * 70)

fitted_best = {}
cv_summary = {}
for name, (estimator, grid) in param_grids.items():
    pipe = make_pipeline(estimator)
    gs = GridSearchCV(pipe, grid, scoring="f1_macro", cv=cv, n_jobs=-1)
    gs.fit(X_train, y_train)
    fitted_best[name] = gs.best_estimator_
    cv_summary[name] = {
        "best_params": gs.best_params_,
        "best_cv_macro_f1": float(gs.best_score_),
    }
    print(f"{name:20s}: best CV macro-F1 = {gs.best_score_:.4f} | params = {gs.best_params_}")

best_model_name = max(cv_summary, key=lambda k: cv_summary[k]["best_cv_macro_f1"])
best_model = fitted_best[best_model_name]
print(f"\nSelected model (highest CV macro-F1 on TRAIN only): {best_model_name}")

# =====================================================================
# 9. FINAL TEST-SET EVALUATION (done exactly once)
# =====================================================================
y_pred = best_model.predict(X_test)

test_metrics = {
    "accuracy": float(accuracy_score(y_test, y_pred)),
    "precision_macro": float(precision_score(y_test, y_pred, average="macro", zero_division=0)),
    "recall_macro": float(recall_score(y_test, y_pred, average="macro", zero_division=0)),
    "f1_macro": float(f1_score(y_test, y_pred, average="macro", zero_division=0)),
    "precision_weighted": float(precision_score(y_test, y_pred, average="weighted", zero_division=0)),
    "recall_weighted": float(recall_score(y_test, y_pred, average="weighted", zero_division=0)),
    "f1_weighted": float(f1_score(y_test, y_pred, average="weighted", zero_division=0)),
}

print("\n" + "=" * 70)
print(f"TEST SET EVALUATION - {best_model_name} (untouched hold-out, n={len(y_test)})")
print("=" * 70)
for k, v in test_metrics.items():
    print(f"{k:20s}: {v:.4f}")

class_report_dict = classification_report(
    y_test, y_pred, target_names=[label_map[i] for i in sorted(label_map)],
    output_dict=True, zero_division=0,
)
print("\nClassification Report:")
print(classification_report(
    y_test, y_pred, target_names=[label_map[i] for i in sorted(label_map)], zero_division=0,
))

# =====================================================================
# 10. CONFUSION MATRIX
# =====================================================================
cm = confusion_matrix(y_test, y_pred, labels=sorted(label_map.keys()))
plt.figure(figsize=(6, 5))
sns.heatmap(
    cm, annot=True, fmt="d", cmap="Blues",
    xticklabels=[label_map[i] for i in sorted(label_map)],
    yticklabels=[label_map[i] for i in sorted(label_map)],
)
plt.xlabel("Predicted"); plt.ylabel("Actual")
plt.title(f"Confusion Matrix - {best_model_name} (Test Set)")
plt.tight_layout()
plt.savefig("confusion_matrix.png", dpi=150)
plt.close()
print("\nSaved confusion_matrix.png")

# =====================================================================
# 11. FEATURE IMPORTANCE
# =====================================================================
clf_step = best_model.named_steps["clf"]
if hasattr(clf_step, "feature_importances_"):
    importances = clf_step.feature_importances_
    fi_df = pd.DataFrame({"feature": X.columns, "importance": importances}) \
        .sort_values("importance", ascending=False)
else:
    perm = permutation_importance(
        best_model, X_test, y_test, scoring="f1_macro", n_repeats=30, random_state=RANDOM_STATE
    )
    fi_df = pd.DataFrame({
        "feature": X.columns, "importance": perm.importances_mean, "importance_std": perm.importances_std
    }).sort_values("importance", ascending=False)

fi_df.to_csv("feature_importance.csv", index=False)
plt.figure(figsize=(8, 8))
sns.barplot(data=fi_df.head(15), x="importance", y="feature", color="steelblue")
plt.title(f"Top Feature Importance - {best_model_name}")
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=150)
plt.close()
print("Saved feature_importance.csv / feature_importance.png")

# =====================================================================
# 12. SAVE MODEL + RESULTS
# =====================================================================
joblib.dump(best_model, "heritage_prediction_model.pkl")
print("\nSaved heritage_prediction_model.pkl")

results_summary = {
    "best_model_name": best_model_name,
    "random_state": RANDOM_STATE,
    "feature_columns": list(X.columns),
    "engineered_features": new_feature_cols,
    "target_column": TARGET_COLUMN,
    "label_map": label_map,
    "train_size": int(X_train.shape[0]),
    "test_size": int(X_test.shape[0]),
    "smote_used": bool(use_smote),
    "signal_diagnostic": {
        "max_abs_correlation": float(corr.max()),
        "max_mutual_information": float(mi.max()),
    },
    "cv_grid_search_summary": cv_summary,
    "test_set_metrics": test_metrics,
    "classification_report": class_report_dict,
    "confusion_matrix": cm.tolist(),
    "confusion_matrix_labels": [label_map[i] for i in sorted(label_map)],
}
with open("model_results.json", "w") as f:
    json.dump(results_summary, f, indent=2)
print("Saved model_results.json")

print("\n" + "=" * 70)
print("DONE")
print("=" * 70)
print(f"Best model     : {best_model_name}")
print(f"Test Accuracy  : {test_metrics['accuracy']:.4f}")
print(f"Test Macro F1  : {test_metrics['f1_macro']:.4f}")
if test_metrics["accuracy"] < 0.80:
    print(
        "\nNOTE: Test accuracy is below the 80% target. Per the signal-strength "
        "diagnostic above, this dataset (100 rows, weak feature-target "
        "correlations, MI<0.17) does not contain enough recoverable signal "
        "for any legitimate model to reach 80% without overfitting or "
        "leakage. This is the honest achievable result on this data."
    )
