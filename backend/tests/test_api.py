from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

test_engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestSession = sessionmaker(bind=test_engine, autoflush=False, expire_on_commit=False)


def override_db() -> Generator[Session, None, None]:
    with TestSession() as session:
        yield session


app.dependency_overrides[get_db] = override_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(test_engine)
    Base.metadata.create_all(test_engine)
    yield


def profile_payload() -> dict[str, object]:
    return {
        "name": "Demo User", "email": "demo@example.com", "age": 25,
        "sex": "female", "height_cm": 165, "weight_kg": 65,
        "activity_level": 1.375, "goal": "lose",
        "dietary_preferences": "vegetarian", "training_days": 3,
    }


def test_health_endpoint() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_calculation_endpoint() -> None:
    payload = profile_payload()
    for extra_field in ["name", "email", "dietary_preferences", "training_days"]:
        payload.pop(extra_field)
    response = client.post("/api/v1/calculations", json=payload)
    assert response.status_code == 200
    assert response.json()["calorie_target_kcal"] == 1631


def test_rejects_invalid_profile() -> None:
    payload = profile_payload()
    payload["age"] = 12
    assert client.post("/api/v1/profiles", json=payload).status_code == 422


def test_profile_plan_checkin_adaptation_flow() -> None:
    created = client.post("/api/v1/profiles", json=profile_payload())
    assert created.status_code == 201
    user_id = created.json()["user_id"]
    assert created.json()["calculations"]["bmi"] == 23.9
    assert client.get(f"/api/v1/profiles/{user_id}").json()["dietary_preferences"] == "vegetarian"

    plan = client.post(f"/api/v1/users/{user_id}/plans")
    assert plan.status_code == 201
    assert plan.json()["source"] == "mock"

    adaptation = client.post(f"/api/v1/users/{user_id}/check-ins", json={
        "week_number": 1, "weight_kg": 64.8, "average_calories": 1700,
        "workouts_completed": 2, "hunger_level": 5, "energy_level": 2,
        "difficulty_level": 4, "feedback": "Hungry in the evenings",
    })
    assert adaptation.status_code == 201
    assert adaptation.json()["check_in"]["adherence_percent"] == 66.7
    assert adaptation.json()["next_plan"]["week_number"] == 2
    assert adaptation.json()["next_plan"]["calorie_target_kcal"] == 1731
    assert [item["week_number"] for item in client.get(f"/api/v1/users/{user_id}/plans").json()] == [1, 2]


def test_duplicate_email_returns_conflict() -> None:
    assert client.post("/api/v1/profiles", json=profile_payload()).status_code == 201
    assert client.post("/api/v1/profiles", json=profile_payload()).status_code == 409
