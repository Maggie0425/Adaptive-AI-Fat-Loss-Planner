# Demo Runbook

## Story

The demo follows one clear loop: create an account, calculate a baseline,
generate week 1, report a difficult week, and show the safer week 2 adjustment.

## Suggested scenario

- Name: Alex Demo
- Email: `alex.demo@example.com`
- Age: 28
- Height: 170 cm
- Weight: 72 kg
- Activity: lightly active
- Goal: lose fat
- Training days: 3
- Preference: vegetarian, quick meals

For the week 1 check-in use 2 completed workouts, hunger 5/5, energy 2/5,
difficulty 4/5, and the feedback “Hungry in the evenings.” The application
should avoid a harsher deficit and raise the next target by no more than 100
kcal with an explanation.

## Screenshots for Devpost

1. Account/profile form and calculated metrics
2. Week 1 meal and workout plan
3. Weekly check-in form
4. Week 2 adjustment explanation
5. Dashboard trend and plan history
6. FastAPI interactive API documentation

Use a 3:2 image ratio where possible. Do not include real email addresses,
API keys, or personal health data in screenshots.

## Presenter notes

- Calculations are deterministic; the model does not calculate BMI/BMR/TDEE.
- OpenAI receives fitness inputs needed for planning, not the user's name,
  email, password, or token.
- Live OpenAI failures automatically fall back to a valid mock plan.
- Adjustments are bounded to 100 kcal per week and include safety checks.
