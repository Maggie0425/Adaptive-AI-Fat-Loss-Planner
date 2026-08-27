import { useMemo, useState } from 'react'
import { buildWeeklyMenu } from './mealPlan'

export function DailyMenu({ calorieTarget, proteinTarget }: { calorieTarget: number; proteinTarget: number }) {
  const menu = useMemo(() => buildWeeklyMenu(calorieTarget), [calorieTarget])
  const [selectedDay, setSelectedDay] = useState(0)
  const [openRecipe, setOpenRecipe] = useState(0)
  const day = menu[selectedDay]

  return <section className="card menu-card">
    <div className="section-heading">
      <div><p className="step">04 · Daily menu</p><h2>What to cook this week</h2><p className="section-copy">A practical seven-day menu matched to your current target. Tap any dish for ingredients, seasonings and instructions.</p></div>
      <div className="macro-pill"><span>Daily guide</span><strong>{calorieTarget} kcal</strong><small>≈ {proteinTarget} g protein</small></div>
    </div>

    <div className="day-tabs" role="tablist" aria-label="Choose menu day">
      {menu.map((item, index) => <button key={item.day} type="button" role="tab" aria-selected={selectedDay === index} className={selectedDay === index ? 'day-tab active' : 'day-tab'} onClick={() => { setSelectedDay(index); setOpenRecipe(0) }}><span>{item.shortDay}</span><small>{item.theme}</small></button>)}
    </div>

    <div className="menu-summary"><div><span>{day.day}</span><strong>{day.theme}</strong></div><div><span>Planned total</span><strong>{day.totalCalories} kcal</strong></div><div><span>Flexible snack</span><strong>{day.snackCalories} kcal</strong></div></div>

    <div className="recipe-grid">
      {day.meals.map((recipe, index) => <article className={openRecipe === index ? 'recipe open' : 'recipe'} key={recipe.name}>
        <button type="button" className="recipe-head" aria-expanded={openRecipe === index} onClick={() => setOpenRecipe(openRecipe === index ? -1 : index)}>
          <span className="recipe-emoji" aria-hidden="true">{recipe.emoji}</span>
          <span><small>{['Breakfast', 'Lunch', 'Dinner'][index]}</small><strong>{recipe.name}</strong></span>
          <span className="recipe-meta"><b>{recipe.calories}</b> kcal · {recipe.time} min</span>
        </button>
        {openRecipe === index && <div className="recipe-body">
          <div><h4>Ingredients</h4><ul>{recipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><h4>Seasonings</h4><ul>{recipe.seasonings.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="method"><h4>How to make it</h4><ol>{recipe.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
        </div>}
      </article>)}
    </div>
    <p className="menu-note">Calories are planning estimates; brands, portions and cooking oils change the final value. Adjust ingredients for allergies and dietary needs.</p>
  </section>
}
