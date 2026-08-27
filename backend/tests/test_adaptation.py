from app.adaptation import adapt_calorie_target


def test_raises_calories_for_high_hunger() -> None:
    assert adapt_calorie_target(1800, 90, 5, 3).calorie_target == 1900


def test_does_not_deepen_deficit_when_adherence_is_low() -> None:
    result = adapt_calorie_target(1800, 60, 3, 3)
    assert result.calorie_target == 1800
    assert "consistency" in result.summary
