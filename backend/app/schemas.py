from typing import Literal

from pydantic import BaseModel, Field


class ProfileInput(BaseModel):
    age: int = Field(ge=18, le=100)
    sex: Literal["female", "male"]
    height_cm: float = Field(ge=120, le=230)
    weight_kg: float = Field(ge=35, le=300)
    activity_level: Literal[1.2, 1.375, 1.55, 1.725]
    goal: Literal["lose", "maintain"]


class CalculationResult(BaseModel):
    bmi: float
    bmi_category: str
    bmr_kcal: int
    tdee_kcal: int
    calorie_target_kcal: int
    explanation: str
