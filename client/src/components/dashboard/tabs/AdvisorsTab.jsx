'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Phone, IdCard, Stethoscope, CheckCircle, Info } from 'lucide-react';
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
  if (days.length === 0) return <p className="text-sm text-[#64748B]">No availability set</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {days.map(day =>
        byDay[day].map(slot => (
          <span key={`${day}-${slot}`}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${slot === 'Morning' ? 'bg-[#FFF5F3] text-[#FF9B8F] border border-[#FF9B8F]/20' : 'bg-[#F0F9F5] text-[#8BA888] border border-[#8BA888]/20'}`}>
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
  const [dateError, setDateError] = useState('');
  const [timeSlotError, setTimeSlotError] = useState('');

  useEffect(() => {
    apiService.getAdvisors()
      .then(r => setAdvisors(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openBooking = (advisor) => {
    console.log('📖 Opening booking modal for advisor:', advisor);
    setSelectedAdvisor(advisor);
    setForm({
      childId: children[0]?.id ? String(children[0].id) : '',
      appointmentDate: '',
      appointmentTime: '09:00',
      reason: '',
    });
    setSuccess(false);
    setError('');
    setDateError('');
    setTimeSlotError('');
  };

  const closeModal = () => {
    setSelectedAdvisor(null);
    setSuccess(false);
    setError('');
    setDateError('');
    setTimeSlotError('');
  };

  // Get advisor availability
  const advisorAvailability = selectedAdvisor?.availability || [];

  // Get available days of week for selected advisor
  const getAvailableDays = () => {
    if (!advisorAvailability.length) return [];
    const days = advisorAvailability.map(a => a.dayOfWeek?.toLowerCase());
    return [...new Set(days)]; // Remove duplicates
  };

  // Map day index (0=Sunday) to day name
  const getDayName = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dateObj = new Date(date + 'T00:00:00');
    const dayIndex = dateObj.getDay();
    const dayName = days[dayIndex];
    console.log(`📅 getDayName('${date}') => dayIndex: ${dayIndex}, dayName: '${dayName}'`);
    return dayName;
  };

  // Check if a date is available for the selected advisor
  const isDateAvailable = (dateStr) => {
    console.log('🔍 isDateAvailable called with:', dateStr);
    if (!dateStr || !selectedAdvisor) {
      console.log('   ❌ Missing dateStr or selectedAdvisor');
      return false;
    }
    const dayName = getDayName(dateStr);
    const availableDays = getAvailableDays();
    const isAvailable = availableDays.includes(dayName);
    console.log('   - dayName:', dayName);
    console.log('   - availableDays:', availableDays);
    console.log('   - isAvailable:', isAvailable);
    return isAvailable;
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    if (!form.appointmentDate || !selectedAdvisor) {
      console.log('⏰ Returning all time slots (no date or advisor selected)');
      return TIME_SLOTS;
    }

    const dayName = getDayName(form.appointmentDate);
    const dayAvailability = advisorAvailability.filter(
      a => a.dayOfWeek?.toLowerCase() === dayName
    );

    console.log('⏰ Getting slots for', dayName);
    console.log('📋 Day availability:', dayAvailability);

    if (!dayAvailability.length) {
      console.log('❌ No availability for this day');
      return [];
    }

    // Filter time slots based on advisor's availability
    const availableSlots = TIME_SLOTS.filter(slot => {
      const slotHour = parseInt(slot.value.split(':')[0]);
      return dayAvailability.some(avail => {
        const startHour = parseInt(avail.startTime?.split(':')[0]);
        const endHour = parseInt(avail.endTime?.split(':')[0]);
        return slotHour >= startHour && slotHour < endHour;
      });
    });

    console.log('✅ Available slots:', availableSlots.map(s => s.label));
    return availableSlots;
  };

  // Handle date change - validate and reset time if needed
  const handleDateChange = (date) => {
    console.log('🗓️ Date changed to:', date);

    if (!selectedAdvisor) {
      console.log('❌ No advisor selected');
      setDateError('Please select an advisor first');
      setTimeSlotError('');
      return;
    }

    const dayName = getDayName(date);
    const availableDays = getAvailableDays();
    console.log('📅 Day of week:', dayName);
    console.log('✅ Available days:', availableDays);

    if (!isDateAvailable(date)) {
      console.log('❌ Date not available!');
      const errorMsg = `This advisor is not available on ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}. Available days: ${availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}`;
      setDateError(errorMsg);
      setForm({ ...form, appointmentDate: date, appointmentTime: '09:00' });
      setTimeSlotError('');
      return;
    }

    console.log('✅ Date is available!');
    setDateError('');

    // Get available slots for this date
    const availableSlots = TIME_SLOTS.filter(slot => {
      const dayAvailability = advisorAvailability.filter(
        a => a.dayOfWeek?.toLowerCase() === dayName
      );
      const slotHour = parseInt(slot.value.split(':')[0]);
      return dayAvailability.some(avail => {
        const startHour = parseInt(avail.startTime?.split(':')[0]);
        const endHour = parseInt(avail.endTime?.split(':')[0]);
        return slotHour >= startHour && slotHour < endHour;
      });
    });

    console.log('⏰ Available time slots for', dayName, ':', availableSlots.map(s => s.label));

    if (availableSlots.length === 0) {
      setTimeSlotError(`No time slots available for ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}. Please select a different date.`);
    } else {
      setTimeSlotError('');
    }

    setForm({
      ...form,
      appointmentDate: date,
      appointmentTime: availableSlots[0]?.value || '09:00'
    });
  };

  // Handle time slot change - validate
  const handleTimeSlotChange = (timeValue) => {
    console.log('⏰ Time slot changed to:', timeValue);
    setForm({ ...form, appointmentTime: timeValue });

    if (!form.appointmentDate) {
      setTimeSlotError('Please select a date first');
      return;
    }

    const availableSlots = getAvailableTimeSlots();
    const isSlotAvailable = availableSlots.some(s => s.value === timeValue);

    if (!isSlotAvailable && availableSlots.length > 0) {
      const slotLabel = TIME_SLOTS.find(t => t.value === timeValue)?.label || timeValue;
      setTimeSlotError(`${slotLabel} is not available. Available slots: ${availableSlots.map(s => s.label).join(', ')}`);
      console.log('❌ Time slot not available');
    } else {
      setTimeSlotError('');
      console.log('✅ Time slot is available');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Submitting appointment:', form);
    setError('');

    // Final validation
    if (!isDateAvailable(form.appointmentDate)) {
      const dayName = getDayName(form.appointmentDate);
      const availableDays = getAvailableDays();
      const errorMsg = `This advisor is not available on ${dayName}. Available days: ${availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}`;
      console.log('❌ Validation failed:', errorMsg);
      setDateError(errorMsg);
      setError(errorMsg);
      return;
    }

    const availableSlots = getAvailableTimeSlots();
    if (!availableSlots.some(s => s.value === form.appointmentTime)) {
      const errorMsg = `Selected time slot (${form.appointmentTime}) is not available for this advisor on the selected date.`;
      console.log('❌ Time slot validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }

    console.log('✅ Validation passed, booking appointment...');

    setSaving(true);
    try {
      const slot = TIME_SLOTS.find(t => t.value === form.appointmentTime);
      await dispatch(bookAppointment({
        ...form,
        advisorId: selectedAdvisor.id,
        timeSlot: slot?.slot || 'morning',
      })).unwrap();
      console.log('✅ Appointment booked successfully!');
      setSuccess(true);
      setTimeout(() => closeModal(), 2500);
    } catch (err) {
      console.error('❌ Booking failed:', err);
      setError(err?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-16 text-[#64748B]">
      <div className="w-16 h-16 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-full flex items-center justify-center mx-auto mb-4">
        <Stethoscope className="w-8 h-8 text-white" />
      </div>
      <p className="text-base">Loading advisors...</p>
    </div>
  );

  return (
    <div>
      <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-6 py-4 rounded-lg mb-6 shadow-sm text-xl">Find Advisors</div>

      {advisors.length === 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-sm mb-4 text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <p className="text-[#64748B] text-base">No approved advisors available yet</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {advisors.map(advisor => (
          <div key={advisor.id} className="bg-gradient-to-br from-[#F0F9F5] to-[#E6F4EF] border border-[#8BA888]/20 rounded-xl p-6 shadow-sm">
            <h3 className="text-[#2C3E50] font-bold text-lg mb-1">{advisor.fullName}</h3>
            <p className="text-[#64748B] text-sm font-semibold mb-4">
              {advisor.specialty || 'General Advisor'}
            </p>

            <div className="bg-white border border-[#E2E8F0] px-4 py-3 rounded-lg mb-3 text-sm text-[#2C3E50]">
              <strong>Experience:</strong> {advisor.experienceYears || '—'} years
            </div>
            {advisor.licenseNumber && (
              <div className="bg-white border border-[#E2E8F0] px-4 py-3 rounded-lg mb-3 text-sm text-[#2C3E50] flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#64748B]" />
                <span>License: {advisor.licenseNumber}</span>
              </div>
            )}
            {advisor.phone && (
              <div className="bg-white border border-[#E2E8F0] px-4 py-3 rounded-lg mb-3 text-sm text-[#2C3E50] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#64748B]" />
                <span>{advisor.phone}</span>
              </div>
            )}

            <div className="my-4">
              <div className="text-xs font-bold text-[#64748B] mb-2 tracking-wide uppercase">
                Availability
              </div>
              <AvailabilityDisplay availability={advisor.availability} />
            </div>

            <button className="w-full bg-[#8BA888] text-white font-semibold px-4 py-3 rounded-lg hover:bg-[#6D8A6A] transition-all text-sm mt-3 flex items-center justify-center gap-2" onClick={() => openBooking(advisor)}>
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedAdvisor && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl border border-[#E2E8F0]">
            <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-6 py-4 rounded-t-xl text-lg">
              Book Appointment
            </div>

            {success ? (
              <div className="px-8 py-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-[#8BA888] text-xl font-bold mb-3">
                  Request Submitted!
                </h3>
                <p className="text-[#64748B] text-sm">
                  Waiting for <strong>{selectedAdvisor.fullName}</strong> to review your request.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {/* Advisor info */}
                <div className="bg-gradient-to-br from-[#F0F9F5] to-[#E6F4EF] border border-[#8BA888]/20 rounded-xl p-5 mb-5">
                  <h3 className="text-[#2C3E50] font-bold text-base mb-1">{selectedAdvisor.fullName}</h3>
                  <p className="text-sm text-[#64748B] mb-3">{selectedAdvisor.specialty}</p>
                  {selectedAdvisor.phone && (
                    <p className="text-sm text-[#64748B] flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{selectedAdvisor.phone}</span>
                    </p>
                  )}
                  <div className="mt-3">
                    <AvailabilityDisplay availability={selectedAdvisor.availability} />
                  </div>
                </div>

                {getAvailableDays().length > 0 && (
                  <div className="mb-4 text-xs text-[#64748B] bg-green-50 px-3 py-2 rounded-lg border-l-4 border-green-400">
                    <strong className="text-green-700">Available days:</strong>{' '}
                    {getAvailableDays().map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">Select Child</label>
                  <select required value={form.childId} onChange={e => setForm({ ...form, childId: e.target.value })} className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all">
                    <option value="">Choose your child...</option>
                    {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">Select Day</label>
                  <input type="date" required value={form.appointmentDate}
                    onChange={e => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-3 text-sm transition-all ${
                      dateError
                        ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                        : 'border-[#E2E8F0] focus:border-[#8BA888] focus:ring-[#8BA888]/10'
                    }`} />
                  {dateError && (
                    <p className="mt-2 text-xs font-semibold text-red-700 bg-red-50 px-3 py-2 rounded-lg border-l-4 border-red-500">
                      ⚠️ {dateError}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">Select Time Slot</label>
                  <select
                    required
                    value={form.appointmentTime}
                    onChange={e => handleTimeSlotChange(e.target.value)}
                    disabled={!form.appointmentDate}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-3 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      timeSlotError || (form.appointmentDate && getAvailableTimeSlots().length === 0)
                        ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                        : 'border-[#E2E8F0] focus:border-[#8BA888] focus:ring-[#8BA888]/10'
                    }`}>
                    {getAvailableTimeSlots().length > 0 ? (
                      getAvailableTimeSlots().map(t => <option key={t.value} value={t.value}>{t.label}</option>)
                    ) : (
                      <option value="">No available time slots</option>
                    )}
                  </select>
                  {timeSlotError && (
                    <p className="mt-2 text-xs font-semibold text-red-700 bg-red-50 px-3 py-2 rounded-lg border-l-4 border-red-500">
                      ⚠️ {timeSlotError}
                    </p>
                  )}
                  {!timeSlotError && form.appointmentDate && getAvailableTimeSlots().length === 0 && (
                    <p className="mt-2 text-xs font-semibold text-red-700 bg-red-50 px-3 py-2 rounded-lg border-l-4 border-red-500">
                      ⚠️ No time slots available for this date. Please select a different date.
                    </p>
                  )}
                  {!form.appointmentDate && (
                    <p className="mt-2 text-xs text-[#64748B] italic">Please select a date first</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">Reason (Optional)</label>
                  <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                    rows={3} placeholder="Brief reason for appointment..."
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all resize-y" />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 text-sm flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#64748B]">Advisor will review your request and approve or reject it</span>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={closeModal}
                    className="flex-1 py-3 border-2 border-[#E2E8F0] rounded-lg bg-white text-[#64748B] font-semibold hover:border-[#8BA888] hover:text-[#8BA888] transition-all">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !!dateError || !!timeSlotError || getAvailableTimeSlots().length === 0}
                    className="flex-1 bg-[#8BA888] text-white font-semibold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    {saving ? 'Submitting...' : (dateError || timeSlotError || getAvailableTimeSlots().length === 0) ? 'Fix Errors First' : 'Submit Request'}
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
