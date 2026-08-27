from dataclasses import dataclass


@dataclass(frozen=True)
class Adjustment:
    calorie_target: int
    summary: str


def adapt_calorie_target(current_target: int, adherence_percent: float, hunger_level: int, energy_level: int) -> Adjustment:
    """Apply small, explainable adjustments bounded to +/-100 kcal."""
    if hunger_level >= 4 or energy_level <= 2:
        return Adjustment(current_target + 100, "Raised target by 100 kcal to support hunger or low energy.")
    if adherence_percent < 70:
        return Adjustment(current_target, "Kept target stable; focus on consistency before increasing the deficit.")
    return Adjustment(current_target, "Kept target stable because adherence and feedback are within the expected range.")


def safe_adaptation(current_target: int, adherence_percent: float, hunger_level: int, energy_level: int, weekly_weight_change_percent: float) -> Adjustment:
    if weekly_weight_change_percent < -1.0:
        return Adjustment(current_target + 100, "Raised target by 100 kcal because weekly weight loss exceeded the 1% safety threshold.")
    if weekly_weight_change_percent > 1.0 and adherence_percent >= 80 and hunger_level <= 3 and energy_level >= 3:
        return Adjustment(max(1200, current_target - 100), "Lowered target by 100 kcal after high adherence and weight gain, within the safety limit.")
    return adapt_calorie_target(current_target, adherence_percent, hunger_level, energy_level)
