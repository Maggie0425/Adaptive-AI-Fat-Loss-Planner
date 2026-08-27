import pytest

from app.calculator import bmi_category, calculate
from app.schemas import ProfileInput


def test_calculates_female_fat_loss_metrics() -> None:
    result = calculate(
        ProfileInput(
            age=25,
            sex="female",
            height_cm=165,
            weight_kg=65,
            activity_level=1.375,
            goal="lose",
        )
    )

    assert result.bmi == 23.9
    assert result.bmi_category == "Healthy range"
    assert result.bmr_kcal == 1395
    assert result.tdee_kcal == 1918
    assert result.calorie_target_kcal == 1631


def test_maintenance_target_equals_tdee() -> None:
    result = calculate(
        ProfileInput(
            age=30,
            sex="male",
            height_cm=180,
            weight_kg=80,
            activity_level=1.55,
            goal="maintain",
        )
    )

    assert result.calorie_target_kcal == result.tdee_kcal


@pytest.mark.parametrize(
    ("value", "expected"),
    [(18.4, "Underweight range"), (18.5, "Healthy range"), (25, "Overweight range"), (30, "Obesity range")],
)
def test_bmi_categories(value: float, expected: str) -> None:
    assert bmi_category(value) == expected
