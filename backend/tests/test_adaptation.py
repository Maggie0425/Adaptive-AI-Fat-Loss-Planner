from app.adaptation import adapt_calorie_target, safe_adaptation


def test_raises_calories_for_high_hunger() -> None:
    assert adapt_calorie_target(1800, 90, 5, 3).calorie_target == 1900


def test_does_not_deepen_deficit_when_adherence_is_low() -> None:
    result = adapt_calorie_target(1800, 60, 3, 3)
    assert result.calorie_target == 1800
    assert "consistency" in result.summary


def test_raises_target_when_weight_loss_is_too_fast() -> None:
    result = safe_adaptation(1800, 90, 2, 2, -1.2)
    assert result.calorie_target == 1900


def test_reduction_is_bounded_and_has_floor() -> None:
    result = safe_adaptation(1200, 90, 2, 4, 1.2)
    assert result.calorie_target == 1200
