'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import apiService from '../../../services/api';

const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

function TodayMeals({ onNavigate }) {
  const { list: children } = useSelector((s) => s.children);
  const { user } = useSelector((s) => s.auth);
  const isPremium = user?.planType === 'premium';

  const [activePlan, setActivePlan] = useState(undefined); // undefined = loading
  const [selectedChildId, setSelectedChildId] = useState(null);

  // Pick first child on mount / when children load
  useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id);
    }
  }, [children]);

  // Fetch active meal plan whenever selectedChildId changes
  useEffect(() => {
    if (!selectedChildId) return;
    setActivePlan(undefined);
    apiService.getActiveMealPlan(selectedChildId)
      .then(res => setActivePlan(res.success ? res.data : null))
      .catch(() => setActivePlan(null));
  }, [selectedChildId]);

  // Extract meals from items array
  const getMeal = (mealTime) =>
    activePlan?.items?.find(i => i.mealTime === mealTime)?.mealPlanId || null;

  const isLoading = activePlan === undefined;
  const hasPlan   = activePlan !== null && activePlan !== undefined;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#764ba2] font-bold">Today&apos;s Meals</h3>
        {/* Child selector if multiple children */}
        {children.length > 1 && (
          <select
            value={selectedChildId || ''}
            onChange={e => setSelectedChildId(+e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none focus:border-[#667eea]">
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {children.length === 0 ? (
        <p className="text-gray-400 text-sm py-2">
          No children added yet.{' '}
          <button onClick={() => onNavigate('children')}
            className="text-[#667eea] font-semibold hover:underline">
            Add a child
          </button>{' '}
          to get started.
        </p>
      ) : isLoading ? (
        <p className="text-gray-400 text-sm py-2">Loading...</p>
      ) : !hasPlan ? (
        <div>
          <p className="text-gray-400 text-sm mb-3">
            No meal plan for today yet.
          </p>
          <button onClick={() => onNavigate('nutrition')}
            className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
            Generate Meal Plan
          </button>
        </div>
      ) : (
        <div>
          {['breakfast', 'lunch', 'dinner'].map(mt => {
            const meal = getMeal(mt);
            return (
              <div key={mt} className="bg-[#764ba2]/10 text-[#764ba2] px-3 py-2 rounded-lg mb-2 text-sm">
                <span className="font-semibold">{MEAL_LABELS[mt]}:</span>{' '}
                {meal || '—'}
              </div>
            );
          })}
          <button onClick={() => onNavigate('nutrition')}
            className="w-full mt-2 bg-gradient-to-r from-[#a8b5ff] to-[#b197fc] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
            Manage Meal Plan →
          </button>
        </div>
      )}
    </div>
  );
}

export default function OverviewTab({ onNavigate }) {
  const { user } = useSelector((s) => s.auth);
  const { list: children } = useSelector((s) => s.children);
  const { list: appointments } = useSelector((s) => s.appointments);

  const pendingAppts   = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed').length;

  /* ─── ADVISOR OVERVIEW ─── */
  if (user?.userType === 'advisor') {
    const stats = [
      { label: 'Pending Requests',    value: pendingAppts,       color: 'from-yellow-300 to-yellow-500', text: 'text-gray-800', tab: 'requests' },
      { label: 'Confirmed Today',     value: confirmedAppts,     color: 'from-emerald-400 to-green-600', text: 'text-white',    tab: 'requests' },
      { label: 'Total Appointments',  value: appointments.length,color: 'from-blue-400 to-blue-600',    text: 'text-white',    tab: 'requests' },
    ];

    return (
      <div>
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-lg px-5 py-3 rounded-xl mb-6 shadow">
          Advisor Dashboard
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {stats.map(({ label, value, color, text, tab }) => (
            <div key={label} onClick={() => onNavigate(tab)}
              className={`bg-gradient-to-br ${color} ${text} rounded-2xl p-5 cursor-pointer text-center hover:-translate-y-1 transition-transform shadow-md`}>
              <div className="text-3xl font-extrabold">{value}</div>
              <div className="text-sm mt-1 opacity-85">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[#764ba2] font-bold mb-3">Today&apos;s Appointments</h3>
            {confirmedAppts === 0 ? (
              <p className="text-gray-400 text-sm">No confirmed appointments yet</p>
            ) : (
              appointments.filter(a => a.status === 'confirmed').map(appt => (
                <div key={appt.id} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-xl mb-2 text-sm">
                  <strong>{appt.appointmentTime}</strong> — {appt.parent?.fullName} ({appt.child?.name})
                </div>
              ))
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-[#764ba2] font-bold mb-3">Quick Actions</h3>
            {[
              { label: 'View Appointment Requests', tab: 'requests' },
              { label: 'View My Clients',           tab: 'clients'  },
              { label: 'View My Schedule',          tab: 'schedule' },
            ].map(({ label, tab }) => (
              <button key={tab} onClick={() => onNavigate(tab)}
                className="w-full text-left bg-gradient-to-r from-[#a8b5ff] to-[#b197fc] text-white font-semibold px-4 py-2.5 rounded-xl mb-2 hover:opacity-90 active:scale-95 transition-all text-sm">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── PARENT OVERVIEW ─── */
  const statCards = [
    { label: 'Children',       value: children.length,    tab: 'children',     color: 'from-violet-400 to-purple-600', text: 'text-white'     },
    { label: 'Pending Appts',  value: pendingAppts,       tab: 'appointments', color: 'from-yellow-300 to-yellow-500', text: 'text-gray-800'  },
    { label: 'Confirmed',      value: confirmedAppts,     tab: 'appointments', color: 'from-emerald-400 to-green-600', text: 'text-white'     },
    { label: 'Growth Tracking',value: 'View',             tab: 'growth',       color: 'from-blue-400 to-blue-600',    text: 'text-white'     },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-lg px-5 py-3 rounded-xl mb-6 shadow">
        Welcome back, {user?.fullName?.split(' ')[0]}!
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, tab, color, text }) => (
          <div key={label} onClick={() => onNavigate(tab)}
            className={`bg-gradient-to-br ${color} ${text} rounded-2xl p-5 cursor-pointer text-center hover:-translate-y-1 transition-transform shadow-md`}>
            <div className="text-2xl font-extrabold">{value}</div>
            <div className="text-xs mt-1 opacity-85 font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Today's Meals — fetches real data */}
        <TodayMeals onNavigate={onNavigate} />

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[#764ba2] font-bold mb-3">Quick Actions</h3>
          {[
            { label: 'Update Measurements', tab: 'growth'     },
            { label: 'View Growth Charts',  tab: 'growth'     },
            { label: 'Book Appointment',    tab: 'appointments'},
            { label: 'Generate Meal Plan',  tab: 'nutrition'  },
          ].map(({ label, tab }) => (
            <button key={label} onClick={() => onNavigate(tab)}
              className="w-full text-left bg-gradient-to-r from-[#a8b5ff] to-[#b197fc] text-white font-semibold px-4 py-2.5 rounded-xl mb-2 hover:opacity-90 active:scale-95 transition-all text-sm">
              {label}
            </button>
          ))}
        </div>

        {/* Safety Tips */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[#764ba2] font-bold mb-3">Safety Tips</h3>
          <ul className="space-y-2 mb-3">
            {['Child-proof your home', 'Swimming safety', 'Road safety', 'Food choking prevention'].map(t => (
              <li key={t} className="bg-gray-50 border-l-4 border-[#764ba2] px-3 py-2 rounded-r-lg text-sm text-gray-600">
                <span className="text-[#667eea] font-bold">✓ </span>{t}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('tips')}
            className="w-full bg-gradient-to-r from-[#a8b5ff] to-[#b197fc] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
            View All Tips
          </button>
        </div>

        {/* Health Tips */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[#764ba2] font-bold mb-3">Health Tips</h3>
          <ul className="space-y-2 mb-3">
            {['Vaccination schedules', 'Sleep requirements', 'Physical activity', 'Dental care'].map(t => (
              <li key={t} className="bg-gray-50 border-l-4 border-[#764ba2] px-3 py-2 rounded-r-lg text-sm text-gray-600">
                <span className="text-[#667eea] font-bold">✓ </span>{t}
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('tips')}
            className="w-full bg-gradient-to-r from-[#a8b5ff] to-[#b197fc] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
            View All Tips
          </button>
        </div>
      </div>
    </div>
  );
}
