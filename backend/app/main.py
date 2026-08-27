from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.calculator import calculate
from app.schemas import CalculationResult, ProfileInput

app = FastAPI(title="Adaptive AI Fat-Loss Planner API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/calculations", response_model=CalculationResult)
def create_calculation(profile: ProfileInput) -> CalculationResult:
    return calculate(profile)
