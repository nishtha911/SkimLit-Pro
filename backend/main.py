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
async def predict(request: PredictRequest):
    # Stub for now
    return {"sentences": []}

@app.post("/compare")
async def compare(request: CompareRequest):
    # Stub for now
    return {"a": [], "b": []}

@app.post("/export")
async def export(request: ExportRequest):
    # Stub for now
    return {"message": "Export feature not yet implemented. Use format pdf or docx."}
