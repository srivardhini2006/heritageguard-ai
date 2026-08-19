"""
FastAPI backend for heritage site deterioration-risk prediction.

Run with:
    uvicorn main:app --reload --port 8000

Endpoints:
    GET  /health          - liveness check
    GET  /model-info       - model metadata, metrics, known limitations (for dashboard)
    POST /predict           - single-site prediction
    POST /predict/batch      - multi-site prediction
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    SiteFeatures, PredictionResponse, BatchPredictionRequest,
    BatchPredictionResponse, ModelInfoResponse,
)
from model_service import ModelService

app = FastAPI(
    title="Heritage Site Risk Prediction API",
    description="Predicts deterioration-risk category for Indian heritage sites.",
    version="1.0.0",
)

# Allow the frontend/dashboard (running on a different origin during dev) to call this API.
# Tighten allow_origins to your actual dashboard URL before deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service: ModelService | None = None


@app.on_event("startup")
def load_model():
    """Load the model once at startup, not per-request."""
    global model_service
    try:
        model_service = ModelService()
    except FileNotFoundError as e:
        raise RuntimeError(
            f"Could not load model files: {e}. "
            "Make sure heritage_prediction_model.pkl and model_results.json "
            "are in the working directory (or set MODEL_PATH / MODEL_RESULTS_PATH)."
        )


@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": model_service is not None}


@app.get("/model-info", response_model=ModelInfoResponse)
def model_info():
    if model_service is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return model_service.get_model_info()


@app.post("/predict", response_model=PredictionResponse)
def predict(site: SiteFeatures):
    if model_service is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    try:
        result = model_service.predict_batch([site.model_dump(by_alias=True)])[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")
    return result


@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchPredictionRequest):
    if model_service is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    if not request.sites:
        raise HTTPException(status_code=400, detail="sites list is empty")
    try:
        results = model_service.predict_batch(
            [s.model_dump(by_alias=True) for s in request.sites]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")
    return {"predictions": results}
