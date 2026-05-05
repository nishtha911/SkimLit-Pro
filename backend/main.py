import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import tensorflow as tf

class PredictRequest(BaseModel):
    abstract: str

class CompareRequest(BaseModel):
    abstract_a: str
    abstract_b: str

class ExportRequest(BaseModel):
    sentences: list
    format: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    print("Loading model...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(base_dir, 'model', 'skimlit_model')
    try:
        if os.path.exists(model_path):
            app.state.model = tf.keras.models.load_model(model_path)
            print("Model loaded successfully.")
        else:
            print(f"Model path not found: {model_path}. Please place your saved model_5 here.")
            app.state.model = None
    except Exception as e:
        print(f"Failed to load model: {e}")
        app.state.model = None
    yield
    # Clean up
    print("Unloading model...")
    app.state.model = None

app = FastAPI(lifespan=lifespan)

# CORS enabled for http://localhost:5173 (Vite dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": app.state.model is not None}

@app.post("/predict")
async def predict_endpoint(request: PredictRequest):
    if not app.state.model:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    try:
        from predict import predict
        results = predict(request.abstract, app.state.model)
        return {"sentences": results}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Prediction failed: {str(e)}")

@app.post("/compare")
async def compare_endpoint(request: CompareRequest):
    if not app.state.model:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    try:
        from predict import predict
        results_a = predict(request.abstract_a, app.state.model)
        results_b = predict(request.abstract_b, app.state.model)
        return {"a": results_a, "b": results_b}
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Prediction failed: {str(e)}")

@app.post("/export")
async def export(request: ExportRequest):
    # Stub for now
    return {"message": "Export feature not yet implemented. Use format pdf or docx."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
