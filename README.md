# Adaptive AI Fat-Loss Planner

> Plan. Track. Adapt. Get leaner.

A full-stack wellness application that creates a personalised weekly fat-loss
plan and adapts it using the user's real progress, adherence, hunger, energy,
and feedback.

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

See [docs/TASKS.md](docs/TASKS.md) for the recommended delivery order and MVP
acceptance criteria.

## Planned stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript |
| Backend API | Python, FastAPI |
| Database | PostgreSQL |
| AI planning | LLM API with structured output |
| Charts | Recharts |
| Version control | Git and GitHub |
| Deployment | Vercel (frontend), Render (backend) |

The stack is provisional until the first frontend and backend scaffolds are
committed. Only list technologies here and on Devpost once the project actually
uses them.

## Repository structure

```text
.
├── frontend/          # React + TypeScript application (to be scaffolded)
├── backend/           # FastAPI application (to be scaffolded)
├── docs/
│   └── TASKS.md       # MVP roadmap and team checklist
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

The first vertical slice is implemented: a profile form calls the FastAPI
calculation endpoint and displays BMI, BMR, TDEE, and a calorie target. The next
milestone is persistence and the structured weekly-plan contract.

## License

No licence has been selected yet. Until the team adds one, all rights are
reserved by the repository owner.
