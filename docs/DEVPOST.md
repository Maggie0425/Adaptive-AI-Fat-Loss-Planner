# Devpost Submission Kit

## Links

- Live demo: https://adaptive-ai-fat-loss-planner-fronte.vercel.app
- GitHub: https://github.com/Maggie0425/Adaptive-AI-Fat-Loss-Planner
- API documentation: https://adaptive-planner-api.onrender.com/docs

## Tagline

A wellness planner that learns from each real week and makes small,
explainable adjustments instead of handing users a static plan.

## Inspiration

Most calorie and workout tools stop after producing a target. Real life is
messier: adherence changes, hunger rises, energy falls, and the original plan
often needs adjustment. We built a feedback loop that reacts conservatively to
those signals while keeping every recommendation understandable.

## What it does

Users create an account and save a fitness profile. The app calculates BMI,
BMR, TDEE, and a moderate calorie target with deterministic formulas. It then
generates a structured weekly meal and training plan. After each week, the user
records weight, calorie intake, completed workouts, hunger, energy, difficulty,
and feedback. The planner creates the next week with a bounded adjustment and a
plain-language explanation. A dashboard shows targets and progress over time.

## How we built it

- React, TypeScript, Vite, and Recharts for the frontend
- FastAPI, Pydantic, SQLAlchemy, Alembic, JWT, and Argon2 for the backend
- PostgreSQL on Render, with SQLite for local development
- OpenAI Responses API with strict structured output and a deterministic mock
  fallback
- Vercel for the frontend and Render Blueprint/Docker for the API and database
- GitHub Actions for frontend lint/build and backend tests

Sensitive identity fields are not sent to the AI provider. Calculations and
safety bounds remain deterministic, and model output is schema validated.

## Challenges

The main challenge was making adaptation useful without allowing uncontrolled
calorie changes. We separated deterministic calculations from generated
recommendations, limited changes to 100 kcal per week, added a 1,200 kcal floor,
and made hunger, energy, adherence, and rapid weight change override aggressive
adjustments. Deployment also required coordinating Vercel's frontend origin,
Render CORS configuration, database migrations, and resilient mock behavior.

## Accomplishments

- A complete profile-to-week-two feedback loop
- Explainable and bounded weekly adaptation
- Persistent PostgreSQL data with migrations
- JWT ownership checks on protected user routes
- Graceful AI fallback that keeps the demo operational without a secret key
- Automated CI and deployments

## What we learned

AI is most dependable when it handles flexible recommendations while ordinary
code owns arithmetic, validation, authorization, and safety constraints. A
small, well-observed feedback loop can be more useful than a large static plan.

## What's next

- Enable the live OpenAI provider in production
- Add richer weight and adherence charts
- Add password reset and account deletion
- Add exportable plans, reminders, and accessibility testing
- Move the demo database to durable production storage

## Verification evidence

Verified against the live deployment on August 27, 2026:

- Backend health endpoint returned `200` with `{"status":"ok"}`.
- Production CORS preflight returned `200` for the Vercel origin.
- Account creation and login succeeded with synthetic data.
- Week 1 was generated at 1,845 kcal/day.
- A check-in with high hunger generated Week 2 at 1,945 kcal/day and explained
  the bounded 100 kcal increase.
- Dashboard returned Week 1 and Week 2 data.
- An unauthenticated dashboard request returned `401`.

## Screenshot checklist

Use only the synthetic demo account and crop out the browser's address bar if
needed. Recommended order:

1. Landing page, profile, and calculated metrics
2. Week 1 meal and four-session training plan
3. Completed Week 1 check-in
4. Week 2 explanation showing the 100 kcal adaptation
5. Plan history and two-week dashboard trend
6. FastAPI `/docs` page or GitHub Actions passing checks

## Disclaimer

Adaptive AI Fat-Loss Planner provides general wellness estimates and planning
ideas only. It is not medical advice, diagnosis, or treatment. Users with
medical conditions, a history of disordered eating, pregnancy, or other
special requirements should consult a qualified healthcare professional before
changing diet or exercise. The free hosted database is temporary and should not
be used for real personal health information.
