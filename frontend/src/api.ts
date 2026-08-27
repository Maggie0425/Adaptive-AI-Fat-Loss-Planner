import type { AdaptationResult, AuthResult, CheckInInput, DashboardPoint, ProfileInput, SavedProfile, WeeklyPlan } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let accessToken = sessionStorage.getItem('access_token') ?? ''
export const setAccessToken = (token: string) => { accessToken = token; sessionStorage.setItem('access_token', token) }

async function request<T>(path: string, init?: RequestInit, authenticated = true): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (authenticated && accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  const response = await fetch(`${API_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(typeof body?.detail === 'string' ? body.detail : body?.detail?.[0]?.msg ?? 'Request failed.')
  }
  return response.json() as Promise<T>
}

export const createProfile = (profile: ProfileInput) => request<SavedProfile>('/api/v1/profiles', { method: 'POST', body: JSON.stringify(profile) }, false)
export const login = (email: string, password: string) => request<AuthResult>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false)
export const createPlan = (userId: number) => request<WeeklyPlan>(`/api/v1/users/${userId}/plans`, { method: 'POST' })
export const listPlans = (userId: number) => request<WeeklyPlan[]>(`/api/v1/users/${userId}/plans`)
export const submitCheckIn = (userId: number, checkIn: CheckInInput) => request<AdaptationResult>(`/api/v1/users/${userId}/check-ins`, { method: 'POST', body: JSON.stringify(checkIn) })
export const getDashboard = (userId: number) => request<{ points: DashboardPoint[] }>(`/api/v1/users/${userId}/dashboard`)
