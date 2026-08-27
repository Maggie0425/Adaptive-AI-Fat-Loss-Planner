import { FormEvent, useState } from 'react'
import { createPlan, createProfile, getDashboard, listPlans, login, setAccessToken, submitCheckIn } from './api'
import type { CheckInInput, DashboardPoint, ProfileInput, SavedProfile, WeeklyPlan } from './types'

const initialProfile: ProfileInput = { name: '', email: '', password: '', age: 25, sex: 'female', height_cm: 165, weight_kg: 65, activity_level: 1.375, goal: 'lose', dietary_preferences: '', training_days: 3 }

function TrendChart({ points }: { points: DashboardPoint[] }) {
  if (!points.length) return null
  const max = Math.max(...points.map((point) => point.calorie_target_kcal))
  return <div className="chart" aria-label="Weekly calorie target chart">{points.map((point) => <div className="bar-wrap" key={point.week_number}><div className="bar" style={{ height: `${Math.max(18, point.calorie_target_kcal / max * 100)}%` }} title={`${point.calorie_target_kcal} kcal`} /><small>W{point.week_number}</small></div>)}</div>
}

function App() {
  const [profile, setProfile] = useState(initialProfile)
  const [saved, setSaved] = useState<SavedProfile | null>(null)
  const [plans, setPlans] = useState<WeeklyPlan[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [dashboard, setDashboard] = useState<DashboardPoint[]>([])
  const currentPlan = plans.at(-1)
  const [checkIn, setCheckIn] = useState<CheckInInput>({ week_number: 1, weight_kg: 65, average_calories: 1800, workouts_completed: 3, hunger_level: 3, energy_level: 3, difficulty_level: 3, feedback: '' })

  const updateProfile = <K extends keyof ProfileInput>(key: K, value: ProfileInput[K]) => setProfile((valueNow) => ({ ...valueNow, [key]: value }))
  const updateCheckIn = <K extends keyof CheckInInput>(key: K, value: CheckInInput[K]) => setCheckIn((valueNow) => ({ ...valueNow, [key]: value }))

  async function saveProfile(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage('')
    try {
      await createProfile(profile)
      const auth = await login(profile.email, profile.password); setAccessToken(auth.access_token)
      setSaved(auth.user); setCheckIn((value) => ({ ...value, weight_kg: auth.user.weight_kg, average_calories: auth.user.calculations.calorie_target_kcal })); setMessage('Account created. You can now generate week 1.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save profile.') } finally { setLoading(false) }
  }

  async function signIn(event: FormEvent) {
    event.preventDefault(); setLoading(true); setMessage('')
    try { const auth = await login(loginForm.email, loginForm.password); setAccessToken(auth.access_token); setSaved(auth.user); const history = await listPlans(auth.user.user_id); setPlans(history); setDashboard((await getDashboard(auth.user.user_id)).points); setCheckIn((value) => ({ ...value, weight_kg: auth.user.weight_kg, average_calories: history.at(-1)?.calorie_target_kcal ?? auth.user.calculations.calorie_target_kcal })); setMessage('Signed in successfully.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to sign in.') } finally { setLoading(false) }
  }

  async function generatePlan() {
    if (!saved) return
    setLoading(true); setMessage('')
    try { await createPlan(saved.user_id); setPlans(await listPlans(saved.user_id)); setDashboard((await getDashboard(saved.user_id)).points); setMessage('Week 1 plan generated.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to generate plan.') } finally { setLoading(false) }
  }

  async function adapt(event: FormEvent) {
    event.preventDefault(); if (!saved || !currentPlan) return
    setLoading(true); setMessage('')
    try {
      const result = await submitCheckIn(saved.user_id, { ...checkIn, week_number: currentPlan.week_number })
      setPlans((value) => [...value, result.next_plan]); setDashboard((await getDashboard(saved.user_id)).points); setCheckIn((value) => ({ ...value, week_number: result.next_plan.week_number, average_calories: result.next_plan.calorie_target_kcal })); setMessage(`Check-in saved. ${result.next_plan.change_summary}`)
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to adapt plan.') } finally { setLoading(false) }
  }

  return <main>
    <section className="hero"><p className="eyebrow">Plan. Track. Adapt.</p><h1>A plan that learns from your real week.</h1><p>Save your profile, generate a structured plan, then use weekly feedback to make small, explainable adjustments.</p></section>
    {message && <p className="notice" role="status">{message}</p>}

    {!saved && <div className="auth-switch"><button className={authMode === 'register' ? '' : 'secondary'} onClick={() => setAuthMode('register')}>Create account</button><button className={authMode === 'login' ? '' : 'secondary'} onClick={() => setAuthMode('login')}>Sign in</button></div>}

    {!saved && authMode === 'login' && <form className="card auth" onSubmit={signIn}><p className="step">Welcome back</p><h2>Sign in</h2><div className="grid"><label>Email<input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required /></label><label>Password<input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required /></label></div><button disabled={loading}>Sign in</button></form>}

    {(saved || authMode === 'register') && <section className="workspace">
      <form className="card form" onSubmit={saveProfile}>
        <p className="step">01 · Profile</p><h2>Build your baseline</h2>
        <div className="grid">
          <label>Name<input value={profile.name} onChange={(e) => updateProfile('name', e.target.value)} required /></label>
          <label>Email<input type="email" value={profile.email} onChange={(e) => updateProfile('email', e.target.value)} required /></label>
          <label>Password<input type="password" minLength={10} value={profile.password} onChange={(e) => updateProfile('password', e.target.value)} required /></label>
          <label>Age<input type="number" min="18" max="100" value={profile.age} onChange={(e) => updateProfile('age', Number(e.target.value))} required /></label>
          <label>Sex<select value={profile.sex} onChange={(e) => updateProfile('sex', e.target.value as ProfileInput['sex'])}><option value="female">Female</option><option value="male">Male</option></select></label>
          <label>Height (cm)<input type="number" min="120" max="230" value={profile.height_cm} onChange={(e) => updateProfile('height_cm', Number(e.target.value))} required /></label>
          <label>Weight (kg)<input type="number" min="35" max="300" step="0.1" value={profile.weight_kg} onChange={(e) => updateProfile('weight_kg', Number(e.target.value))} required /></label>
          <label>Activity<select value={profile.activity_level} onChange={(e) => updateProfile('activity_level', Number(e.target.value) as ProfileInput['activity_level'])}><option value="1.2">Sedentary</option><option value="1.375">Lightly active</option><option value="1.55">Moderately active</option><option value="1.725">Very active</option></select></label>
          <label>Goal<select value={profile.goal} onChange={(e) => updateProfile('goal', e.target.value as ProfileInput['goal'])}><option value="lose">Lose fat</option><option value="maintain">Maintain</option></select></label>
          <label>Training days<input type="number" min="1" max="7" value={profile.training_days} onChange={(e) => updateProfile('training_days', Number(e.target.value))} /></label>
          <label>Food preferences<input value={profile.dietary_preferences} onChange={(e) => updateProfile('dietary_preferences', e.target.value)} placeholder="e.g. vegetarian" /></label>
        </div>
        <button disabled={loading || !!saved}>{saved ? 'Profile saved' : 'Save profile & calculate'}</button>
      </form>

      <section className="card results">
        <p className="step">02 · Metrics</p><h2>Your estimates</h2>
        {saved ? <div className="metrics"><article><span>BMI</span><strong>{saved.calculations.bmi}</strong><small>{saved.calculations.bmi_category}</small></article><article><span>BMR</span><strong>{saved.calculations.bmr_kcal}</strong><small>kcal/day</small></article><article><span>TDEE</span><strong>{saved.calculations.tdee_kcal}</strong><small>kcal/day</small></article><article className="accent"><span>Target</span><strong>{saved.calculations.calorie_target_kcal}</strong><small>kcal/day</small></article></div> : <p className="empty">Save your profile to calculate your starting metrics.</p>}
        <button className="secondary" disabled={!saved || plans.length > 0 || loading} onClick={generatePlan}>Generate week 1 plan</button>
      </section>
    </section>}

    {currentPlan && <section className="card plan"><div className="plan-heading"><div><p className="step">03 · Weekly plan</p><h2>Week {currentPlan.week_number}</h2></div><div className="target"><strong>{currentPlan.content.daily_calories}</strong><span>kcal/day</span></div></div><p className="change">{currentPlan.change_summary}</p><div className="plan-grid"><div><h3>Meals</h3>{currentPlan.content.meals.map((meal) => <article key={meal.name}><strong>{meal.name}</strong><p>{meal.description}</p></article>)}</div><div><h3>Training</h3>{currentPlan.content.workouts.map((workout) => <article key={workout.day}><strong>{workout.day}</strong><p>{workout.activity} · {workout.duration_minutes} min</p></article>)}</div></div><p>{currentPlan.content.rationale}</p><small>{currentPlan.content.disclaimer} · Source: {currentPlan.source}</small></section>}

    {currentPlan && <form className="card checkin" onSubmit={adapt}><p className="step">04 · Weekly check-in</p><h2>How did week {currentPlan.week_number} go?</h2><div className="grid"><label>Current weight (kg)<input type="number" min="35" max="300" step="0.1" value={checkIn.weight_kg} onChange={(e) => updateCheckIn('weight_kg', Number(e.target.value))} /></label><label>Average calories<input type="number" min="800" max="6000" value={checkIn.average_calories} onChange={(e) => updateCheckIn('average_calories', Number(e.target.value))} /></label><label>Workouts completed<input type="number" min="0" max="14" value={checkIn.workouts_completed} onChange={(e) => updateCheckIn('workouts_completed', Number(e.target.value))} /></label><label>Hunger (1–5)<input type="number" min="1" max="5" value={checkIn.hunger_level} onChange={(e) => updateCheckIn('hunger_level', Number(e.target.value))} /></label><label>Energy (1–5)<input type="number" min="1" max="5" value={checkIn.energy_level} onChange={(e) => updateCheckIn('energy_level', Number(e.target.value))} /></label><label>Difficulty (1–5)<input type="number" min="1" max="5" value={checkIn.difficulty_level} onChange={(e) => updateCheckIn('difficulty_level', Number(e.target.value))} /></label></div><label className="wide">Feedback<textarea value={checkIn.feedback} onChange={(e) => updateCheckIn('feedback', e.target.value)} placeholder="What helped or got in the way?" /></label><button disabled={loading}>Save check-in & adapt next week</button></form>}
    {plans.length > 1 && <section className="history"><p className="step">Plan history</p>{plans.map((plan) => <article key={plan.id}><strong>Week {plan.week_number}</strong><span>{plan.calorie_target_kcal} kcal</span><p>{plan.change_summary}</p></article>)}</section>}
    {dashboard.length > 0 && <section className="card dashboard"><p className="step">Dashboard</p><h2>Calorie target trend</h2><TrendChart points={dashboard} /><div className="history">{dashboard.map((point) => <article key={point.week_number}><strong>Week {point.week_number}</strong><p>Weight: {point.weight_kg ?? '—'} kg</p><p>Adherence: {point.adherence_percent ?? '—'}%</p><p>Hunger / energy: {point.hunger_level ?? '—'} / {point.energy_level ?? '—'}</p></article>)}</div></section>}
    <footer>General wellness estimates only — not medical advice.</footer>
  </main>
}

export default App
