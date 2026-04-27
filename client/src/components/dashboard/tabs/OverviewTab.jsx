'use client';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
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
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#2C3E50] font-bold text-base">Today&apos;s Meals</h3>
        {/* Child selector if multiple children */}
        {children.length > 1 && (
          <select
            value={selectedChildId || ''}
            onChange={e => setSelectedChildId(+e.target.value)}
            className="text-xs border-2 border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[#64748B] focus:outline-none focus:border-[#8BA888]">
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {children.length === 0 ? (
        <p className="text-[#64748B] text-sm py-2">
          No children added yet.{' '}
          <button onClick={() => onNavigate('children')}
            className="text-[#8BA888] font-semibold hover:underline">
            Add a child
          </button>{' '}
          to get started.
        </p>
      ) : isLoading ? (
        <p className="text-[#64748B] text-sm py-2">Loading...</p>
      ) : !hasPlan ? (
        <div>
          <p className="text-[#64748B] text-sm mb-3">
            No meal plan for today yet.
          </p>
          <button onClick={() => onNavigate('nutrition')}
            className="w-full bg-[#8BA888] text-white font-semibold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all text-sm">
            Generate Meal Plan
          </button>
        </div>
      ) : (
        <div>
          {['breakfast', 'lunch', 'dinner'].map(mt => {
            const meal = getMeal(mt);
            return (
              <div key={mt} className="bg-[#F0F9F5] border border-[#8BA888]/20 text-[#2C3E50] px-4 py-3 rounded-lg mb-2 text-sm">
                <span className="font-semibold text-[#8BA888]">{MEAL_LABELS[mt]}:</span>{' '}
                {meal || '—'}
              </div>
            );
          })}
          <button onClick={() => onNavigate('nutrition')}
            className="w-full mt-2 bg-white border-2 border-[#8BA888] text-[#8BA888] font-semibold py-3 rounded-lg hover:bg-[#F0F9F5] transition-all text-sm">
            Manage Meal Plan
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
      { label: 'Pending Requests',    value: pendingAppts,       color: 'bg-[#FFF5F3] border-[#FF9B8F]/30', text: 'text-[#FF9B8F]', tab: 'requests' },
      { label: 'Confirmed Today',     value: confirmedAppts,     color: 'bg-[#F0F9F5] border-[#8BA888]/30', text: 'text-[#8BA888]', tab: 'requests' },
      { label: 'Total Appointments',  value: appointments.length,color: 'bg-[#F0F9FC] border-[#6BB6CC]/30', text: 'text-[#6BB6CC]', tab: 'requests' },
    ];

    return (
      <div>
        <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold text-xl px-6 py-4 rounded-lg mb-6 shadow-sm">
          Advisor Dashboard
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {stats.map(({ label, value, color, text, tab }) => (
            <div key={label} onClick={() => onNavigate(tab)}
              className={`${color} border-2 rounded-xl p-6 cursor-pointer text-center hover:shadow-md transition-all`}>
              <div className={`text-4xl font-bold ${text}`}>{value}</div>
              <div className="text-sm mt-2 text-[#64748B] font-medium">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
            <h3 className="text-[#2C3E50] font-bold mb-4 text-base">Today&apos;s Appointments</h3>
            {confirmedAppts === 0 ? (
              <p className="text-[#64748B] text-sm">No confirmed appointments yet</p>
            ) : (
              appointments.filter(a => a.status === 'confirmed').map(appt => (
                <div key={appt.id} className="bg-[#F0F9F5] border border-[#8BA888]/20 text-[#2C3E50] px-4 py-3 rounded-lg mb-2 text-sm">
                  <strong className="text-[#8BA888]">{appt.appointmentTime}</strong> — {appt.parent?.fullName} ({appt.child?.name})
                </div>
              ))
            )}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
            <h3 className="text-[#2C3E50] font-bold mb-4 text-base">Quick Actions</h3>
            {[
              { label: 'View Appointment Requests', tab: 'requests' },
              { label: 'View My Clients',           tab: 'clients'  },
              { label: 'View My Schedule',          tab: 'schedule' },
            ].map(({ label, tab }) => (
              <button key={tab} onClick={() => onNavigate(tab)}
                className="w-full text-left bg-[#8BA888] text-white font-semibold px-4 py-3 rounded-lg mb-2 hover:bg-[#6D8A6A] transition-all text-sm">
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
    { label: 'Children',       value: children.length,    tab: 'children',     color: 'bg-[#F0F9F5] border-[#8BA888]/30', text: 'text-[#8BA888]' },
    { label: 'Pending Appts',  value: pendingAppts,       tab: 'appointments', color: 'bg-[#FFF5F3] border-[#FF9B8F]/30', text: 'text-[#FF9B8F]' },
    { label: 'Confirmed',      value: confirmedAppts,     tab: 'appointments', color: 'bg-[#F0F9F5] border-[#8BA888]/30', text: 'text-[#8BA888]' },
    { label: 'Growth Tracking',value: 'View',             tab: 'growth',       color: 'bg-[#F0F9FC] border-[#6BB6CC]/30', text: 'text-[#6BB6CC]' },
  ];

  return (
    <div>
      <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold text-xl px-6 py-4 rounded-lg mb-6 shadow-sm">
        Welcome back, {user?.fullName?.split(' ')[0]}!
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, tab, color, text }) => (
          <div key={label} onClick={() => onNavigate(tab)}
            className={`${color} border-2 rounded-xl p-5 cursor-pointer text-center hover:shadow-md transition-all`}>
            <div className={`text-3xl font-bold ${text}`}>{value}</div>
            <div className="text-xs mt-1 text-[#64748B] font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Today's Meals — fetches real data */}
        <TodayMeals onNavigate={onNavigate} />

        {/* Quick Actions */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          <h3 className="text-[#2C3E50] font-bold mb-4 text-base">Quick Actions</h3>
          {[
            { label: 'Update Measurements', tab: 'growth'     },
            { label: 'View Growth Charts',  tab: 'growth'     },
            { label: 'Book Appointment',    tab: 'appointments'},
            { label: 'Generate Meal Plan',  tab: 'nutrition'  },
          ].map(({ label, tab }) => (
            <button key={label} onClick={() => onNavigate(tab)}
              className="w-full text-left bg-[#8BA888] text-white font-semibold px-4 py-3 rounded-lg mb-2 hover:bg-[#6D8A6A] transition-all text-sm">
              {label}
            </button>
          ))}
        </div>

        {/* Safety Tips */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          <h3 className="text-[#2C3E50] font-bold mb-4 text-base">Safety Tips</h3>
          <ul className="space-y-2 mb-3">
            {['Child-proof your home', 'Swimming safety', 'Road safety', 'Food choking prevention'].map(t => (
              <li key={t} className="bg-[#F0F9F5] border-l-4 border-[#8BA888] px-4 py-2.5 rounded-r-lg text-sm text-[#2C3E50] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8BA888] flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('tips')}
            className="w-full bg-white border-2 border-[#8BA888] text-[#8BA888] font-semibold py-3 rounded-lg hover:bg-[#F0F9F5] transition-all text-sm">
            View All Tips
          </button>
        </div>

        {/* Health Tips */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
          <h3 className="text-[#2C3E50] font-bold mb-4 text-base">Health Tips</h3>
          <ul className="space-y-2 mb-3">
            {['Vaccination schedules', 'Sleep requirements', 'Physical activity', 'Dental care'].map(t => (
              <li key={t} className="bg-[#F0F9F5] border-l-4 border-[#8BA888] px-4 py-2.5 rounded-r-lg text-sm text-[#2C3E50] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#8BA888] flex-shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => onNavigate('tips')}
            className="w-full bg-white border-2 border-[#8BA888] text-[#8BA888] font-semibold py-3 rounded-lg hover:bg-[#F0F9F5] transition-all text-sm">
            View All Tips
          </button>
        </div>
      </div>
    </div>
  );
}
