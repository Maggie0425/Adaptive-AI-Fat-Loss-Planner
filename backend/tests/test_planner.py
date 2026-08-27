from types import SimpleNamespace

from app.models import Profile
from app.planner import OpenAIPlanProvider


def test_openai_provider_requests_strict_structured_output() -> None:
    captured: dict[str, object] = {}
    payload = '{"daily_calories":1800,"protein_grams":110,"meals":[],"workouts":[],"rationale":"Balanced start.","disclaimer":"placeholder"}'

    class FakeResponses:
        def create(self, **kwargs: object) -> SimpleNamespace:
            captured.update(kwargs)
            return SimpleNamespace(output_text=payload)

    provider = OpenAIPlanProvider.__new__(OpenAIPlanProvider)
    provider.client = SimpleNamespace(responses=FakeResponses())
    provider.model = "test-model"
    profile = Profile(age=25, sex="female", height_cm=165, weight_kg=65, activity_level=1.375, goal="lose", dietary_preferences="", training_days=3)

    plan = provider.generate(profile, 1800, "Initial plan")

    assert plan.daily_calories == 1800
    assert captured["store"] is False
    assert captured["text"]["format"]["strict"] is True  # type: ignore[index]
