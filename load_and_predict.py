"""
Load heritage_prediction_model.pkl and use it to predict on new data.
"""

import joblib
import pandas as pd

# 1. Load the trained model (a scikit-learn Pipeline: scaler + SVM classifier)
model = joblib.load("heritage_prediction_model.pkl")

label_map = {0: "Relative Low", 1: "Relative Medium", 2: "Relative High", 3: "Relative Critical"}

# 2. Prepare your input data.
#    Must have the SAME feature columns, in the SAME order, as training.
#    (site_id, site_name, and condition_risk_label are NOT features.)
df_new = pd.read_csv("ml_ready_temporal_2024_to_2025.csv")  # replace with your new data

FORBIDDEN_COLUMNS = [
    "site_id", "site_name", "feature_observation_year",
    "target_observation_year", "condition_risk_label", "condition_risk_label_name",
]
drop_cols = [c for c in FORBIDDEN_COLUMNS if c in df_new.columns]
X_new = df_new.drop(columns=drop_cols)

# Re-create the same engineered features used at training time
X_new["pollution_composite"] = X_new[["pm25", "pm10", "so2", "no2"]].mean(axis=1)
X_new["environmental_hazard_composite"] = X_new[
    ["flood_risk_score", "seismic_zone_rating", "extreme_weather_events_count"]
].mean(axis=1)
X_new["visitor_pressure_ratio"] = X_new["peak_season_footfall"] / X_new["avg_daily_footfall"].replace(0, pd.NA)
X_new["visitor_pressure_ratio"] = X_new["visitor_pressure_ratio"].fillna(X_new["visitor_pressure_ratio"].median())
X_new["footfall_growth_interaction"] = X_new["avg_daily_footfall"] * X_new["visitor_growth_rate_pct"]
X_new["climate_stress_index"] = X_new["avg_temperature_c"] * X_new["temperature_variance"]

# 3. Predict
predictions = model.predict(X_new)
probabilities = model.predict_proba(X_new)

results = pd.DataFrame({
    "site_id": df_new["site_id"],
    "site_name": df_new["site_name"],
    "predicted_label": [label_map[p] for p in predictions],
})
print(results.to_string(index=False))
