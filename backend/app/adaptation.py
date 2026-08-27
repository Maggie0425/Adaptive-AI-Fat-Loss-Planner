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
