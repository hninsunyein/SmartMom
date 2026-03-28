'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import apiService from '../../../services/api';

// ─── Static data ─────────────────────────────────────────────────────────────

const FOOD_ITEMS = [
  { value: 'rice',    label: 'Rice',    cal: 130 },
  { value: 'bread',   label: 'Bread',   cal: 265 },
  { value: 'noodles', label: 'Noodles', cal: 138 },
  { value: 'egg',     label: 'Egg',     cal: 155 },
  { value: 'chicken', label: 'Chicken', cal: 239 },
  { value: 'fish',    label: 'Fish',    cal: 206 },
  { value: 'milk',    label: 'Milk',    cal: 61  },
  { value: 'banana',  label: 'Banana',  cal: 89  },
  { value: 'apple',   label: 'Apple',   cal: 52  },
];

const AGE_GROUPS = [
  { value: '0-2',   label: '0-2 years (Infant)'     },
  { value: '3-5',   label: '3-5 years (Toddler)'    },
  { value: '6-12',  label: '6-12 years (School Age)'},
  { value: '13-18', label: '13-18 years (Teen)'     },
];

const GOALS = [
  {
    value: 'weight_gain',
    label: 'Weight Gain Plan',
    desc: 'Build healthy body mass with calorie-rich, protein-packed meals designed for steady growth.',
    color: 'from-orange-400 to-amber-500',
    bg: 'bg-orange-50', border: 'border-orange-300', ring: 'ring-orange-400',
    abbr: 'WG',
  },
  {
    value: 'height_growth',
    label: 'Height Growth Plan',
    desc: 'Support bone development and height with calcium, vitamin D, and growth-boosting nutrients.',
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50', border: 'border-blue-300', ring: 'ring-blue-400',
    abbr: 'HG',
  },
  {
    value: 'immunity_boost',
    label: 'Immunity Boost Plan',
    desc: 'Strengthen the immune system with antioxidant-rich foods, vitamins C & E, and zinc.',
    color: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50', border: 'border-emerald-300', ring: 'ring-emerald-400',
    abbr: 'IB',
  },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TIMES = ['breakfast', 'lunch', 'dinner'];
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAgeYears(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function getAgeGroupFromDob(dateOfBirth) {
  const age = getAgeYears(dateOfBirth);
  if (age <= 2)  return '0-2';
  if (age <= 5)  return '3-5';
  if (age <= 12) return '6-12';
  return '13-18';
}

function calcBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm) return null;
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

function buildWeekPlan(mealPlan) {
  const plan = {};
  for (let w = 1; w <= 4; w++) {
    plan[w] = {};
    for (let d = 1; d <= 7; d++) {
      const idx = ((w - 1) * 7 + (d - 1)) % mealPlan.breakfast.length;
      plan[w][d] = {
        breakfast: mealPlan.breakfast[idx % mealPlan.breakfast.length],
        lunch:     mealPlan.lunch[idx % mealPlan.lunch.length],
        dinner:    mealPlan.dinner[idx % mealPlan.dinner.length],
      };
    }
  }
  return plan;
}

function nutritionRecordsToWeekPlan(records) {
  const plan = {};
  for (let w = 1; w <= 4; w++) {
    plan[w] = {};
    for (let d = 1; d <= 7; d++) {
      plan[w][d] = { breakfast: '', lunch: '', dinner: '' };
    }
  }
  for (const r of records) {
    const wm = (r.notes || '').match(/Week:(\d+)/);
    const dm = (r.notes || '').match(/Day:(\d+)/);
    if (wm && dm) {
      const w = parseInt(wm[1]);
      const d = parseInt(dm[1]);
      if (plan[w]?.[d]) {
        plan[w][d] = { breakfast: r.breakfast || '', lunch: r.lunch || '', dinner: r.dinner || '' };
      }
    }
  }
  return plan;
}

// ─── Modal: Existing plan this month ─────────────────────────────────────────

function MonthlyBlockModal({ onDelete, onCancel, onViewPlan, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h3 className="text-gray-800 font-bold text-center mb-2">Meal Plan Already Exists</h3>
        <p className="text-gray-500 text-sm text-center mb-5">
          You have already generated a meal plan this month. Delete the existing plan to generate a new one.
        </p>
        <div className="space-y-2">
          <button onClick={onViewPlan}
            className="w-full px-4 py-2 rounded-xl bg-[#667eea] text-white font-semibold text-sm hover:opacity-90">
            View Current Plan
          </button>
          <button onClick={onDelete} disabled={deleting}
            className="w-full px-4 py-2 rounded-xl border-2 border-red-300 text-red-600 font-semibold text-sm hover:bg-red-50 disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete Plan and Generate New'}
          </button>
          <button onClick={onCancel}
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Replace confirm (free plan) ──────────────────────────────────────

function ReplaceConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-gray-800 font-bold text-center mb-2">Replace Existing Plan?</h3>
        <p className="text-gray-500 text-sm text-center mb-5">
          You already have a saved meal plan for this child. Saving will replace it.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-sm hover:opacity-90">
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Week Plan Grid (read-only or with cycle navigation) ─────────────────────

function WeekPlannerGrid({ weekPlan, setWeekPlan, mealPlan, activeWeek, setActiveWeek, readOnly }) {
  const cycleOption = (week, day, mealTime, dir) => {
    if (readOnly || !mealPlan) return;
    const opts = mealPlan[mealTime];
    const cur = weekPlan[week]?.[day]?.[mealTime] || opts[0];
    const idx = opts.indexOf(cur);
    const next = opts[(idx + dir + opts.length) % opts.length];
    setWeekPlan(prev => ({
      ...prev,
      [week]: { ...prev[week], [day]: { ...prev[week][day], [mealTime]: next } },
    }));
  };

  return (
    <div>
      {/* Week tabs */}
      <div className="flex gap-2 mb-5 border-b border-gray-100 pb-3">
        {[1, 2, 3, 4].map(w => (
          <button key={w} onClick={() => setActiveWeek(w)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeWeek === w
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            Week {w}
          </button>
        ))}
      </div>

      {/* Day rows */}
      <div className="space-y-0 divide-y divide-gray-100">
        {DAYS.map((dayLabel, idx) => {
          const day = idx + 1;
          const cell = weekPlan?.[activeWeek]?.[day] || {};
          return (
            <div key={day} className="py-4">
              <div className="text-sm font-bold text-[#764ba2] mb-3 uppercase tracking-wide">{dayLabel}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MEAL_TIMES.map(mt => (
                  <div key={mt}>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      {MEAL_LABELS[mt]}
                    </div>
                    <div className={`text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 leading-relaxed min-h-[48px] ${!readOnly && mealPlan ? 'pr-16' : ''} relative`}>
                      <span>{cell[mt] || '—'}</span>
                      {!readOnly && mealPlan && (
                        <div className="absolute right-1 top-1 flex gap-0.5">
                          <button onClick={() => cycleOption(activeWeek, day, mt, -1)}
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-gray-500 text-xs font-bold flex items-center justify-center leading-none">
                            &lt;
                          </button>
                          <button onClick={() => cycleOption(activeWeek, day, mt, 1)}
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-gray-500 text-xs font-bold flex items-center justify-center leading-none">
                            &gt;
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Meal option selector (free plan) ────────────────────────────────────────

function MealOptionSelector({ label, options, selected, onChange }) {
  return (
    <div className="mb-4">
      <div className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{label}</div>
      <div className="space-y-1.5">
        {options.map((option, i) => (
          <button key={i} onClick={() => onChange(option)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border-2 transition-all ${
              selected === option
                ? 'border-[#667eea] bg-purple-50 text-[#764ba2] font-semibold'
                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
            }`}>
            {selected === option && (
              <svg className="inline w-3.5 h-3.5 mr-1.5 text-[#667eea]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── History Panel ────────────────────────────────────────────────────────────

function HistoryPanel({ history, onView }) {
  if (!history.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-sm">No plan history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry, i) => (
        <div key={`${entry.year}-${entry.month}`}
          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-800 text-sm">{entry.monthLabel}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              Age group: {AGE_GROUPS.find(a => a.value === entry.ageGroup)?.label || entry.ageGroup}
              {entry.goals?.length > 0 && (
                <span className="ml-2">
                  {entry.goals.map(g => GOALS.find(x => x.value === g)?.label || g).join(', ')}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-300 mt-0.5">{entry.recordCount} day records</div>
          </div>
          <button onClick={() => onView(entry)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#667eea] text-[#667eea] font-semibold hover:bg-purple-50 whitespace-nowrap">
            View Plan
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Shopping List Panel ──────────────────────────────────────────────────────

function ShoppingListPanel({ items, onClose }) {
  const grouped = {};
  for (const item of items) {
    const letter = item[0]?.toUpperCase() || '#';
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(item);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-800">Shopping List</h3>
          <p className="text-xs text-gray-400 mt-0.5">{items.length} unique ingredients</p>
        </div>
        <button onClick={onClose}
          className="text-sm text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1 rounded-lg">
          Close
        </button>
      </div>
      {Object.entries(grouped).sort().map(([letter, list]) => (
        <div key={letter} className="mb-4">
          <div className="text-xs font-bold text-[#764ba2] mb-1.5 uppercase">{letter}</div>
          <div className="flex flex-wrap gap-2">
            {list.map((ing, i) => (
              <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs">
                {ing}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NutritionTab() {
  const user = useSelector(state => state.auth.user);
  const isPremium = user?.planType === 'premium';

  // Calculator
  const [activeSection, setActiveSection] = useState('calculator');
  const [foodItem, setFoodItem]           = useState('rice');
  const [amount, setAmount]               = useState(100);
  const [calorieResult, setCalorieResult] = useState(null);

  // Planner shared
  const [children, setChildren]                 = useState([]);
  const [selectedChildId, setSelectedChildId]   = useState('');
  const [ageGroup, setAgeGroup]                 = useState('3-5');
  const [ageGroupAutoDetected, setAgeGroupAutoDetected] = useState(false);
  const [selectedGoals, setSelectedGoals]       = useState(['weight_gain']);
  const [bmiValue, setBmiValue]                 = useState('');
  const [bmiAutoDetected, setBmiAutoDetected]   = useState(false);
  const [mealPlan, setMealPlan]                 = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [saving, setSaving]                     = useState(false);
  const [saveMsg, setSaveMsg]                   = useState('');

  // Modals
  const [showMonthlyBlock, setShowMonthlyBlock]     = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [deletingPlan, setDeletingPlan]             = useState(false);

  // Free plan
  const [activePlan, setActivePlan]             = useState(null);
  const [selectedMeals, setSelectedMeals]       = useState({ breakfast: '', lunch: '', dinner: '' });
  const [viewingCurrentPlan, setViewingCurrentPlan] = useState(false);

  // Premium
  const [weekPlan, setWeekPlan]             = useState(null);
  const [activeWeek, setActiveWeek]         = useState(1);
  const [planHistory, setPlanHistory]       = useState([]);
  const [shoppingList, setShoppingList]     = useState(null);
  const [plannerView, setPlannerView]       = useState('setup'); // 'setup'|'weekplan'|'history'|'shopping'
  const [viewingReadOnly, setViewingReadOnly] = useState(false);

  // ── Fetch children on mount ───────────────────────────────────────────────
  useEffect(() => {
    apiService.getChildren()
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setChildren(res.data);
          setSelectedChildId(String(res.data[0].id));
        }
      })
      .catch(() => {});
  }, []);

  // ── When child changes: auto-detect age group & BMI, fetch plan data ──────
  useEffect(() => {
    if (!selectedChildId) return;

    const child = children.find(c => String(c.id) === String(selectedChildId));
    if (child?.dateOfBirth) {
      setAgeGroup(getAgeGroupFromDob(child.dateOfBirth));
      setAgeGroupAutoDetected(true);
    } else {
      setAgeGroupAutoDetected(false);
    }

    setBmiValue('');
    setBmiAutoDetected(false);
    apiService.getGrowthHistory(selectedChildId)
      .then(res => {
        if (!res.success || !res.data?.length) return;
        const latest = res.data.find(r => r.weight && r.height);
        if (!latest) return;
        const bmi = latest.bmi
          ? String(latest.bmi)
          : String(calcBmi(latest.weight, latest.height) ?? '');
        if (bmi) { setBmiValue(bmi); setBmiAutoDetected(true); }
      })
      .catch(() => {});

    apiService.getActiveMealPlan(selectedChildId)
      .then(res => { if (res.success) setActivePlan(res.data); })
      .catch(() => {});

    if (isPremium) {
      apiService.getMealPlanHistory(selectedChildId)
        .then(res => { if (res.success) setPlanHistory(res.data); })
        .catch(() => {});
    }

    setMealPlan(null);
    setWeekPlan(null);
    setShoppingList(null);
    setPlannerView('setup');
    setViewingReadOnly(false);
    setViewingCurrentPlan(false);
  }, [selectedChildId, children, isPremium]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const toggleGoal = goal => setSelectedGoals(prev =>
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

  const handleGenerateClick = async () => {
    if (!selectedChildId) { setSaveMsg('Please select a child first.'); return; }
    // Check if a plan already exists this month
    try {
      const res = await apiService.checkMonthlyPlan(selectedChildId);
      if (res.success && res.data.exists) {
        setShowMonthlyBlock(true);
        return;
      }
    } catch { /* proceed */ }
    await runGenerate();
  };

  const runGenerate = async () => {
    setLoading(true);
    setSaveMsg('');
    try {
      const res = await apiService.generateMealPlan(ageGroup, selectedGoals);
      if (res.success) {
        const data = res.data;
        setMealPlan(data);
        setSelectedMeals({ breakfast: data.breakfast[0], lunch: data.lunch[0], dinner: data.dinner[0] });
        if (isPremium) {
          setWeekPlan(buildWeekPlan(data));
          setPlannerView('weekplan');
          setViewingReadOnly(false);
          setActiveWeek(1);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDeleteAndGenerate = async () => {
    setDeletingPlan(true);
    try {
      await apiService.deleteCurrentMonthPlan(selectedChildId);
      setActivePlan(null);
      setShowMonthlyBlock(false);
      setViewingCurrentPlan(false);
      await runGenerate();
    } catch (e) { console.error(e); }
    finally { setDeletingPlan(false); }
  };

  const handleViewCurrentPlan = () => {
    setShowMonthlyBlock(false);
    if (isPremium) {
      setPlannerView('weekplan');
      if (activePlan?.items?.length) {
        setWeekPlan(nutritionRecordsToWeekPlan(activePlan.items));
        setViewingReadOnly(true);
      }
    } else {
      // Free user — show saved single-day plan
      setViewingCurrentPlan(true);
      setMealPlan(null);
    }
  };

  const handleSave = async () => {
    if (!mealPlan) return;
    if (!selectedChildId) { setSaveMsg('Please select a child first.'); return; }
    if (!isPremium && activePlan) { setShowReplaceConfirm(true); return; }
    await doSave();
  };

  const doSave = async () => {
    setSaving(true);
    setShowReplaceConfirm(false);
    setSaveMsg('');
    try {
      let weekData = null;
      if (isPremium && weekPlan) {
        weekData = [];
        for (let w = 1; w <= 4; w++) {
          for (let d = 1; d <= 7; d++) {
            weekData.push({
              week: w, day: d,
              breakfast: weekPlan[w]?.[d]?.breakfast || mealPlan.breakfast[0],
              lunch:     weekPlan[w]?.[d]?.lunch     || mealPlan.lunch[0],
              dinner:    weekPlan[w]?.[d]?.dinner    || mealPlan.dinner[0],
            });
          }
        }
      }

      const res = await apiService.saveMealSelection({
        childId:       +selectedChildId,
        ageGroup,
        goals:         selectedGoals,
        mealPlan:      { breakfast: mealPlan.breakfast, lunch: mealPlan.lunch, dinner: mealPlan.dinner },
        planVersion:   isPremium ? 'premium' : 'free',
        bmiValue:      bmiValue ? +bmiValue : null,
        selectedMeals: weekData,
      });

      if (res.success) {
        setActivePlan(res.data);
        setSaveMsg('Plan saved successfully.');
        setViewingReadOnly(true);
        if (isPremium) {
          apiService.getMealPlanHistory(selectedChildId)
            .then(r => { if (r.success) setPlanHistory(r.data); })
            .catch(() => {});
        }
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (e) {
      setSaveMsg('Failed to save. Please try again.');
      console.error(e);
    } finally { setSaving(false); }
  };

  const handleViewHistoryPlan = async (entry) => {
    try {
      const res = await apiService.getMonthPlan(selectedChildId, entry.year, entry.month);
      if (res.success && res.data?.length) {
        setWeekPlan(nutritionRecordsToWeekPlan(res.data));
        setViewingReadOnly(true);
        setMealPlan(null);
        setActiveWeek(1);
        setPlannerView('weekplan');
      }
    } catch (e) { console.error(e); }
  };

  const handleLoadShoppingList = async () => {
    if (!activePlan) return;
    try {
      const res = await apiService.getShoppingList(activePlan.id);
      if (res.success) { setShoppingList(res.data); setPlannerView('shopping'); }
    } catch (e) { console.error(e); }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Modals */}
      {showMonthlyBlock && (
        <MonthlyBlockModal
          deleting={deletingPlan}
          onDelete={handleDeleteAndGenerate}
          onCancel={() => setShowMonthlyBlock(false)}
          onViewPlan={handleViewCurrentPlan}
        />
      )}
      {showReplaceConfirm && (
        <ReplaceConfirmModal onConfirm={doSave} onCancel={() => setShowReplaceConfirm(false)} />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem] flex items-center justify-between">
        <span>Nutrition Planning System</span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isPremium ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 text-white'}`}>
          {isPremium ? 'Premium' : 'Free'}
        </span>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'calculator', label: 'Nutrition Calculator' },
          { id: 'planner',    label: 'Meal Planner'         },
        ].map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              s.id === activeSection
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ══ CALCULATOR ══════════════════════════════════════════════════════ */}
      {activeSection === 'calculator' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">
              Calorie Calculator
            </div>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Food Item</label>
              <select value={foodItem} onChange={e => setFoodItem(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm">
                {FOOD_ITEMS.map(f => (
                  <option key={f.value} value={f.value}>{f.label} — {f.cal} kcal / 100g</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Amount (grams / ml)</label>
              <input type="number" value={amount} onChange={e => setAmount(+e.target.value)} min={1}
                placeholder="100"
                className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm" />
            </div>
            <button onClick={calculate}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
              Calculate
            </button>
          </div>

          <div className={`rounded-2xl p-8 flex items-center justify-center min-h-[200px] text-center border-2 border-[#667eea] ${
            calorieResult ? 'bg-gradient-to-br from-[#667eea] to-[#764ba2]' : 'bg-gray-50'}`}>
            {calorieResult ? (
              <div className="text-white">
                <div className="text-sm mb-2 opacity-90">Total Calories</div>
                <div className="text-8xl font-bold leading-none">{calorieResult.totalCalories}</div>
                <div className="text-xl mt-2 opacity-85">kcal</div>
                <div className="text-xs mt-3 opacity-70">
                  for {calorieResult.amount}g of {calorieResult.foodItem}
                </div>
              </div>
            ) : (
              <div className="text-gray-400">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm">Select a food item and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ MEAL PLANNER ════════════════════════════════════════════════════ */}
      {activeSection === 'planner' && (
        <div>
          {/* Active plan banner */}
          {activePlan && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm">
                <span className="font-semibold text-green-700">Active Plan</span>
                <span className="text-green-600 ml-2">{activePlan.ageGroup}</span>
                <span className="text-green-400 ml-1 text-xs">
                  {new Date(activePlan.generatedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex gap-2">
                {!isPremium && (
                  <button onClick={() => { setViewingCurrentPlan(true); setMealPlan(null); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
                    View Current Plan
                  </button>
                )}
                {isPremium && (
                  <button onClick={handleLoadShoppingList}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">
                    Shopping List
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Premium nav tabs */}
          {isPremium && (
            <div className="flex gap-2 mb-5 border-b border-gray-100 pb-3">
              {[
                { id: 'setup',    label: 'Setup'        },
                { id: 'weekplan', label: '4-Week Plan'  },
                { id: 'history',  label: 'History'      },
                { id: 'shopping', label: 'Shopping List'},
              ].map(v => (
                <button key={v.id} onClick={() => setPlannerView(v.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    plannerView === v.id
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {v.label}
                </button>
              ))}
            </div>
          )}

          {/* ── SETUP ── */}
          {(plannerView === 'setup' || !isPremium) && (
            <div>
              {/* Child selector */}
              {children.length > 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
                  <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-4 shadow">
                    Select Child
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {children.map(child => {
                      const ageYrs = child.dateOfBirth ? getAgeYears(child.dateOfBirth) : null;
                      return (
                        <button key={child.id}
                          onClick={() => setSelectedChildId(String(child.id))}
                          className={`px-4 py-3 rounded-xl text-left border-2 transition-all ${
                            String(selectedChildId) === String(child.id)
                              ? 'border-[#667eea] bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          <div className="text-sm font-semibold text-gray-800">{child.name}</div>
                          {ageYrs !== null && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              {ageYrs} years old · {AGE_GROUPS.find(a => a.value === getAgeGroupFromDob(child.dateOfBirth))?.label}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-amber-700 text-sm">
                  No children found. Please add a child from the Children tab first.
                </div>
              )}

              {/* Age Group */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
                <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-4 shadow flex items-center justify-between">
                  <span>Age Group</span>
                  {ageGroupAutoDetected && (
                    <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">
                      Auto-detected from date of birth
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {AGE_GROUPS.map(ag => (
                    <button key={ag.value}
                      onClick={() => { setAgeGroup(ag.value); setAgeGroupAutoDetected(false); }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        ageGroup === ag.value
                          ? 'border-[#667eea] bg-purple-50 text-[#764ba2]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {ag.label}
                    </button>
                  ))}
                </div>
                {ageGroupAutoDetected && selectedChildId && (
                  <div className="mt-3 text-xs text-gray-400">
                    Selected based on child's date of birth
                    {children.find(c => String(c.id) === String(selectedChildId))?.dateOfBirth &&
                      ` (age ${getAgeYears(children.find(c => String(c.id) === String(selectedChildId)).dateOfBirth)} years)`
                    }
                  </div>
                )}
              </div>

              {/* Nutrition Goals */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
                <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">
                  Nutrition Goals
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  {GOALS.map(goal => {
                    const selected = selectedGoals.includes(goal.value);
                    return (
                      <button key={goal.value} type="button" onClick={() => toggleGoal(goal.value)}
                        className={`relative rounded-2xl p-5 text-left border-2 transition-all cursor-pointer hover:shadow-md ${
                          selected
                            ? `${goal.bg} ${goal.border} ring-2 ${goal.ring} shadow-md`
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}>
                        {selected && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-[#667eea] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className={`w-10 h-10 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center text-white font-bold text-sm mb-3`}>
                          {goal.abbr}
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm mb-1">{goal.label}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{goal.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* BMI */}
                <div className="mb-5">
                  <label className="flex items-center gap-2 text-[#764ba2] font-semibold mb-1.5 text-sm">
                    BMI Value
                    {bmiAutoDetected && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Auto-calculated from growth data
                      </span>
                    )}
                    {!bmiAutoDetected && selectedChildId && (
                      <span className="text-gray-400 font-normal text-xs">No growth data — enter manually</span>
                    )}
                  </label>
                  <input
                    type="number" step="0.01" min="0" value={bmiValue}
                    onChange={e => { setBmiValue(e.target.value); setBmiAutoDetected(false); }}
                    placeholder="e.g. 18.5"
                    className={`w-40 px-4 py-2.5 border-2 rounded-xl focus:outline-none text-sm ${
                      bmiAutoDetected
                        ? 'border-green-400 bg-green-50 focus:border-green-500'
                        : 'border-[#667eea] focus:border-[#764ba2]'
                    }`}
                  />
                </div>

                <button onClick={handleGenerateClick}
                  disabled={loading || selectedGoals.length === 0}
                  className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50">
                  {loading ? 'Generating...' : isPremium ? 'Generate 4-Week Plan' : 'Generate Meal Plan'}
                </button>
              </div>

              {/* Free: generated plan + select option + save */}
              {!isPremium && mealPlan && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
                  <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">
                    Generated Plan — {mealPlan.ageGroupLabel || mealPlan.ageGroup}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Select one option for each meal:</p>

                  <MealOptionSelector label="Breakfast" options={mealPlan.breakfast}
                    selected={selectedMeals.breakfast}
                    onChange={v => setSelectedMeals(p => ({ ...p, breakfast: v }))} />
                  <MealOptionSelector label="Lunch" options={mealPlan.lunch}
                    selected={selectedMeals.lunch}
                    onChange={v => setSelectedMeals(p => ({ ...p, lunch: v }))} />
                  <MealOptionSelector label="Dinner" options={mealPlan.dinner}
                    selected={selectedMeals.dinner}
                    onChange={v => setSelectedMeals(p => ({ ...p, dinner: v }))} />

                  {saveMsg && (
                    <div className={`text-sm font-semibold mb-3 px-3 py-2 rounded-lg ${
                      saveMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {saveMsg}
                    </div>
                  )}

                  <div className="flex gap-3 flex-wrap">
                    <button onClick={handleSave}
                      disabled={saving || !selectedMeals.breakfast || !selectedMeals.lunch || !selectedMeals.dinner}
                      className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save Plan'}
                    </button>
                    <button onClick={handleGenerateClick}
                      className="bg-gray-100 text-gray-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all text-sm">
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {/* Free: view current saved plan */}
              {!isPremium && viewingCurrentPlan && activePlan && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
                  <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow flex items-center justify-between">
                    <span>Current Saved Plan</span>
                    <button onClick={() => setViewingCurrentPlan(false)}
                      className="text-white/70 hover:text-white text-sm font-normal">
                      Close
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2.5 py-1 bg-[#f0eeff] text-[#667eea] rounded-lg font-semibold border border-[#a29bfe]">
                      {AGE_GROUPS.find(a => a.value === activePlan.ageGroup)?.label || activePlan.ageGroup}
                    </span>
                    {(activePlan.nutritionGoal || '').split(',').filter(Boolean).map(g => (
                      <span key={g} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg">
                        {GOALS.find(x => x.value === g)?.label || g}
                      </span>
                    ))}
                    <span className="text-xs text-gray-400 ml-1 self-center">
                      Saved {new Date(activePlan.generatedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['breakfast', 'lunch', 'dinner'].map(mealTime => {
                      const item = activePlan.items?.find(i => i.mealTime === mealTime);
                      return (
                        <div key={mealTime} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                          <div className="text-xs font-bold text-[#764ba2] uppercase tracking-wide mb-2">
                            {MEAL_LABELS[mealTime]}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {item?.mealPlanId || '—'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Free: feature comparison */}
              {!isPremium && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="text-gray-700 font-bold mb-3">Upgrade to Premium</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-500 mb-2">Free Plan</div>
                      <ul className="space-y-1.5 text-gray-500">
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-gray-300 rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>Generate meal plan</li>
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-gray-300 rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>Save one plan per child</li>
                        <li className="text-gray-300 line-through">4-week planner</li>
                        <li className="text-gray-300 line-through">Plan history</li>
                        <li className="text-gray-300 line-through">Shopping list</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold text-[#764ba2] mb-2">Premium Plan</div>
                      <ul className="space-y-1.5 text-[#764ba2]">
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#667eea] rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>Generate meal plan</li>
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#667eea] rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>Unlimited plan history</li>
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#667eea] rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>4-week planner grid</li>
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#667eea] rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>Auto shopping list</li>
                        <li className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 bg-[#667eea] rounded-full inline-flex items-center justify-center flex-shrink-0"><svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8"><path d="M6.5 1.5L3 5 1.5 3.5" stroke="white" strokeWidth="1.2" fill="none"/></svg></span>BMI tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── 4-WEEK PLAN VIEW (premium) ── */}
          {isPremium && plannerView === 'weekplan' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow flex items-center justify-between">
                <span>4-Week Meal Plan</span>
                <div className="flex items-center gap-3">
                  {viewingReadOnly && (
                    <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">View only</span>
                  )}
                  <button onClick={() => { setPlannerView('setup'); setViewingReadOnly(false); setMealPlan(null); }}
                    className="text-white/80 hover:text-white text-sm font-normal">
                    Setup
                  </button>
                </div>
              </div>

              {weekPlan ? (
                <>
                  <WeekPlannerGrid
                    weekPlan={weekPlan}
                    setWeekPlan={setWeekPlan}
                    mealPlan={mealPlan}
                    activeWeek={activeWeek}
                    setActiveWeek={setActiveWeek}
                    readOnly={viewingReadOnly}
                  />

                  {!viewingReadOnly && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      {saveMsg && (
                        <div className={`text-sm font-semibold mb-3 px-3 py-2 rounded-lg ${
                          saveMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {saveMsg}
                        </div>
                      )}
                      <div className="flex gap-3 flex-wrap">
                        <button onClick={handleSave} disabled={saving}
                          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50">
                          {saving ? 'Saving...' : 'Save 4-Week Plan'}
                        </button>
                        <button onClick={() => { setPlannerView('setup'); setMealPlan(null); }}
                          className="bg-gray-100 text-gray-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-200 text-sm">
                          Regenerate
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Generate a plan first from the Setup tab</p>
                  <button onClick={() => setPlannerView('setup')}
                    className="mt-3 text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold hover:opacity-90">
                    Go to Setup
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY VIEW (premium) ── */}
          {isPremium && plannerView === 'history' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">
                Plan History
              </div>
              <HistoryPanel history={planHistory} onView={handleViewHistoryPlan} />
            </div>
          )}

          {/* ── SHOPPING LIST (premium) ── */}
          {isPremium && plannerView === 'shopping' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">
                Shopping List
              </div>
              {shoppingList ? (
                <ShoppingListPanel items={shoppingList} onClose={() => setPlannerView('weekplan')} />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Save a plan first to generate the shopping list</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
