"""Initial user, profile, plan, and check-in tables."""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("name", sa.String(120), nullable=False), sa.Column("email", sa.String(255), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("email"))
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_table("profiles", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("age", sa.Integer(), nullable=False), sa.Column("sex", sa.String(12), nullable=False), sa.Column("height_cm", sa.Float(), nullable=False), sa.Column("weight_kg", sa.Float(), nullable=False), sa.Column("activity_level", sa.Float(), nullable=False), sa.Column("goal", sa.String(20), nullable=False), sa.Column("dietary_preferences", sa.Text(), nullable=False), sa.Column("training_days", sa.Integer(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("user_id"))
    op.create_index("ix_profiles_user_id", "profiles", ["user_id"], unique=True)
    op.create_table("weekly_plans", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("week_number", sa.Integer(), nullable=False), sa.Column("calorie_target_kcal", sa.Integer(), nullable=False), sa.Column("content", sa.JSON(), nullable=False), sa.Column("source", sa.String(20), nullable=False), sa.Column("change_summary", sa.Text(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("user_id", "week_number", name="uq_user_week"))
    op.create_index("ix_weekly_plans_user_id", "weekly_plans", ["user_id"])
    op.create_table("check_ins", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False), sa.Column("week_number", sa.Integer(), nullable=False), sa.Column("check_in_date", sa.Date(), nullable=False), sa.Column("weight_kg", sa.Float(), nullable=False), sa.Column("average_calories", sa.Integer(), nullable=False), sa.Column("workouts_completed", sa.Integer(), nullable=False), sa.Column("hunger_level", sa.Integer(), nullable=False), sa.Column("energy_level", sa.Integer(), nullable=False), sa.Column("difficulty_level", sa.Integer(), nullable=False), sa.Column("feedback", sa.Text(), nullable=False), sa.Column("adherence_percent", sa.Float(), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("user_id", "week_number", name="uq_checkin_user_week"))
    op.create_index("ix_check_ins_user_id", "check_ins", ["user_id"])


def downgrade() -> None:
    op.drop_table("check_ins")
    op.drop_table("weekly_plans")
    op.drop_table("profiles")
    op.drop_table("users")
