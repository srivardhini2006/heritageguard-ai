"""
Pydantic request/response models for the heritage risk-prediction API.

IMPORTANT - INPUT FORMAT:
The model was trained on data that was ALREADY scaled (StandardScaler) and
one-hot encoded UPSTREAM, before it reached this project. The original
scaler/encoder objects were not provided with the dataset, so this API
cannot convert raw real-world values (e.g. actual degrees C, actual visitor
counts) into the model's expected input on its own.

Until the original preprocessing objects (or the raw pre-scaling dataset)
are made available, callers must submit feature values already in the same
scaled/encoded numeric form as ml_ready_temporal_2024_to_2025.csv.
This is a known integration limitation - see README.md.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class SiteFeatures(BaseModel):
    """
    One site's feature vector, in the same scaled/encoded numeric form
    used during training. All fields are required floats/ints.
    """
    model_config = ConfigDict(populate_by_name=True)

    site_id: Optional[str] = Field(None, description="Optional identifier, echoed back in the response only - not used as a model feature")
    site_name: Optional[str] = Field(None, description="Optional display name, echoed back in the response only - not used as a model feature")

    avg_temperature_c: float
    temperature_variance: float
    humidity_pct: float
    annual_rainfall_mm: float
    air_quality_index: float
    pm25: float
    pm10: float
    so2: float
    no2: float
    extreme_weather_events_count: float
    avg_daily_footfall: float
    annual_visitor_count: float
    peak_season_footfall: float
    visitor_growth_rate_pct: float
    physical_contact_allowed: float
    vandalism_incidents_count: float
    latitude: float
    longitude: float
    elevation_m: float
    distance_to_coast_km: float
    flood_zone_flag: float
    flood_risk_score: float
    proximity_to_industrial_area_km: float
    vegetation_cover_pct: float
    seismic_zone_rating: float

    crowd_control_measures_moderate: float = Field(
        ..., alias="crowd_control_measures_Moderate (staff+barricades)"
    )
    crowd_control_measures_none: float = Field(
        ..., alias="crowd_control_measures_No Formal Measures"
    )
    crowd_control_measures_strict: float = Field(
        ..., alias="crowd_control_measures_Strict (ticketed timed-entry)"
    )

    soil_type_black_regur: float = Field(..., alias="soil_type_Black (Regur)")
    soil_type_red_laterite: float = Field(..., alias="soil_type_Red-Laterite")
    soil_type_rocky_mountainous: float = Field(..., alias="soil_type_Rocky-Mountainous")
    soil_type_sandy_arid: float = Field(..., alias="soil_type_Sandy-Arid")


class PredictionResponse(BaseModel):
    site_id: Optional[str] = None
    site_name: Optional[str] = None
    predicted_label_code: int
    predicted_label: str
    class_probabilities: dict[str, float]


class BatchPredictionRequest(BaseModel):
    sites: list[SiteFeatures]


class BatchPredictionResponse(BaseModel):
    predictions: list[PredictionResponse]


class ModelInfoResponse(BaseModel):
    model_name: str
    target_column: str
    label_map: dict[str, str]
    feature_columns: list[str]
    test_accuracy: float
    test_macro_f1: float
    known_limitations: list[str]
