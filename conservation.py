"""
Conservation Intelligence Module
=================================
Member 5's core logic: risk-factor analysis, conservation priority
scoring, preventive-action recommendations, and what-if support.

Field names below match the real project dataset
(ml_ready_temporal_2024_to_2025.csv) supplied by Member 1.

NOTE on predicted_risk:
  It comes from Member 6's trained model (not built yet). The dataset's
  `condition_risk_label` is the TRAINING TARGET Member 6's model will
  learn to predict — it is not a live prediction, so it is only used as
  a temporary stand-in in demo_run.py.

NOTE on structural_score:
  This now comes from Member 3's computer-vision crack-detection module
  (detect_crack.py). Her function returns raw detection data, not a
  ready-made score:
      {"crack_count": int, "crack_area_ratio": float,
       "average_confidence": float, "max_confidence": float}
  Use structural_score_from_crack_detection() below to convert her
  output into the 1-5 structural_score this module expects.
"""

from typing import Any, Dict, List


# ============================================================
# CONFIGURATION
# ============================================================

# factor_name -> the dataset column it's derived from
FACTOR_MAP = {
    "humidity":                  "humidity_pct",
    "rainfall":                  "annual_rainfall_mm",
    "air_quality":                "air_quality_index",
    "visitor_pressure":           "annual_visitor_count",
    "flood_risk":                 "flood_risk_score",
    "seismic_risk":               "seismic_zone_rating",
    "vandalism_risk":             "vandalism_incidents_count",
    "extreme_weather_risk":       "extreme_weather_events_count",
    "vegetation_overgrowth_risk": "vegetation_cover_pct",
    "industrial_proximity_risk":  "proximity_to_industrial_area_km",
    "structural_condition":       "structural_score",
}

# value >= "high" -> HIGH, value >= "medium" -> MEDIUM, else LOW.
# "inverse": True means LOWER values are riskier (e.g. distance to a
# hazard source) — used for industrial_proximity_risk.
RISK_THRESHOLDS = {
    "humidity_pct":                    {"medium": 60,        "high": 75},
    "annual_rainfall_mm":              {"medium": 1200,      "high": 2000},
    "air_quality_index":               {"medium": 100,       "high": 200},
    "annual_visitor_count":            {"medium": 1_000_000, "high": 3_000_000},
    "flood_risk_score":                {"medium": 4,         "high": 7},
    "seismic_zone_rating":             {"medium": 3,         "high": 4},
    "vandalism_incidents_count":       {"medium": 2,         "high": 4},
    "extreme_weather_events_count":    {"medium": 2,         "high": 4},
    "vegetation_cover_pct":            {"medium": 50,        "high": 65},
    "proximity_to_industrial_area_km": {"medium": 50,        "high": 20, "inverse": True},
    # 1 = good, 5 = severely deteriorated (converted from Member 3's crack data)
    "structural_score":                {"medium": 3,         "high": 4},
}

RISK_WEIGHT = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}

# Must sum to 1.0. predicted_risk (Member 6's model) carries the largest
# single weight; the rest is split evenly across the 11 factors we can
# compute directly from Member 1's and Member 3's data.
PRIORITY_WEIGHTS = {
    "predicted_risk": 0.45,
    "humidity_pct": 0.05,
    "annual_rainfall_mm": 0.05,
    "air_quality_index": 0.05,
    "annual_visitor_count": 0.05,
    "flood_risk_score": 0.05,
    "seismic_zone_rating": 0.05,
    "vandalism_incidents_count": 0.05,
    "extreme_weather_events_count": 0.05,
    "vegetation_cover_pct": 0.05,
    "proximity_to_industrial_area_km": 0.05,
    "structural_score": 0.05,
}

PRIORITY_LEVELS = [
    (80, "CRITICAL"),
    (60, "HIGH"),
    (40, "MEDIUM"),
    (0, "LOW"),
]

RECOMMENDATIONS = {
    "humidity": {
        "HIGH": "Conduct moisture assessment and increase monitoring.",
        "MEDIUM": "Monitor humidity levels during periodic inspections.",
    },
    "rainfall": {
        "HIGH": "Inspect drainage and monitor rainfall-related deterioration.",
        "MEDIUM": "Increase monitoring during periods of heavy rainfall.",
    },
    "air_quality": {
        "HIGH": "Increase surface-cleaning frequency and conduct periodic material condition assessments.",
        "MEDIUM": "Continue monitoring air-quality exposure.",
    },
    "visitor_pressure": {
        "HIGH": "Introduce visitor caps or timed-entry ticketing to reduce physical wear.",
        "MEDIUM": "Monitor visitor pressure on vulnerable areas.",
    },
    "flood_risk": {
        "HIGH": "Prioritize drainage and flood-barrier upgrades before the next monsoon season.",
        "MEDIUM": "Monitor flood risk and clear drainage channels seasonally.",
    },
    "seismic_risk": {
        "HIGH": "Commission a seismic-retrofit structural assessment.",
        "MEDIUM": "Include seismic resilience in the next structural review.",
    },
    "vandalism_risk": {
        "HIGH": "Increase security patrols, CCTV coverage, and community stewardship programs.",
        "MEDIUM": "Maintain regular security monitoring.",
    },
    "extreme_weather_risk": {
        "HIGH": "Develop an extreme-weather emergency response and protective-covering plan.",
        "MEDIUM": "Monitor weather advisories and prepare contingency protocols.",
    },
    "vegetation_overgrowth_risk": {
        "HIGH": "Schedule vegetation clearance and inspect for root intrusion into structures.",
        "MEDIUM": "Monitor vegetation growth near structural elements.",
    },
    "industrial_proximity_risk": {
        "HIGH": "Advocate for stricter emission controls nearby and increase surface-cleaning frequency.",
        "MEDIUM": "Monitor pollutant deposition from nearby industrial sources.",
    },
    "structural_condition": {
        "HIGH": "Recommend detailed structural assessment by conservation experts based on crack detection findings.",
        "MEDIUM": "Schedule periodic structural condition assessment.",
    },
}

DEFAULT_RECOMMENDATION = "Continue routine monitoring and periodic conservation assessment."

REQUIRED_FIELDS = ["site_id", "predicted_risk"] + list(FACTOR_MAP.values())


# ============================================================
# MEMBER 3 INTEGRATION — crack detection -> structural_score
# ============================================================

def structural_score_from_crack_detection(crack_features: Dict[str, Any]) -> float:
    """
    Converts Member 3's computer-vision crack-detection output into the
    1-5 structural_score this module expects (1 = good, 5 = severely
    deteriorated).

    Expects the exact dict shape returned by her detect_cracks():
        {
            "crack_count": int,
            "crack_area_ratio": float,   # fraction of image area covered by cracks
            "average_confidence": float,
            "max_confidence": float,
        }

    Severity is driven mainly by how much of the surface is cracked
    (crack_area_ratio), with crack_count as a secondary signal — a photo
    riddled with many small cracks and one with a few large ones should
    both register as damaged.
    """
    crack_count = crack_features.get("crack_count", 0)
    crack_area_ratio = crack_features.get("crack_area_ratio", 0.0)

    count_severity = min(crack_count / 10, 1.0)        # 10+ cracks maxes this out
    area_severity = min(crack_area_ratio / 0.20, 1.0)   # 20%+ of surface maxes this out

    severity = (0.4 * count_severity) + (0.6 * area_severity)
    score = 1 + (4 * severity)
    return round(score, 2)


# ============================================================
# VALIDATION
# ============================================================

def validate_site(site: Dict[str, Any]) -> None:
    """Raise ValueError listing any missing required fields."""
    missing = [f for f in REQUIRED_FIELDS if f not in site]
    if missing:
        raise ValueError(f"Missing required site field(s): {', '.join(missing)}")


# ============================================================
# 1. RISK FACTOR ANALYSIS
# ============================================================

def _classify(value: float, thresholds: Dict[str, Any]) -> str:
    if thresholds.get("inverse"):
        if value <= thresholds["high"]:
            return "HIGH"
        if value <= thresholds["medium"]:
            return "MEDIUM"
        return "LOW"
    if value >= thresholds["high"]:
        return "HIGH"
    if value >= thresholds["medium"]:
        return "MEDIUM"
    return "LOW"


def analyze_risk_factors(site: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Classify each environmental / visitor / site-vulnerability factor as LOW/MEDIUM/HIGH risk."""
    factors = {}
    for factor_name, column in FACTOR_MAP.items():
        value = site[column]
        factors[factor_name] = {
            "value": value,
            "risk": _classify(value, RISK_THRESHOLDS[column]),
        }
    return factors


# ============================================================
# 2. TOP RISK FACTORS
# ============================================================

def get_top_risk_factors(factors: Dict[str, Dict[str, Any]], limit: int = 5) -> List[str]:
    """Names of the highest-risk factors (LOW excluded), most severe first."""
    ranked = sorted(
        factors.items(),
        key=lambda item: RISK_WEIGHT[item[1]["risk"]],
        reverse=True,
    )
    return [name for name, details in ranked if details["risk"] != "LOW"][:limit]


# ============================================================
# 3. CONSERVATION PRIORITY SCORE
# ============================================================

def calculate_priority_score(site: Dict[str, Any]) -> float:
    """
    Weighted 0-100 score. predicted_risk (Member 6's model output) carries
    50% of the weight; the remaining 50% is spread across the 10 factors
    we can compute directly from Member 1's data, so the score still means
    something even before Member 6's prediction API is live.
    """
    normalized = {
        "predicted_risk": min(site["predicted_risk"], 100),
        "humidity_pct": min(site["humidity_pct"], 100),
        "annual_rainfall_mm": min(site["annual_rainfall_mm"] / 30, 100),
        "air_quality_index": min(site["air_quality_index"] / 2, 100),
        "annual_visitor_count": min(site["annual_visitor_count"] / 30_000, 100),
        "flood_risk_score": min(site["flood_risk_score"] * 10, 100),
        "seismic_zone_rating": (site["seismic_zone_rating"] / 5) * 100,
        "vandalism_incidents_count": min(site["vandalism_incidents_count"] * 20, 100),
        "extreme_weather_events_count": min(site["extreme_weather_events_count"] * 20, 100),
        "vegetation_cover_pct": min(site["vegetation_cover_pct"], 100),
        # inverse: closer to industry = higher risk
        "proximity_to_industrial_area_km": max(0, min(100, 100 - site["proximity_to_industrial_area_km"])),
        "structural_score": (site["structural_score"] / 5) * 100,
    }
    score = sum(PRIORITY_WEIGHTS[key] * normalized[key] for key in PRIORITY_WEIGHTS)
    return round(score, 2)


# ============================================================
# 4. PRIORITY LEVEL
# ============================================================

def get_priority_level(score: float) -> str:
    for threshold, level in PRIORITY_LEVELS:
        if score >= threshold:
            return level
    return "LOW"


# ============================================================
# 5. PREVENTIVE RECOMMENDATIONS
# ============================================================

def generate_recommendations(factors: Dict[str, Dict[str, Any]]) -> List[str]:
    recommendations = []
    for factor_name, risk_map in RECOMMENDATIONS.items():
        risk = factors[factor_name]["risk"]
        if risk in risk_map:
            recommendations.append(risk_map[risk])

    if not recommendations:
        recommendations.append(DEFAULT_RECOMMENDATION)

    return recommendations


# ============================================================
# 6. COMPLETE CONSERVATION ANALYSIS (single site)
# ============================================================

def analyze_site(site: Dict[str, Any]) -> Dict[str, Any]:
    """Run the full conservation-intelligence pipeline for one site."""
    validate_site(site)

    factors = analyze_risk_factors(site)
    top_factors = get_top_risk_factors(factors)
    priority_score = calculate_priority_score(site)
    priority_level = get_priority_level(priority_score)
    recommendations = generate_recommendations(factors)

    return {
        "site_id": site["site_id"],
        "predicted_risk": site["predicted_risk"],
        "risk_factors": factors,
        "top_risk_factors": top_factors,
        "priority_score": priority_score,
        "priority_level": priority_level,
        "recommendations": recommendations,
    }


# ============================================================
# 7. RANK MULTIPLE SITES (powers a dashboard priority list)
# ============================================================

def rank_sites(sites: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Analyze a batch of sites and return them sorted by priority score, highest first."""
    results = [analyze_site(site) for site in sites]
    return sorted(results, key=lambda r: r["priority_score"], reverse=True)