import json
import os
from typing import Protocol

from app.models import Profile
from app.schemas import MealSuggestion, PlanContent, WorkoutDay

WELLNESS_DISCLAIMER = "General wellness guidance only; not medical advice."


class PlanProvider(Protocol):
    source: str

    def generate(self, profile: Profile, calorie_target: int, context: str) -> PlanContent: ...


class MockPlanProvider:
    source = "mock"

    def generate(self, profile: Profile, calorie_target: int, context: str) -> PlanContent:
        return PlanContent(
            daily_calories=calorie_target,
            protein_grams=round(profile.weight_kg * 1.6),
            meals=[
                MealSuggestion(name="Balanced breakfast", description="Oats, yoghurt, fruit, and nuts."),
                MealSuggestion(name="Protein-rich lunch", description="Lean protein, grains, and mixed vegetables."),
                MealSuggestion(name="Flexible dinner", description="Protein, vegetables, and a preferred carbohydrate."),
            ],
            workouts=[
                WorkoutDay(day=f"Session {index + 1}", activity="Full-body strength and an easy walk", duration_minutes=45)
                for index in range(profile.training_days)
            ],
            rationale=f"A practical starting plan using your preferences ({profile.dietary_preferences or 'none specified'}). {context}",
            disclaimer=WELLNESS_DISCLAIMER,
        )


class OpenAIPlanProvider:
    source = "openai"

    def __init__(self) -> None:
        from openai import OpenAI

        self.client = OpenAI(api_key=os.environ["OPENAI_API_KEY"], timeout=20.0, max_retries=2)
        self.model = os.getenv("OPENAI_MODEL", "gpt-5-mini")

    def generate(self, profile: Profile, calorie_target: int, context: str) -> PlanContent:
        response = self.client.responses.create(
            model=self.model,
            store=False,
            instructions=(
                "Create conservative general-wellness meal and exercise suggestions. "
                "Never diagnose, prescribe treatment, or recommend extreme restriction."
            ),
            input=json.dumps({
                "age": profile.age,
                "sex": profile.sex,
                "height_cm": profile.height_cm,
                "weight_kg": profile.weight_kg,
                "goal": profile.goal,
                "daily_calorie_target": calorie_target,
                "dietary_preferences": profile.dietary_preferences,
                "training_days": profile.training_days,
                "adaptation_context": context,
            }),
            text={"format": {"type": "json_schema", "name": "weekly_plan", "strict": True, "schema": PlanContent.model_json_schema()}},
        )
        plan = PlanContent.model_validate_json(response.output_text)
        return plan.model_copy(update={"daily_calories": calorie_target, "disclaimer": WELLNESS_DISCLAIMER})


def get_plan_provider() -> PlanProvider:
    return ResilientPlanProvider() if os.getenv("OPENAI_API_KEY") else MockPlanProvider()


class ResilientPlanProvider:
    def __init__(self) -> None:
        self.primary = OpenAIPlanProvider()
        self.fallback = MockPlanProvider()
        self.source = "openai"

    def generate(self, profile: Profile, calorie_target: int, context: str) -> PlanContent:
        try:
            return self.primary.generate(profile, calorie_target, context)
        except Exception:
            self.source = "mock-fallback"
            return self.fallback.generate(profile, calorie_target, f"AI generation was unavailable. {context}")
