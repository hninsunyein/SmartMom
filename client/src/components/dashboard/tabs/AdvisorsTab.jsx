'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bookAppointment } from '../../../redux/slices/appointmentsSlice';
import apiService from '../../../services/api';

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const TIME_SLOTS = [
  { value: '09:00', label: 'Morning — 9:00 AM', slot: 'morning' },
  { value: '10:00', label: 'Morning — 10:00 AM', slot: 'morning' },
  { value: '11:00', label: 'Morning — 11:00 AM', slot: 'morning' },
  { value: '14:00', label: 'Evening — 2:00 PM', slot: 'evening' },
  { value: '15:00', label: 'Evening — 3:00 PM', slot: 'evening' },
  { value: '16:00', label: 'Evening — 4:00 PM', slot: 'evening' },
];

function AvailabilityDisplay({ availability }) {
  const byDay = {};
  (availability || []).forEach(a => {
    if (!byDay[a.dayOfWeek]) byDay[a.dayOfWeek] = [];
    const hour = parseInt(a.startTime);
    byDay[a.dayOfWeek].push(hour < 13 ? 'Morning' : 'Evening');
  });

  const days = DAY_ORDER.filter(d => byDay[d]);
  if (days.length === 0) return <p className="text-[0.8rem] text-white/65">No availability set</p>;

  return (
    <div className="flex flex-wrap gap-1">
      {days.map(day =>
        byDay[day].map(slot => (
          <span key={`${day}-${slot}`}
            className={`text-[0.75rem] px-2 py-0.5 rounded-[10px] font-semibold ${slot === 'Morning' ? 'bg-[#ffeaa7] text-[#2d3436]' : 'bg-white/30 text-white'}`}>
            {day.slice(0, 3).toUpperCase()} {slot}
          </span>
        ))
      )}
    </div>
  );
}

export default function AdvisorsTab() {
  const dispatch = useDispatch();
  const { list: children } = useSelector((state) => state.children);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [form, setForm] = useState({ childId: '', appointmentDate: '', appointmentTime: '09:00', reason: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.getAdvisors()
      .then(r => setAdvisors(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openBooking = (advisor) => {
    setSelectedAdvisor(advisor);
    setForm({
      childId: children[0]?.id ? String(children[0].id) : '',
      appointmentDate: '',
      appointmentTime: '09:00',
      reason: '',
    });
    setSuccess(false);
    setError('');
  };

  const closeModal = () => { setSelectedAdvisor(null); setSuccess(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const slot = TIME_SLOTS.find(t => t.value === form.appointmentTime);
      await dispatch(bookAppointment({
        ...form,
        advisorId: selectedAdvisor.id,
        timeSlot: slot?.slot || 'morning',
      })).unwrap();
      setSuccess(true);
      setTimeout(() => closeModal(), 2500);
    } catch (err) {
      setError(err?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-16 text-[#636e72]">
      <div className="text-[2rem] mb-2.5">👨‍⚕️</div>
      Loading advisors...
    </div>
  );

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">Find Advisors</div>

      {advisors.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 text-center py-10">
          <div className="text-[3rem] mb-4">👨‍⚕️</div>
          <p className="text-[#636e72]">No approved advisors available yet</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {advisors.map(advisor => (
          <div key={advisor.id} className="bg-gradient-to-br from-blue-400 to-violet-500 text-white rounded-2xl p-5 shadow-md">
            <h3 className="m-0 mb-1 text-[1.15rem]">{advisor.fullName}</h3>
            <p className="text-white/85 text-[0.9rem] font-semibold mb-3.5">
              {advisor.specialty || 'General Advisor'}
            </p>

            <div className="bg-white/20 px-3.5 py-2.5 rounded-lg mb-2 text-[0.9rem]">
              <strong>Experience:</strong> {advisor.experienceYears || '—'} years
            </div>
            {advisor.licenseNumber && (
              <div className="bg-white/20 px-3.5 py-2.5 rounded-lg mb-2 text-[0.9rem]">
                🪪 License: {advisor.licenseNumber}
              </div>
            )}
            {advisor.phone && (
              <div className="bg-white/20 px-3.5 py-2.5 rounded-lg mb-2 text-[0.9rem]">
                📞 {advisor.phone}
              </div>
            )}

            <div className="my-3">
              <div className="text-[0.78rem] font-bold text-white/70 mb-1.5 tracking-wide">
                AVAILABILITY
              </div>
              <AvailabilityDisplay availability={advisor.availability} />
            </div>

            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55 mt-2.5" onClick={() => openBooking(advisor)}>
              📅 Book Appointment
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedAdvisor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-t-2xl shadow text-[1.1rem]">
              Book Appointment
            </div>

            {success ? (
              <div className="px-8 py-12 text-center">
                <div className="text-[3.5rem] mb-4">✓</div>
                <h3 className="text-[#00b894] text-[1.2rem] font-bold mb-2.5">
                  Request Submitted!
                </h3>
                <p className="text-[#636e72]">
                  Waiting for <strong>{selectedAdvisor.fullName}</strong> to review your request.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5">
                {/* Advisor info */}
                <div className="bg-gradient-to-br from-blue-400 to-violet-500 text-white rounded-2xl p-5 shadow-md mb-4">
                  <h3 className="m-0 mb-1">{selectedAdvisor.fullName}</h3>
                  <p className="text-[0.9rem] text-white/85 m-0">{selectedAdvisor.specialty}</p>
                  {selectedAdvisor.phone && (
                    <p className="text-[0.85rem] text-white/85 mt-1.5 mb-0">📞 {selectedAdvisor.phone}</p>
                  )}
                  <div className="mt-2">
                    <AvailabilityDisplay availability={selectedAdvisor.availability} />
                  </div>
                </div>

                {error && (
                  <div className="bg-[#ff7675] text-white px-3 py-2.5 rounded-lg mb-4 text-[0.9rem]">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Select Child</label>
                  <select required value={form.childId} onChange={e => setForm({ ...form, childId: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                    <option value="">Choose your child...</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Select Day</label>
                  <input type="date" required value={form.appointmentDate}
                    onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors" />
                </div>

                <div className="mb-4">
                  <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Select Time Slot</label>
                  <select required value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Reason (Optional)</label>
                  <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                    rows={3} placeholder="Brief reason for appointment..."
                    className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors resize-y" />
                </div>

                <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-4 text-sm text-[0.85rem]">
                  ℹ️ Advisor will review your request and approve or reject it
                </div>

                <div className="flex gap-2.5">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 border-2 border-[#667eea] rounded-lg bg-white text-[#667eea] font-semibold cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55">
                    {saving ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
