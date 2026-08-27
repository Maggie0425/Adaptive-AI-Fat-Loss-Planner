from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


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


class ProfileCreate(ProfileInput):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    dietary_preferences: str = Field(default="", max_length=500)
    training_days: int = Field(default=3, ge=1, le=7)
    password: str = Field(min_length=10, max_length=128)


class ProfileUpdate(ProfileInput):
    name: str = Field(min_length=1, max_length=120)
    dietary_preferences: str = Field(default="", max_length=500)
    training_days: int = Field(default=3, ge=1, le=7)


class ProfileResponse(ProfileInput):
    id: int
    user_id: int
    name: str
    email: EmailStr
    dietary_preferences: str
    training_days: int
    calculations: CalculationResult


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: ProfileResponse


class MealSuggestion(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    description: str


class WorkoutDay(BaseModel):
    model_config = ConfigDict(extra="forbid")
    day: str
    activity: str
    duration_minutes: int = Field(ge=10, le=180)


class PlanContent(BaseModel):
    model_config = ConfigDict(extra="forbid")
    daily_calories: int
    protein_grams: int
    meals: list[MealSuggestion]
    workouts: list[WorkoutDay]
    rationale: str
    disclaimer: str


class WeeklyPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    week_number: int
    calorie_target_kcal: int
    content: PlanContent
    source: str
    change_summary: str
    created_at: datetime


class CheckInCreate(BaseModel):
    week_number: int = Field(ge=1, le=520)
    weight_kg: float = Field(ge=35, le=300)
    average_calories: int = Field(ge=800, le=6000)
    workouts_completed: int = Field(ge=0, le=14)
    hunger_level: int = Field(ge=1, le=5)
    energy_level: int = Field(ge=1, le=5)
    difficulty_level: int = Field(ge=1, le=5)
    feedback: str = Field(default="", max_length=1000)


class CheckInResponse(CheckInCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    check_in_date: date
    adherence_percent: float
    created_at: datetime


class AdaptationResponse(BaseModel):
    check_in: CheckInResponse
    next_plan: WeeklyPlanResponse


class DashboardPoint(BaseModel):
    week_number: int
    weight_kg: float | None
    adherence_percent: float | None
    calorie_target_kcal: int
    hunger_level: int | None
    energy_level: int | None


class DashboardResponse(BaseModel):
    points: list[DashboardPoint]
