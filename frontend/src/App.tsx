import { FormEvent, useState } from 'react'
import { calculateMetrics } from './api'
import type { CalculationResult, ProfileInput } from './types'

const initialProfile: ProfileInput = {
  age: 25,
  sex: 'female',
  height_cm: 165,
  weight_kg: 65,
  activity_level: 1.375,
  goal: 'lose',
}

function App() {
  const [profile, setProfile] = useState(initialProfile)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = <K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) => {
    setProfile((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      setResult(await calculateMetrics(profile))
    } catch (requestError) {
      setResult(null)
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Plan. Track. Adapt.</p>
        <h1>Your starting point, calculated clearly.</h1>
        <p>Enter your profile to estimate BMI, BMR, TDEE and a moderate daily calorie target.</p>
      </section>

      <section className="workspace">
        <form className="card form" onSubmit={submit}>
          <h2>Your profile</h2>
          <div className="grid">
            <label>Age<input type="number" min="18" max="100" value={profile.age} onChange={(e) => update('age', Number(e.target.value))} required /></label>
            <label>Sex<select value={profile.sex} onChange={(e) => update('sex', e.target.value as ProfileInput['sex'])}><option value="female">Female</option><option value="male">Male</option></select></label>
            <label>Height (cm)<input type="number" min="120" max="230" step="0.1" value={profile.height_cm} onChange={(e) => update('height_cm', Number(e.target.value))} required /></label>
            <label>Weight (kg)<input type="number" min="35" max="300" step="0.1" value={profile.weight_kg} onChange={(e) => update('weight_kg', Number(e.target.value))} required /></label>
            <label>Activity<select value={profile.activity_level} onChange={(e) => update('activity_level', Number(e.target.value))}><option value="1.2">Sedentary</option><option value="1.375">Lightly active</option><option value="1.55">Moderately active</option><option value="1.725">Very active</option></select></label>
            <label>Goal<select value={profile.goal} onChange={(e) => update('goal', e.target.value as ProfileInput['goal'])}><option value="lose">Lose fat</option><option value="maintain">Maintain weight</option></select></label>
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Calculating…' : 'Calculate my targets'}</button>
          {error && <p className="error" role="alert">{error}</p>}
        </form>

        <section className="card results" aria-live="polite">
          <h2>Your estimates</h2>
          {result ? <><div className="metrics"><article><span>BMI</span><strong>{result.bmi}</strong><small>{result.bmi_category}</small></article><article><span>BMR</span><strong>{result.bmr_kcal}</strong><small>kcal/day at rest</small></article><article><span>TDEE</span><strong>{result.tdee_kcal}</strong><small>kcal/day estimated</small></article><article className="accent"><span>Daily target</span><strong>{result.calorie_target_kcal}</strong><small>kcal/day</small></article></div><p className="explanation">{result.explanation}</p></> : <p className="empty">Your results will appear here after you submit the form.</p>}
        </section>
      </section>

      <footer>General wellness estimates only — not medical advice.</footer>
    </main>
  )
}

export default App
