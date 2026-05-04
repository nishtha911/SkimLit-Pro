import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "ok"

def test_predict_no_model():
    """Test prediction endpoint when model is not loaded (likely in CI/Test env)."""
    # If the model isn't found in the filesystem, main.py sets app.state.model = None
    # We test that the API handles this gracefully with a 500 or 422 if it tries to run
    response = client.post(
        "/predict",
        json={"abstract": "This is a test abstract."}
    )
    # Based on main.py, it raises 500 if app.state.model is None
    assert response.status_code in [500, 422]

def test_export_stub():
    """Test the export endpoint stub."""
    response = client.post(
        "/export",
        json={"sentences": [], "format": "pdf"}
    )
    assert response.status_code == 200
    assert "message" in response.json()
