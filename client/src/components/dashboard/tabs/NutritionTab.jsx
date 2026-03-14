'use client';

import { useState } from 'react';
import apiService from '../../../services/api';

const FOOD_ITEMS = [
  { value: 'rice', label: 'Rice (ထမင်း)', cal: 130 },
  { value: 'bread', label: 'Bread (ပေါင်မုန့်)', cal: 265 },
  { value: 'noodles', label: 'Noodles (ခေါက်ဆွဲ)', cal: 138 },
  { value: 'egg', label: 'Egg (ကြက်ဥ)', cal: 155 },
  { value: 'chicken', label: 'Chicken (ကြက်သား)', cal: 239 },
  { value: 'fish', label: 'Fish (ငါး)', cal: 206 },
  { value: 'milk', label: 'Milk (နို့)', cal: 61 },
  { value: 'banana', label: 'Banana (ငှက်ပျော)', cal: 89 },
  { value: 'apple', label: 'Apple (ပန်းသီး)', cal: 52 },
];

const AGE_GROUPS = [
  { value: '0-2', label: '👶 0-2 years' },
  { value: '3-5', label: '🧒 3-5 years' },
  { value: '6-12', label: '👦 6-12 years' },
  { value: '13-18', label: '👧 13-18 years' },
];

const GOALS = [
  {
    value: 'weight_gain',
    icon: '💪',
    label: 'Weight Gain Plan',
    desc: 'Build healthy body mass with calorie-rich, protein-packed meals designed for steady growth.',
    color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    ring: 'ring-orange-400',
  },
  {
    value: 'height_growth',
    icon: '📏',
    label: 'Height Growth Plan',
    desc: 'Support bone development and height with calcium, vitamin D, and growth-boosting nutrients.',
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    ring: 'ring-blue-400',
  },
  {
    value: 'immunity_boost',
    icon: '🛡️',
    label: 'Immunity Boost Plan',
    desc: 'Strengthen the immune system with antioxidant-rich foods, vitamins C & E, and zinc.',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    ring: 'ring-emerald-400',
  },
];

export default function NutritionTab() {
  const [activeSection, setActiveSection] = useState('calculator');
  const [foodItem, setFoodItem] = useState('rice');
  const [amount, setAmount] = useState(100);
  const [calorieResult, setCalorieResult] = useState(null);
  const [ageGroup, setAgeGroup] = useState('3-5');
  const [selectedGoals, setSelectedGoals] = useState(['weight_gain']);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goal) => setSelectedGoals(prev =>
    prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
  );

  const calculate = async () => {
    try {
      const res = await apiService.calculateCalories(foodItem, amount);
      if (res.success) setCalorieResult(res.data);
    } catch {
      const item = FOOD_ITEMS.find(f => f.value === foodItem);
      if (item) setCalorieResult({ totalCalories: Math.round(item.cal * amount / 100), foodItem, amount });
    }
  };

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await apiService.generateMealPlan(ageGroup, selectedGoals);
      if (res.success) setMealPlan(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">Nutrition Planning System</div>

      {/* Sub-section Tabs */}
      <div className="flex gap-2.5 mb-5">
        {[{ id: 'calculator', label: '🧮 Nutrition Calculator' }, { id: 'planner', label: '🍽️ Meal Planner' }].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={s.id === activeSection
              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55'
              : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm'}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── CALCULATOR ── */}
      {activeSection === 'calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">Calorie Calculator</div>

            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Select Food Item (အစားအသောက်ရွေးပါ)</label>
              <select value={foodItem} onChange={e => setFoodItem(e.target.value)} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                {FOOD_ITEMS.map(f => (
                  <option key={f.value} value={f.value}>{f.label} — {f.cal} kcal/100g</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Amount (grams/ml)</label>
              <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} min={1} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors" placeholder="100" />
            </div>

            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55" onClick={calculate}>Calculate</button>
          </div>

          {/* Calorie Result */}
          <div className={`rounded-[15px] p-[30px] flex items-center justify-center min-h-[200px] text-center border-[3px] border-[#667eea] ${calorieResult ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2]' : 'bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]'}`}>
            {calorieResult ? (
              <div className="text-white">
                <div className="text-base mb-2 opacity-90">Total Calories</div>
                <div className="text-[5rem] font-bold leading-none">{calorieResult.totalCalories}</div>
                <div className="text-xl mt-2 opacity-85">kcal</div>
                <div className="text-[0.85rem] mt-2.5 opacity-70">
                  for {calorieResult.amount}g of {calorieResult.foodItem}
                </div>
              </div>
            ) : (
              <div className="text-[#636e72] text-center">
                <div className="text-[3rem] mb-2.5">🍎</div>
                <p>Select a food item and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MEAL PLANNER ── */}
      {activeSection === 'planner' && (
        <div>
          {/* Age Group Selection */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">Age Group Selection</div>
            <h3 className="text-[#764ba2] font-bold mb-3">Select Child's Age Group</h3>
            <div className="text-center">
              {AGE_GROUPS.map(ag => (
                <span key={ag.value} onClick={() => setAgeGroup(ag.value)}
                  className={`inline-block bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all hover:scale-105 m-1${ageGroup === ag.value ? ' ring-2 ring-white outline outline-2 outline-[#667eea]' : ''}`}>
                  {ag.label}
                </span>
              ))}
            </div>
            <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm mt-3">
              <strong>Selected Age Group:</strong> {AGE_GROUPS.find(a => a.value === ageGroup)?.label}
            </div>
          </div>

          {/* Nutrition Goals */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">Select Nutrition Goals</div>
            <h3 className="text-purple-700 font-bold mb-4">Choose Your Plan(s)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
              {GOALS.map(goal => {
                const selected = selectedGoals.includes(goal.value);
                return (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => toggleGoal(goal.value)}
                    className={`relative rounded-2xl p-5 text-left border-2 transition-all duration-200 cursor-pointer hover:shadow-md active:scale-95 ${selected ? `${goal.bg} ${goal.border} ring-2 ${goal.ring} shadow-md` : 'bg-white border-gray-200 hover:border-gray-300'}`}
                  >
                    {selected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center text-2xl mb-3 shadow-sm`}>
                      {goal.icon}
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1.5">{goal.label}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{goal.desc}</p>
                  </button>
                );
              })}
            </div>
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55 mt-2.5" onClick={generatePlan} disabled={loading || selectedGoals.length === 0}>
              {loading ? 'Generating...' : '🍽️ Generate Meal Plan'}
            </button>
          </div>

          {/* Generated Meal Plan */}
          {mealPlan && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">Your Meal Plan — {mealPlan.ageGroupLabel || mealPlan.ageGroup}</div>
              {[
                { key: 'breakfast', label: '🌅 Breakfast' },
                { key: 'lunch', label: '☀️ Lunch' },
                { key: 'dinner', label: '🌙 Dinner' },
              ].map(({ key, label }) => (
                <div key={key} className="bg-gradient-to-r from-violet-500 to-purple-700 text-white rounded-xl p-4 mb-3">
                  <h3>{label}</h3>
                  {(mealPlan[key] || []).map((option, i) => (
                    <div key={i} className="bg-white text-[#764ba2] px-3 py-2 rounded-lg my-1 text-sm">{option}</div>
                  ))}
                </div>
              ))}
              <button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm w-full block mt-2.5" onClick={generatePlan}>
                🔄 Generate New Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
