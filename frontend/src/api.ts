import type { AdaptationResult, CheckInInput, ProfileInput, SavedProfile, WeeklyPlan } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(typeof body?.detail === 'string' ? body.detail : body?.detail?.[0]?.msg ?? 'Request failed.')
  }
  return response.json() as Promise<T>
}

export const createProfile = (profile: ProfileInput) => request<SavedProfile>('/api/v1/profiles', { method: 'POST', body: JSON.stringify(profile) })
export const createPlan = (userId: number) => request<WeeklyPlan>(`/api/v1/users/${userId}/plans`, { method: 'POST' })
export const listPlans = (userId: number) => request<WeeklyPlan[]>(`/api/v1/users/${userId}/plans`)
export const submitCheckIn = (userId: number, checkIn: CheckInInput) => request<AdaptationResult>(`/api/v1/users/${userId}/check-ins`, { method: 'POST', body: JSON.stringify(checkIn) })
