from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_calculation_endpoint() -> None:
    response = client.post(
        "/api/v1/calculations",
        json={
            "age": 25,
            "sex": "female",
            "height_cm": 165,
            "weight_kg": 65,
            "activity_level": 1.375,
            "goal": "lose",
        },
    )
    assert response.status_code == 200
    assert response.json()["calorie_target_kcal"] == 1631


def test_rejects_invalid_profile() -> None:
    response = client.post(
        "/api/v1/calculations",
        json={
            "age": 12,
            "sex": "female",
            "height_cm": 165,
            "weight_kg": 65,
            "activity_level": 1.375,
            "goal": "lose",
        },
    )
    assert response.status_code == 422
