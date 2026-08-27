export type Sex = 'female' | 'male'
export type Goal = 'lose' | 'maintain'

export interface ProfileInput {
  age: number
  sex: Sex
  height_cm: number
  weight_kg: number
  activity_level: number
  goal: Goal
}

export interface CalculationResult {
  bmi: number
  bmi_category: string
  bmr_kcal: number
  tdee_kcal: number
  calorie_target_kcal: number
  explanation: string
}
