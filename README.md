# Adaptive AI Fat-Loss Planner

> Plan. Track. Adapt. Get leaner.

A full-stack wellness application that creates a personalised weekly fat-loss
plan and adapts it using the user's real progress, adherence, hunger, energy,
and feedback.

## Live demo

- Frontend: https://adaptive-ai-fat-loss-planner-fronte.vercel.app
- API health: https://adaptive-planner-api.onrender.com/health
- API documentation: https://adaptive-planner-api.onrender.com/docs

The hosted demo uses the deterministic mock planner unless an OpenAI API key is
configured. Render's free web service can take 50 seconds or more to wake after
inactivity, and its free PostgreSQL database expires after 30 days.

## Product idea

Most fitness apps produce a static plan. This project is built around a weekly
feedback loop:

`User profile -> fitness calculations -> initial plan -> weekly check-in -> progress analysis -> adapted plan`

The product is a general fitness and wellness planning tool. It is not intended
to diagnose, treat, or replace advice from a qualified healthcare professional.

## MVP scope

1. **User profile** — goals, body measurements, activity level, dietary
   preferences, and available training time.
2. **Fitness calculator** — deterministic BMI, BMR, TDEE, calorie-target, and
   adherence calculations.
3. **AI weekly planner** — structured meal and workout recommendations with
   understandable explanations.
4. **Weekly check-in** — weight, calorie intake, completed workouts, hunger,
   energy, difficulty, and written feedback.
5. **Adaptive adjustment** — explain and apply bounded changes to the next plan.
6. **Progress dashboard** — show weight, adherence, and plan changes over time.
7. **Seven-day cooking guide** — translate each calorie target into daily
   breakfast, lunch, dinner, and snack budgets with dish calories, ingredients,
   seasonings, preparation time, and step-by-step cooking instructions.

See [docs/TASKS.md](docs/TASKS.md) for the recommended delivery order and MVP
acceptance criteria.

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript |
| Backend API | Python, FastAPI |
| Database | SQLAlchemy + Alembic; SQLite locally, PostgreSQL on Render |
| AI planning | OpenAI Responses API with strict structured output; mock fallback |
| Charts | Recharts |
| Version control | Git and GitHub |
| Deployment | Vercel (frontend), Render (backend) |

## Repository structure

```text
.
├── frontend/          # React + TypeScript + Vite application
├── backend/           # FastAPI application, migrations, and tests
├── docs/
│   ├── TASKS.md       # MVP roadmap and team checklist
│   ├── DEMO.md        # Demo runbook
│   └── DEVPOST.md     # Submission-ready project copy
├── .env.example       # Safe environment-variable template
└── README.md
```

## Getting started

### Prerequisites

- Git
- Node.js 20+ and npm
- Python 3.11+
- PostgreSQL 16+ (or a team-approved hosted database)

### Local setup

```bash
git clone https://github.com/Maggie0425/Adaptive-AI-Fat-Loss-Planner.git
cd Adaptive-AI-Fat-Loss-Planner
cp .env.example .env
```

Windows PowerShell equivalent:

```powershell
Copy-Item .env.example .env
```

Install and run the frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

In a second terminal, install and run the backend:

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open `http://localhost:5173`. The API documentation is available at
`http://localhost:8000/docs`. Never commit `.env` or API keys.

By default the backend uses a local SQLite database and a deterministic mock
weekly-plan provider, so the complete flow works without external accounts.
Set `DATABASE_URL` to a PostgreSQL connection string for PostgreSQL. Set
`OPENAI_API_KEY` and `OPENAI_MODEL` to enable live OpenAI-generated plans.
API responses are requested with strict JSON Schema validation and `store=False`.

Apply database migrations with:

```bash
cd backend
alembic upgrade head
```

### Implemented flow

1. Save and retrieve a user profile.
2. Calculate BMI, BMR, TDEE, and a moderate calorie target.
3. Generate a structured week-one meal and workout plan.
4. Submit weekly weight, adherence, hunger, energy, difficulty, and feedback.
5. Apply a bounded, explainable adjustment and generate the following week.
6. Review plan history in the frontend.

Authentication uses expiring JWT bearer tokens and Argon2 password hashes.
Authenticated endpoints verify that the token owner matches the requested user,
so changing a URL's `user_id` cannot expose another account.

The dashboard currently shows calorie targets, weight, workout adherence,
hunger, and energy by week. Adaptive calorie changes are limited to 100 kcal
per week, have a 1,200 kcal floor, and react conservatively to unusually rapid
weight loss, low adherence, high hunger, or low energy.

### Deployment

- Import the repository into Vercel and set the project Root Directory to
  `frontend`. Set `VITE_API_URL` to the deployed Render API URL.
- Create a Render Blueprint from the root `render.yaml`. It provisions the
  Docker-based FastAPI service and PostgreSQL database.
- The Blueprint provisions free Render instances and allows the production
  Vercel origin. Optionally set `OPENAI_API_KEY`; `JWT_SECRET` is generated by
  Render.
- Keep all secrets in platform environment variables, never in Git.

See [docs/DEMO.md](docs/DEMO.md) for the presentation scenario and screenshot
checklist.

### Verification

```bash
cd frontend && pnpm lint && pnpm build
cd backend && pytest
```

## Engineering principles

- Keep BMI, BMR, TDEE, calorie, progress, and adherence calculations in tested
  deterministic code rather than asking an LLM to calculate them.
- Give the AI structured inputs and require validated structured outputs.
- Keep weekly adjustments bounded and explain why each recommendation changed.
- Treat health-related inputs as sensitive data and collect only what the MVP
  needs.
- Use metric units internally and convert only at the interface boundary.
- Keep the language focused on general wellness, not diagnosis or treatment.

## Contributing

1. Create a short-lived branch from `main`.
2. Make one focused change and add or update tests where appropriate.
3. Run the relevant formatter, linter, and tests locally.
4. Open a pull request explaining the change and how it was verified.

Suggested branch names: `feature/profile-form`, `feature/fitness-calculator`,
`fix/check-in-validation`, and `docs/update-readme`.

## Current status

The adaptive MVP is live. It supports account creation and login, persistent
profiles, deterministic metrics, week-one planning, weekly check-ins, bounded
next-week adaptations, plan history, dashboard trends, JWT-protected endpoints,
PostgreSQL persistence, CI, and automatic deployments from `main`.

The production flow was verified end to end on August 27, 2026. See
[docs/DEVPOST.md](docs/DEVPOST.md) for submission-ready copy and the evidence
checklist.

## License

No licence has been selected yet. Until the team adds one, all rights are
reserved by the repository owner.
