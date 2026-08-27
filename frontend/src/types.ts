export type Sex = 'female' | 'male'
export type Goal = 'lose' | 'maintain'

export interface ProfileInput {
  name: string
  email: string
  age: number
  sex: Sex
  height_cm: number
  weight_kg: number
  activity_level: 1.2 | 1.375 | 1.55 | 1.725
  goal: Goal
  dietary_preferences: string
  training_days: number
  password: string
}

export interface CalculationResult { bmi: number; bmi_category: string; bmr_kcal: number; tdee_kcal: number; calorie_target_kcal: number; explanation: string }
export type SavedProfile = Omit<ProfileInput, 'password'> & { id: number; user_id: number; calculations: CalculationResult }
export interface Meal { name: string; description: string }
export interface Workout { day: string; activity: string; duration_minutes: number }
export interface WeeklyPlan { id: number; user_id: number; week_number: number; calorie_target_kcal: number; source: string; change_summary: string; created_at: string; content: { daily_calories: number; protein_grams: number; meals: Meal[]; workouts: Workout[]; rationale: string; disclaimer: string } }
export interface CheckInInput { week_number: number; weight_kg: number; average_calories: number; workouts_completed: number; hunger_level: number; energy_level: number; difficulty_level: number; feedback: string }
export interface AdaptationResult { check_in: CheckInInput & { id: number; adherence_percent: number }; next_plan: WeeklyPlan }
export interface AuthResult { access_token: string; token_type: 'bearer'; user: SavedProfile }
export interface DashboardPoint { week_number: number; weight_kg: number | null; adherence_percent: number | null; calorie_target_kcal: number; hunger_level: number | null; energy_level: number | null }
