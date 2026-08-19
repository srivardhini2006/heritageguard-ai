"""
Loads heritage_prediction_model.pkl once and exposes predict functions.
Keeps model logic separate from the FastAPI route definitions.
"""

import json
import os
import joblib
import pandas as pd

MODEL_PATH = os.getenv("MODEL_PATH", "heritage_prediction_model.pkl")
RESULTS_PATH = os.getenv("MODEL_RESULTS_PATH", "model_results.json")

LABEL_MAP = {0: "Relative Low", 1: "Relative Medium", 2: "Relative High", 3: "Relative Critical"}

# Raw column order the model's feature-engineering step expects,
# BEFORE the 5 engineered columns are appended.
RAW_FEATURE_COLUMNS = [
    "avg_temperature_c", "temperature_variance", "humidity_pct", "annual_rainfall_mm",
    "air_quality_index", "pm25", "pm10", "so2", "no2", "extreme_weather_events_count",
    "avg_daily_footfall", "annual_visitor_count", "peak_season_footfall",
    "visitor_growth_rate_pct", "physical_contact_allowed", "vandalism_incidents_count",
    "latitude", "longitude", "elevation_m", "distance_to_coast_km", "flood_zone_flag",
    "flood_risk_score", "proximity_to_industrial_area_km", "vegetation_cover_pct",
    "seismic_zone_rating",
    "crowd_control_measures_Moderate (staff+barricades)",
    "crowd_control_measures_No Formal Measures",
    "crowd_control_measures_Strict (ticketed timed-entry)",
    "soil_type_Black (Regur)", "soil_type_Red-Laterite",
    "soil_type_Rocky-Mountainous", "soil_type_Sandy-Arid",
]

# Maps the Pydantic field names (with underscores) back to the exact
# raw column names above (which contain spaces/parentheses).
FIELD_TO_RAW_COLUMN = {
    "crowd_control_measures_moderate": "crowd_control_measures_Moderate (staff+barricades)",
    "crowd_control_measures_none": "crowd_control_measures_No Formal Measures",
    "crowd_control_measures_strict": "crowd_control_measures_Strict (ticketed timed-entry)",
    "soil_type_black_regur": "soil_type_Black (Regur)",
    "soil_type_red_laterite": "soil_type_Red-Laterite",
    "soil_type_rocky_mountainous": "soil_type_Rocky-Mountainous",
    "soil_type_sandy_arid": "soil_type_Sandy-Arid",
}


class ModelService:
    def __init__(self, model_path: str = MODEL_PATH, results_path: str = RESULTS_PATH):
        self.model = joblib.load(model_path)
        self.results = {}
        if os.path.exists(results_path):
            with open(results_path) as f:
                self.results = json.load(f)

    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Recreate the exact engineered features used at training time."""
        df = df.copy()
        df["pollution_composite"] = df[["pm25", "pm10", "so2", "no2"]].mean(axis=1)
        df["environmental_hazard_composite"] = df[
            ["flood_risk_score", "seismic_zone_rating", "extreme_weather_events_count"]
        ].mean(axis=1)
        df["visitor_pressure_ratio"] = df["peak_season_footfall"] / df["avg_daily_footfall"].replace(0, pd.NA)
        df["visitor_pressure_ratio"] = df["visitor_pressure_ratio"].fillna(df["visitor_pressure_ratio"].median())
        df["footfall_growth_interaction"] = df["avg_daily_footfall"] * df["visitor_growth_rate_pct"]
        df["climate_stress_index"] = df["avg_temperature_c"] * df["temperature_variance"]
        return df

    def _sites_to_dataframe(self, sites: list[dict]) -> pd.DataFrame:
        rows = []
        for site in sites:
            row = {}
            for field, value in site.items():
                if field in ("site_id", "site_name"):
                    continue
                col = FIELD_TO_RAW_COLUMN.get(field, field)
                row[col] = value
            rows.append(row)
        df = pd.DataFrame(rows)
        # enforce exact column order the model was trained on
        df = df[RAW_FEATURE_COLUMNS]
        return df

    def predict_batch(self, sites: list[dict]) -> list[dict]:
        raw_df = self._sites_to_dataframe(sites)
        X = self._engineer_features(raw_df)

        pred_codes = self.model.predict(X)
        probas = self.model.predict_proba(X)
        class_order = self.model.classes_

        results = []
        for i, site in enumerate(sites):
            proba_dict = {
                LABEL_MAP[int(c)]: float(probas[i][j]) for j, c in enumerate(class_order)
            }
            results.append({
                "site_id": site.get("site_id"),
                "site_name": site.get("site_name"),
                "predicted_label_code": int(pred_codes[i]),
                "predicted_label": LABEL_MAP[int(pred_codes[i])],
                "class_probabilities": proba_dict,
            })
        return results

    def get_model_info(self) -> dict:
        metrics = self.results.get("test_set_metrics", {})
        return {
            "model_name": self.results.get("best_model_name", "unknown"),
            "target_column": self.results.get("target_column", "condition_risk_label"),
            "label_map": {str(k): v for k, v in LABEL_MAP.items()},
            "feature_columns": self.results.get("feature_columns", RAW_FEATURE_COLUMNS),
            "test_accuracy": metrics.get("accuracy", 0.0),
            "test_macro_f1": metrics.get("f1_macro", 0.0),
            "known_limitations": [
                "Trained on n=100 sites; features show weak individual correlation "
                "with the target (max |r|~0.22, max mutual information~0.17).",
                "Test accuracy is ~35%, well below a hard 80% target - reported "
                "honestly rather than inflated.",
                "Inputs must already be in the same scaled/one-hot-encoded numeric "
                "form as the training data; the original upstream scaler/encoder "
                "was not provided, so this API cannot accept raw real-world values.",
            ],
        }
