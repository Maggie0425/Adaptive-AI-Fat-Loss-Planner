import type { CalculationResult, ProfileInput } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function calculateMetrics(profile: ProfileInput): Promise<CalculationResult> {
  const response = await fetch(`${API_URL}/api/v1/calculations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.detail?.[0]?.msg ?? 'Unable to calculate your metrics.')
  }

  return response.json() as Promise<CalculationResult>
}
