from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.adaptation import adapt_calorie_target
from app.calculator import calculate
from app.database import Base, engine, get_db
from app.models import CheckIn, Profile, User, WeeklyPlan
from app.planner import get_plan_provider
from app.schemas import AdaptationResponse, CalculationResult, CheckInCreate, CheckInResponse
from app.schemas import PlanContent, ProfileCreate, ProfileInput, ProfileResponse, ProfileUpdate
from app.schemas import WeeklyPlanResponse


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Adaptive AI Fat-Loss Planner API", version="0.2.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def profile_response(user: User, profile: Profile) -> ProfileResponse:
    metrics = calculate(ProfileInput.model_validate(profile, from_attributes=True))
    return ProfileResponse(
        id=profile.id, user_id=user.id, name=user.name, email=user.email,
        age=profile.age, sex=profile.sex, height_cm=profile.height_cm,
        weight_kg=profile.weight_kg, activity_level=profile.activity_level,
        goal=profile.goal, dietary_preferences=profile.dietary_preferences,
        training_days=profile.training_days, calculations=metrics,
    )


def get_user_or_404(user_id: int, db: Session) -> User:
    user = db.get(User, user_id)
    if not user or not user.profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    return user


def plan_response(plan: WeeklyPlan) -> WeeklyPlanResponse:
    return WeeklyPlanResponse(
        id=plan.id, user_id=plan.user_id, week_number=plan.week_number,
        calorie_target_kcal=plan.calorie_target_kcal,
        content=PlanContent.model_validate(plan.content), source=plan.source,
        change_summary=plan.change_summary, created_at=plan.created_at,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/calculations", response_model=CalculationResult)
def create_calculation(profile: ProfileInput) -> CalculationResult:
    return calculate(profile)


@app.post("/api/v1/profiles", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(payload: ProfileCreate, db: Session = Depends(get_db)) -> ProfileResponse:
    if db.scalar(select(User).where(User.email == str(payload.email))):
        raise HTTPException(status_code=409, detail="A profile with this email already exists")
    user = User(name=payload.name, email=str(payload.email))
    user.profile = Profile(**payload.model_dump(exclude={"name", "email"}))
    db.add(user)
    db.commit()
    db.refresh(user)
    return profile_response(user, user.profile)


@app.get("/api/v1/profiles/{user_id}", response_model=ProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)) -> ProfileResponse:
    user = get_user_or_404(user_id, db)
    return profile_response(user, user.profile)


@app.put("/api/v1/profiles/{user_id}", response_model=ProfileResponse)
def update_profile(user_id: int, payload: ProfileUpdate, db: Session = Depends(get_db)) -> ProfileResponse:
    user = get_user_or_404(user_id, db)
    user.name = payload.name
    for key, value in payload.model_dump(exclude={"name"}).items():
        setattr(user.profile, key, value)
    db.commit()
    db.refresh(user.profile)
    return profile_response(user, user.profile)


@app.post("/api/v1/users/{user_id}/plans", response_model=WeeklyPlanResponse, status_code=201)
def create_initial_plan(user_id: int, db: Session = Depends(get_db)) -> WeeklyPlanResponse:
    user = get_user_or_404(user_id, db)
    if db.scalar(select(WeeklyPlan).where(WeeklyPlan.user_id == user_id, WeeklyPlan.week_number == 1)):
        raise HTTPException(status_code=409, detail="Week 1 plan already exists")
    metrics = calculate(ProfileInput.model_validate(user.profile, from_attributes=True))
    provider = get_plan_provider()
    content = provider.generate(user.profile, metrics.calorie_target_kcal, "This is the initial plan.")
    plan = WeeklyPlan(
        user_id=user_id, week_number=1, calorie_target_kcal=content.daily_calories,
        content=content.model_dump(), source=provider.source,
        change_summary="Initial plan based on saved profile and calculated targets.",
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan_response(plan)


@app.get("/api/v1/users/{user_id}/plans", response_model=list[WeeklyPlanResponse])
def list_plans(user_id: int, db: Session = Depends(get_db)) -> list[WeeklyPlanResponse]:
    get_user_or_404(user_id, db)
    plans = db.scalars(select(WeeklyPlan).where(WeeklyPlan.user_id == user_id).order_by(WeeklyPlan.week_number)).all()
    return [plan_response(plan) for plan in plans]


@app.post("/api/v1/users/{user_id}/check-ins", response_model=AdaptationResponse, status_code=201)
def create_check_in(user_id: int, payload: CheckInCreate, db: Session = Depends(get_db)) -> AdaptationResponse:
    user = get_user_or_404(user_id, db)
    current_plan = db.scalar(select(WeeklyPlan).where(
        WeeklyPlan.user_id == user_id, WeeklyPlan.week_number == payload.week_number
    ))
    if not current_plan:
        raise HTTPException(status_code=404, detail="Complete this week's plan before checking in")
    adherence = min(100.0, round(payload.workouts_completed / max(user.profile.training_days, 1) * 100, 1))
    check_in = CheckIn(user_id=user_id, adherence_percent=adherence, **payload.model_dump())
    adjustment = adapt_calorie_target(
        current_plan.calorie_target_kcal, adherence, payload.hunger_level, payload.energy_level
    )
    provider = get_plan_provider()
    context = (
        f"Last week adherence was {adherence}%. Hunger was {payload.hunger_level}/5 and "
        f"energy was {payload.energy_level}/5. {adjustment.summary} "
        f"User feedback: {payload.feedback or 'none'}."
    )
    content = provider.generate(user.profile, adjustment.calorie_target, context)
    next_plan = WeeklyPlan(
        user_id=user_id, week_number=payload.week_number + 1,
        calorie_target_kcal=adjustment.calorie_target, content=content.model_dump(),
        source=provider.source, change_summary=adjustment.summary,
    )
    db.add_all([check_in, next_plan])
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(status_code=409, detail="This check-in or next plan already exists") from error
    db.refresh(check_in)
    db.refresh(next_plan)
    return AdaptationResponse(
        check_in=CheckInResponse.model_validate(check_in), next_plan=plan_response(next_plan)
    )


@app.get("/api/v1/users/{user_id}/check-ins", response_model=list[CheckInResponse])
def list_check_ins(user_id: int, db: Session = Depends(get_db)) -> list[CheckIn]:
    get_user_or_404(user_id, db)
    return list(db.scalars(select(CheckIn).where(CheckIn.user_id == user_id).order_by(CheckIn.week_number)).all())
