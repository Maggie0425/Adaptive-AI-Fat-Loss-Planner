from app.schemas import CalculationResult, ProfileInput


def bmi_category(bmi: float) -> str:
    if bmi < 18.5:
        return "Underweight range"
    if bmi < 25:
        return "Healthy range"
    if bmi < 30:
        return "Overweight range"
    return "Obesity range"


def calculate(profile: ProfileInput) -> CalculationResult:
    """Calculate metrics with the Mifflin-St Jeor BMR equation."""
    height_m = profile.height_cm / 100
    bmi = profile.weight_kg / height_m**2

    sex_adjustment = 5 if profile.sex == "male" else -161
    bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + sex_adjustment
    tdee = bmr * profile.activity_level

    # A moderate 15% deficit is used for the first MVP. This can later become
    # adaptive, but the change must remain bounded and traceable.
    calorie_target = tdee * 0.85 if profile.goal == "lose" else tdee

    return CalculationResult(
        bmi=round(bmi, 1),
        bmi_category=bmi_category(bmi),
        bmr_kcal=round(bmr),
        tdee_kcal=round(tdee),
        calorie_target_kcal=round(calorie_target),
        explanation=(
            "Your estimates use the Mifflin-St Jeor equation and your selected activity "
            "level. The fat-loss target applies a moderate 15% energy deficit."
            if profile.goal == "lose"
            else "Your estimates use the Mifflin-St Jeor equation and your selected activity level."
        ),
    )
