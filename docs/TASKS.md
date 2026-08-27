# MVP Delivery Plan

This plan turns the product concept into a small, demonstrable vertical slice.
Finish each phase before expanding the feature list.

## Phase 0 — Team decisions

- [ ] Confirm the team members and feature owners.
- [ ] Confirm the LLM provider and deployment accounts.
- [ ] Agree on metric units, supported age range, and safe calorie boundaries.
- [ ] Define what user data is stored and how demo data will be handled.
- [ ] Add a licence if the repository will be open source.

## Phase 1 — Project foundations

- [x] Scaffold `frontend/` with React, TypeScript, and Vite.
- [x] Scaffold `backend/` with FastAPI and pytest.
- [x] Add a PostgreSQL-compatible SQLAlchemy data layer and first migration.
- [ ] Add CI checks for frontend and backend tests and linting.
- [x] Document exact install and run commands in the README.

**Done when:** a teammate can clone the repository, start both applications,
and reach a frontend page plus a backend health endpoint.

## Phase 2 — Deterministic calculator vertical slice

- [x] Define the user-profile request/response schema.
- [x] Implement profile input and validation.
- [x] Implement BMI, BMR, TDEE, and calorie-target calculations.
- [x] Add unit tests for normal values, boundaries, and invalid inputs.
- [x] Display calculated metrics and plain-language explanations.

**Done when:** a user can submit a profile and receive reproducible, tested
results without an LLM call.

## Phase 3 — Initial weekly plan

- [x] Define a structured plan schema.
- [x] Build prompts from validated calculations and preferences.
- [x] Validate OpenAI output with strict JSON Schema and provide a mock fallback.
- [x] Save the generated plan and show its meals, workouts, and rationale.
- [x] Add a clearly visible general-wellness disclaimer.

**Done when:** a user receives and can revisit one valid weekly plan.

## Phase 4 — Check-in and adaptation

- [x] Build the weekly check-in form.
- [x] Calculate workout adherence deterministically.
- [x] Define bounded adjustment rules and safety limits.
- [x] Generate the next plan using the prior plan plus check-in results.
- [x] Show what changed and why.

**Done when:** the end-to-end feedback loop produces a traceable second-week
plan without silently making extreme changes.

## Phase 5 — Dashboard and demo readiness

- [ ] Chart weight and adherence trends.
- [x] Show the current plan and plan-change history.
- [ ] Add loading, empty, validation, and API-error states.
- [ ] Test representative demo scenarios and mobile layouts.
- [ ] Deploy frontend and backend, then add both links to Devpost.
- [ ] Capture product media: dashboard, plan, check-in, adaptation, progress.

## Recommended first assignments

| Workstream | First deliverable |
| --- | --- |
| Frontend | Profile form and metric-results screen |
| Backend | Profile schema, health endpoint, calculator service |
| Data | User/profile/plan/check-in schema and first migration |
| AI | Structured weekly-plan schema and mocked provider interface |
| QA/docs | Calculator test cases, setup guide, demo scenarios |

## Keep out of the first MVP

- Medical diagnosis or treatment recommendations
- Wearable integrations
- Social feeds and gamification
- Computer-vision food recognition
- Highly detailed meal inventory or grocery logistics
- Multiple LLM providers before the first provider works end to end
