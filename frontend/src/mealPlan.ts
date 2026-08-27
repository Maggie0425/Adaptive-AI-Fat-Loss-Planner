export interface Recipe {
  name: string
  emoji: string
  calories: number
  time: number
  ingredients: string[]
  seasonings: string[]
  steps: string[]
}

export interface MenuDay {
  day: string
  shortDay: string
  theme: string
  meals: Recipe[]
  snackCalories: number
  totalCalories: number
}

type RecipeTemplate = Omit<Recipe, 'calories'>

const breakfasts: RecipeTemplate[] = [
  { name: 'Berry yoghurt oat bowl', emoji: '🫐', time: 8, ingredients: ['rolled oats', 'Greek yoghurt', 'mixed berries', 'chia seeds'], seasonings: ['cinnamon', 'vanilla'], steps: ['Soak oats with a splash of water.', 'Top with yoghurt, berries and chia.', 'Finish with cinnamon and vanilla.'] },
  { name: 'Spinach egg toast', emoji: '🍳', time: 12, ingredients: ['2 eggs', 'wholegrain toast', 'baby spinach', 'cherry tomatoes'], seasonings: ['black pepper', 'smoked paprika'], steps: ['Wilt spinach and tomatoes in a pan.', 'Scramble in the eggs.', 'Serve over toasted wholegrain bread.'] },
  { name: 'Banana protein pancakes', emoji: '🥞', time: 15, ingredients: ['banana', 'egg', 'oats', 'Greek yoghurt'], seasonings: ['cinnamon', 'pinch of salt'], steps: ['Blend banana, egg and oats.', 'Cook small pancakes in a non-stick pan.', 'Serve with yoghurt.'] },
  { name: 'Apple cinnamon overnight oats', emoji: '🍎', time: 5, ingredients: ['rolled oats', 'milk', 'apple', 'Greek yoghurt'], seasonings: ['cinnamon', 'nutmeg'], steps: ['Mix oats, milk, yoghurt and spices.', 'Refrigerate overnight.', 'Top with diced apple before serving.'] },
  { name: 'Avocado cottage-cheese toast', emoji: '🥑', time: 8, ingredients: ['wholegrain toast', 'avocado', 'cottage cheese', 'tomato'], seasonings: ['lemon juice', 'chilli flakes', 'black pepper'], steps: ['Toast the bread.', 'Layer cottage cheese, avocado and tomato.', 'Season with lemon, chilli and pepper.'] },
  { name: 'Mango chia breakfast pot', emoji: '🥭', time: 6, ingredients: ['chia seeds', 'milk', 'mango', 'Greek yoghurt'], seasonings: ['vanilla', 'lime zest'], steps: ['Stir chia into milk and chill until thick.', 'Layer with yoghurt and mango.', 'Finish with lime zest.'] },
  { name: 'Mushroom breakfast wrap', emoji: '🌯', time: 14, ingredients: ['wholegrain wrap', 'eggs', 'mushrooms', 'spinach'], seasonings: ['garlic powder', 'black pepper'], steps: ['Sauté mushrooms and spinach.', 'Add eggs and scramble.', 'Wrap tightly and toast seam-side down.'] },
]

const lunches: RecipeTemplate[] = [
  { name: 'Lemon chicken grain bowl', emoji: '🥗', time: 22, ingredients: ['chicken breast', 'brown rice', 'cucumber', 'tomato', 'leafy greens'], seasonings: ['lemon', 'oregano', 'garlic', 'black pepper'], steps: ['Season and pan-sear the chicken.', 'Slice vegetables while rice warms.', 'Assemble and dress with lemon.'] },
  { name: 'Ginger tofu rice bowl', emoji: '🍚', time: 20, ingredients: ['firm tofu', 'rice', 'broccoli', 'carrot', 'edamame'], seasonings: ['soy sauce', 'ginger', 'sesame oil'], steps: ['Crisp tofu in a hot pan.', 'Steam the vegetables.', 'Combine with rice and ginger-soy dressing.'] },
  { name: 'Mediterranean tuna wrap', emoji: '🌯', time: 10, ingredients: ['tuna', 'wholegrain wrap', 'lettuce', 'tomato', 'cucumber'], seasonings: ['lemon', 'dill', 'black pepper'], steps: ['Mix tuna with lemon and dill.', 'Layer vegetables and tuna on the wrap.', 'Roll firmly and slice.'] },
  { name: 'Roasted chickpea quinoa salad', emoji: '🥙', time: 24, ingredients: ['chickpeas', 'quinoa', 'capsicum', 'cucumber', 'rocket'], seasonings: ['cumin', 'paprika', 'lemon'], steps: ['Roast chickpeas with cumin and paprika.', 'Cook quinoa and cool slightly.', 'Toss everything with lemon.'] },
  { name: 'Turkey pesto pasta salad', emoji: '🍝', time: 18, ingredients: ['lean turkey', 'wholemeal pasta', 'spinach', 'tomatoes'], seasonings: ['basil pesto', 'black pepper'], steps: ['Cook pasta until just tender.', 'Brown the turkey in a pan.', 'Toss with spinach, tomatoes and pesto.'] },
  { name: 'Miso salmon soba bowl', emoji: '🍜', time: 22, ingredients: ['salmon', 'soba noodles', 'cabbage', 'carrot'], seasonings: ['miso', 'rice vinegar', 'ginger'], steps: ['Brush salmon with miso and bake.', 'Cook soba and rinse.', 'Toss noodles with vegetables and dressing.'] },
  { name: 'Herby lentil feta bowl', emoji: '🫘', time: 15, ingredients: ['lentils', 'feta', 'cucumber', 'tomato', 'wholegrain pita'], seasonings: ['parsley', 'lemon', 'sumac'], steps: ['Rinse and drain lentils.', 'Chop vegetables and herbs.', 'Toss with feta, lemon and sumac.'] },
]

const dinners: RecipeTemplate[] = [
  { name: 'Garlic chicken tray bake', emoji: '🍗', time: 35, ingredients: ['chicken thigh', 'baby potatoes', 'zucchini', 'capsicum'], seasonings: ['garlic', 'rosemary', 'olive oil'], steps: ['Heat oven to 210°C.', 'Toss everything with seasonings.', 'Roast until chicken is cooked and vegetables are golden.'] },
  { name: 'Beef and broccoli stir-fry', emoji: '🥦', time: 20, ingredients: ['lean beef strips', 'broccoli', 'capsicum', 'rice'], seasonings: ['soy sauce', 'ginger', 'garlic'], steps: ['Sear beef quickly and set aside.', 'Stir-fry vegetables until crisp-tender.', 'Return beef, add sauce and serve with rice.'] },
  { name: 'Tomato basil turkey meatballs', emoji: '🍅', time: 32, ingredients: ['turkey mince', 'wholemeal pasta', 'tomato passata', 'spinach'], seasonings: ['basil', 'garlic', 'black pepper'], steps: ['Shape and brown the meatballs.', 'Simmer in passata until cooked.', 'Serve with pasta and wilted spinach.'] },
  { name: 'Coconut tofu vegetable curry', emoji: '🍛', time: 26, ingredients: ['firm tofu', 'light coconut milk', 'mixed vegetables', 'rice'], seasonings: ['curry powder', 'turmeric', 'lime'], steps: ['Brown tofu cubes.', 'Simmer vegetables with coconut milk and spices.', 'Return tofu and serve with rice and lime.'] },
  { name: 'Paprika salmon and greens', emoji: '🐟', time: 25, ingredients: ['salmon fillet', 'sweet potato', 'green beans', 'Greek yoghurt'], seasonings: ['paprika', 'lemon', 'dill'], steps: ['Roast sweet potato until nearly tender.', 'Add seasoned salmon and green beans.', 'Serve with lemon-dill yoghurt.'] },
  { name: 'Chicken fajita bowl', emoji: '🌶️', time: 24, ingredients: ['chicken breast', 'rice', 'capsicum', 'corn', 'avocado'], seasonings: ['cumin', 'paprika', 'lime'], steps: ['Cook seasoned chicken strips.', 'Sauté capsicum and corn.', 'Build the bowl with rice, avocado and lime.'] },
  { name: 'Lentil shepherd’s pie', emoji: '🥔', time: 38, ingredients: ['lentils', 'potatoes', 'carrot', 'peas', 'mushrooms'], seasonings: ['thyme', 'tomato paste', 'black pepper'], steps: ['Cook the lentil and vegetable filling.', 'Top with mashed potato.', 'Bake until bubbling and golden.'] },
]

const days = [['Monday', 'MON', 'Fresh start'], ['Tuesday', 'TUE', 'High protein'], ['Wednesday', 'WED', 'Plant powered'], ['Thursday', 'THU', 'Quick & easy'], ['Friday', 'FRI', 'Comfort food'], ['Saturday', 'SAT', 'Colourful plates'], ['Sunday', 'SUN', 'Prep friendly']]

export function buildWeeklyMenu(target: number): MenuDay[] {
  const breakfastCalories = Math.round(target * 0.24)
  const lunchCalories = Math.round(target * 0.33)
  const dinnerCalories = Math.round(target * 0.36)
  const snackCalories = Math.max(0, target - breakfastCalories - lunchCalories - dinnerCalories)
  return days.map(([day, shortDay, theme], index) => ({
    day,
    shortDay,
    theme,
    meals: [
      { ...breakfasts[index], calories: breakfastCalories },
      { ...lunches[index], calories: lunchCalories },
      { ...dinners[index], calories: dinnerCalories },
    ],
    snackCalories,
    totalCalories: breakfastCalories + lunchCalories + dinnerCalories + snackCalories,
  }))
}
