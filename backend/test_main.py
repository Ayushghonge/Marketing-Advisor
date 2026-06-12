from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_get_history_endpoint():
    response = client.get("/api/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
