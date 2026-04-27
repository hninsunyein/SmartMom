'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, bookAppointment, approveAppointment, rejectAppointment, cancelAppointment, saveAppointmentNotes } from '../../../redux/slices/appointmentsSlice';
import apiService from '../../../services/api';
import { Calendar, Clock, Baby, FileText, X, Check, Info, Inbox, CheckCircle, HourglassIcon, ClipboardList } from 'lucide-react';

const TIME_SLOTS = [
  { value: '09:00', label: 'Morning — 9:00 AM', slot: 'morning' },
  { value: '10:00', label: 'Morning — 10:00 AM', slot: 'morning' },
  { value: '11:00', label: 'Morning — 11:00 AM', slot: 'morning' },
  { value: '14:00', label: 'Evening — 2:00 PM', slot: 'evening' },
  { value: '15:00', label: 'Evening — 3:00 PM', slot: 'evening' },
  { value: '16:00', label: 'Evening — 4:00 PM', slot: 'evening' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function AppointmentsTab() {
  console.log('🎬 AppointmentsTab component rendered');

  const dispatch = useDispatch();
  const { list, isLoading } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);
  const { list: children } = useSelector((state) => state.children);
  const [showForm, setShowForm] = useState(false);
  const [advisors, setAdvisors] = useState([]);
  const [form, setForm] = useState({ advisorId: '', childId: '', appointmentDate: '', appointmentTime: '09:00', timeSlot: 'morning', reason: '' });
  const [saving, setSaving] = useState(false);
  const [notesModal, setNotesModal] = useState(null); // { appt }
  const [notesText, setNotesText] = useState('');
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [dateError, setDateError] = useState('');
  const [timeSlotError, setTimeSlotError] = useState('');

  useEffect(() => {
    dispatch(fetchAppointments());
    if (user?.userType === 'parent') {
      console.log('🔄 Loading advisors...');
      apiService.getAdvisors().then(r => {
        console.log('✅ Advisors loaded:', r.data);
        setAdvisors(r.data || []);
      }).catch(err => {
        console.error('❌ Failed to load advisors:', err);
      });
    }
  }, [dispatch]);

  // Get selected advisor's data
  const selectedAdvisor = advisors.find(a => a.id === parseInt(form.advisorId));
  const advisorAvailability = selectedAdvisor?.availability || [];

  // Log whenever advisors data changes
  useEffect(() => {
    if (advisors.length > 0) {
      console.log('👥 Total advisors:', advisors.length);
      console.log('📋 First advisor sample:', advisors[0]);
    }
  }, [advisors]);

  // Debug: log to see what data we have when advisor is selected
  useEffect(() => {
    if (form.advisorId) {
      console.log('=== ADVISOR SELECTED ===');
      console.log('🆔 Advisor ID:', form.advisorId);
      console.log('✅ Selected Advisor Object:', selectedAdvisor);
      console.log('📅 Advisor Availability Array:', advisorAvailability);

      if (advisorAvailability && advisorAvailability.length > 0) {
        const days = advisorAvailability.map(a => a.dayOfWeek?.toLowerCase());
        const uniqueDays = [...new Set(days)];
        console.log('📆 Available Days:', uniqueDays);
      } else {
        console.warn('⚠️ No availability data found for this advisor!');
      }
    }
  }, [form.advisorId, selectedAdvisor, advisorAvailability]);

  // Get available days of week for selected advisor
  const getAvailableDays = () => {
    if (!advisorAvailability.length) return [];
    const days = advisorAvailability.map(a => a.dayOfWeek.toLowerCase());
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
    console.log('   - advisorId:', form.advisorId);
    console.log('   - advisorAvailability:', advisorAvailability);

    if (!dateStr || !form.advisorId) {
      console.log('   ❌ Missing dateStr or advisorId');
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
    if (!form.appointmentDate || !form.advisorId) {
      console.log('⏰ Returning all time slots (no date or advisor selected)');
      return TIME_SLOTS;
    }

    const dayName = getDayName(form.appointmentDate);
    const dayAvailability = advisorAvailability.filter(
      a => a.dayOfWeek.toLowerCase() === dayName
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
        const startHour = parseInt(avail.startTime.split(':')[0]);
        const endHour = parseInt(avail.endTime.split(':')[0]);
        const isAvailable = slotHour >= startHour && slotHour < endHour;
        return isAvailable;
      });
    });

    console.log('✅ Available slots:', availableSlots.map(s => s.label));
    return availableSlots;
  };

  // Handle advisor change - reset date and time
  const handleAdvisorChange = (advisorId) => {
    setForm({ ...form, advisorId, appointmentDate: '', appointmentTime: '09:00' });
    setDateError('');
    setTimeSlotError('');
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

  // Handle date change - validate and reset time if needed
  const handleDateChange = (date) => {
    console.log('🗓️  Date changed to:', date);

    if (!form.advisorId) {
      console.log('❌ No advisor selected');
      setDateError('Please select an advisor first');
      setTimeSlotError('');
      return;
    }

    const dayName = getDayName(date);
    const availableDays = getAvailableDays();
    console.log('📅 Day of week:', dayName);
    console.log('✅ Available days:', availableDays);
    console.log('🔍 Is date available?', isDateAvailable(date));

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

    // Reset time to first available slot
    const availableSlots = TIME_SLOTS.filter(slot => {
      const dayAvailability = advisorAvailability.filter(
        a => a.dayOfWeek.toLowerCase() === dayName
      );
      const slotHour = parseInt(slot.value.split(':')[0]);
      return dayAvailability.some(avail => {
        const startHour = parseInt(avail.startTime.split(':')[0]);
        const endHour = parseInt(avail.endTime.split(':')[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🚀 Submitting appointment:', form);

    // Final validation
    if (!isDateAvailable(form.appointmentDate)) {
      const dayName = getDayName(form.appointmentDate);
      const availableDays = getAvailableDays();
      const errorMsg = `This advisor is not available on ${dayName}. Available days: ${availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}`;
      console.log('❌ Validation failed:', errorMsg);
      setDateError(errorMsg);
      alert(errorMsg);
      return;
    }

    const availableSlots = getAvailableTimeSlots();
    if (!availableSlots.some(s => s.value === form.appointmentTime)) {
      const errorMsg = `Selected time slot (${form.appointmentTime}) is not available for this advisor on the selected date. Available slots: ${availableSlots.map(s => s.label).join(', ')}`;
      console.log('❌ Time slot validation failed:', errorMsg);
      alert(errorMsg);
      return;
    }

    console.log('✅ Validation passed, booking appointment...');

    setSaving(true);
    try {
      const slot = TIME_SLOTS.find(t => t.value === form.appointmentTime);
      await dispatch(bookAppointment({ ...form, timeSlot: slot?.slot || 'morning' })).unwrap();
      console.log('✅ Appointment booked successfully!');
      setShowForm(false);
      setForm({ advisorId: '', childId: '', appointmentDate: '', appointmentTime: '09:00', timeSlot: 'morning', reason: '' });
      setDateError('');
    } catch (err) {
      console.error('❌ Booking failed:', err);
      alert('Failed to book appointment: ' + (err.message || 'Unknown error'));
    }
    finally { setSaving(false); }
  };

  const openNotes = (appt) => {
    setNotesModal(appt);
    setNotesText(appt.notes || '');
    setNotesSaved(false);
  };

  const handleSaveNotes = async () => {
    if (!notesModal) return;
    setNotesSaving(true);
    try {
      await dispatch(saveAppointmentNotes({ id: notesModal.id, notes: notesText })).unwrap();
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setNotesSaving(false); }
  };

  const insertFormat = (tag) => {
    const ta = document.getElementById('notes-editor');
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel   = notesText.substring(start, end);
    const wrap  = { bold: ['**', '**'], italic: ['_', '_'], bullet: ['• ', ''] };
    const [pre, post] = wrap[tag] || ['', ''];
    const newText = notesText.substring(0, start) + pre + sel + post + notesText.substring(end);
    setNotesText(newText);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + pre.length, end + pre.length); }, 0);
  };

  const isParent = user?.userType === 'parent';
  const isAdvisor = user?.userType === 'advisor';

  const pendingList = list.filter(a => a.status === 'pending');
  const confirmedList = list.filter(a => a.status === 'confirmed');
  const otherList = list.filter(a => a.status !== 'pending' && a.status !== 'confirmed');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-xl shadow flex-1">
          {isAdvisor ? 'Appointment Requests' : 'My Appointments'}
        </div>
        {isParent && (
          <button className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55 ml-4"
            onClick={() => setShowForm(true)}>
            + Book Appointment
          </button>
        )}
      </div>

      {isLoading && <p className="text-[#64748B] text-center py-5">Loading appointments...</p>}

      {/* Empty state */}
      {list.length === 0 && !isLoading && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-4 text-center py-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <p className="text-[#64748B] mb-4">No appointments yet</p>
          {isParent && (
            <button className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55" onClick={() => setShowForm(true)}>
              Book Your First Appointment
            </button>
          )}
        </div>
      )}

      {/* ── ADVISOR VIEW ── */}
      {isAdvisor && (
        <>
          {pendingList.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-5">
              <div className="bg-gradient-to-r from-[#ffeaa7] to-[#fdcb6e] text-[#2d3436] font-bold px-5 py-3 rounded-xl mb-5 shadow flex items-center gap-2">
                <Inbox className="w-5 h-5" />
                <span>Pending Requests ({pendingList.length})</span>
              </div>
              {pendingList.map(appt => (
                <div key={appt.id} className="bg-gradient-to-r from-[#ffeaa7] to-[#fdcb6e] p-4 rounded-[10px] mb-2.5">
                  <div className="flex justify-between items-start flex-wrap gap-2.5">
                    <div>
                      <p className="m-0 mb-1 font-bold text-[#2d3436] text-base">{appt.parent?.fullName || 'Parent'}</p>
                      <p className="m-0 mb-1 text-[#2d3436] text-[0.9rem] flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(appt.appointmentDate)} — {appt.timeSlot === 'morning' ? 'Morning' : 'Evening'} ({appt.appointmentTime})
                      </p>
                      {appt.child && <p className="m-0 mb-1 text-[#2d3436] text-[0.9rem]">Child: {appt.child.name}</p>}
                      {appt.reason && <p className="m-0 text-[#64748B] text-[0.85rem] italic">"{appt.reason}"</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => dispatch(approveAppointment(appt.id))} className="bg-gradient-to-r from-emerald-400 to-green-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 text-sm flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button onClick={() => dispatch(rejectAppointment(appt.id))} className="bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 text-sm flex items-center gap-1.5">
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {[...confirmedList, ...otherList].length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-4">
              <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">All Appointments</div>
              {[...confirmedList, ...otherList].map(appt => (
                <div key={appt.id} className="bg-white border border-[#E2E8F0] rounded-xl mb-3 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white px-4 py-2.5 flex justify-between items-center flex-wrap gap-2">
                    <strong className="text-sm">{appt.parent?.fullName || 'Parent'}</strong>
                    <div className="flex items-center gap-2">
                      <span className={`status-${appt.status} text-xs`}>{appt.status}</span>
                      <button onClick={() => openNotes(appt)}
                        className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-all border border-white/30 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Notes</span>
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-sm text-[#2d3436]">
                    <div className="mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(appt.appointmentDate)}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{appt.appointmentTime}</span>
                    </div>
                    {appt.child && <div className="mb-1 flex items-center gap-2"><Baby className="w-4 h-4" /><span>Child: {appt.child.name}</span></div>}
                    {appt.reason && <div className="text-[#64748B] italic mb-1">"{appt.reason}"</div>}
                    {appt.notes && (
                      <div className="mt-2 bg-amber-50 border-l-4 border-amber-400 px-3 py-2 rounded-r-lg text-[0.82rem] text-[#2d3436]">
                        <span className="font-semibold text-amber-700">Notes: </span>
                        <span className="whitespace-pre-wrap">{appt.notes.length > 120 ? appt.notes.substring(0, 120) + '…' : appt.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── PARENT VIEW ── */}
      {isParent && list.length > 0 && (
        <>
          {/* Confirmed */}
          {confirmedList.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="text-[#2C3E50] font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#8BA888]" /><span>Confirmed Appointments</span></h3>
              {confirmedList.map(appt => (
                <div key={appt.id} className="mb-4 pb-4 border-b border-[#f0f0f0]">
                  <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Dr. {appt.advisor?.fullName || 'Advisor'}</strong></div>
                  <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appt.appointmentDate)} — {appt.timeSlot === 'morning' ? 'Morning' : 'Evening'} ({appt.appointmentTime})</span>
                  </div>
                  {appt.child && <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2"><Baby className="w-4 h-4" /><span>Child: {appt.child.name}</span></div>}
                  {appt.reason && <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm italic">"{appt.reason}"</div>}
                  {appt.notes && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 px-3 py-2.5 rounded-r-xl mb-2 text-sm">
                      <div className="font-semibold text-amber-700 mb-1 flex items-center gap-2"><FileText className="w-4 h-4" /><span>Doctor's Notes</span></div>
                      <div className="text-[#2d3436] whitespace-pre-wrap leading-relaxed">{appt.notes}</div>
                    </div>
                  )}
                  <span className="status-approved">Approved</span>
                </div>
              ))}
            </div>
          )}

          {/* Pending */}
          {pendingList.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="text-[#2C3E50] font-bold mb-3 flex items-center gap-2"><HourglassIcon className="w-5 h-5 text-amber-500" /><span>Pending Requests</span></h3>
              {pendingList.map(appt => (
                <div key={appt.id} className="mb-4 pb-4 border-b border-[#f0f0f0]">
                  <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Dr. {appt.advisor?.fullName || 'Advisor'}</strong></div>
                  <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appt.appointmentDate)} — {appt.timeSlot === 'morning' ? 'Morning' : 'Evening'} ({appt.appointmentTime})</span>
                  </div>
                  {appt.child && <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2"><Baby className="w-4 h-4" /><span>Child: {appt.child.name}</span></div>}
                  <div className="flex items-center gap-2.5 mt-2">
                    <span className="status-pending">Waiting Advisor Response</span>
                    <button onClick={() => dispatch(cancelAppointment(appt.id))}
                      className="bg-transparent border border-[#d63031] text-[#d63031] rounded-md px-3 py-1 cursor-pointer text-[0.8rem] font-semibold">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rejected / Cancelled */}
          {otherList.length > 0 && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="text-[#2C3E50] font-bold mb-3 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-[#64748B]" /><span>Past & Other</span></h3>
              {otherList.map(appt => (
                <div key={appt.id} className="mb-2.5 pb-2.5 border-b border-[#f0f0f0]">
                  <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Dr. {appt.advisor?.fullName || 'Advisor'}</strong></div>
                  <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{formatDate(appt.appointmentDate)}</span></div>
                  {appt.child && <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2"><Baby className="w-4 h-4" /><span>Child: {appt.child.name}</span></div>}
                  <span className={`status-${appt.status}`}>{appt.status}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
            <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-t-2xl flex justify-between items-center">
              <span className="flex items-center gap-2"><FileText className="w-5 h-5" /><span>Appointment Notes</span></span>
              <button onClick={() => setNotesModal(null)} className="text-white/80 hover:text-white text-xl leading-none"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <div className="mb-3 text-sm text-[#64748B]">
                <strong className="text-[#2d3436]">{notesModal.parent?.fullName || 'Parent'}</strong>
                {' — '}{formatDate(notesModal.appointmentDate)} {notesModal.appointmentTime}
                {notesModal.child && <span> · {notesModal.child.name}</span>}
              </div>

              {/* Formatting toolbar */}
              <div className="flex gap-2 mb-2">
                {[
                  { tag: 'bold',   label: 'B',  title: 'Bold' },
                  { tag: 'italic', label: 'I',  title: 'Italic' },
                  { tag: 'bullet', label: '•',  title: 'Bullet' },
                ].map(({ tag, label, title }) => (
                  <button key={tag} title={title} onClick={() => insertFormat(tag)}
                    className="w-8 h-8 rounded-lg border border-[#8BA888] text-[#8BA888] font-bold text-sm hover:bg-[#8BA888] hover:text-white transition-all">
                    {label}
                  </button>
                ))}
                <span className="ml-auto text-xs text-[#b2bec3] self-center">Supports **bold**, _italic_, • bullets</span>
              </div>

              <textarea
                id="notes-editor"
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                rows={10}
                placeholder="Write doctor suggestions, observations, and notes here..."
                className="w-full px-4 py-3 border-2 border-[#8BA888] rounded-xl focus:outline-none focus:border-[#6D8A6A] text-sm transition-colors resize-y font-mono"
              />

              <div className="flex gap-2.5 mt-4">
                <button onClick={() => setNotesModal(null)}
                  className="flex-1 py-2.5 border-2 border-[#8BA888] rounded-xl bg-white text-[#8BA888] font-semibold text-sm">
                  Cancel
                </button>
                <button onClick={handleSaveNotes} disabled={notesSaving}
                  className="flex-1 bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55">
                  {notesSaving ? 'Saving…' : notesSaved ? 'Saved!' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
            <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-t-2xl shadow text-[1.1rem]">Book Appointment</div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-[#2C3E50] font-semibold mb-1.5 text-sm">Select Advisor</label>
                <select required value={form.advisorId} onChange={e => handleAdvisorChange(e.target.value)} className="w-full px-4 py-2.5 border-2 border-[#8BA888] rounded-xl focus:outline-none focus:border-[#6D8A6A] text-sm transition-colors">
                  <option value="">Choose an advisor...</option>
                  {advisors.map(a => <option key={a.id} value={a.id}>{a.fullName} — {a.specialty}</option>)}
                </select>
                {form.advisorId && getAvailableDays().length > 0 && (
                  <p className="mt-2 text-xs text-[#64748B] bg-green-50 px-3 py-2 rounded-lg border-l-4 border-green-400">
                    <strong className="text-green-700">Available days:</strong>{' '}
                    {getAvailableDays().map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#2C3E50] font-semibold mb-1.5 text-sm">Select Child</label>
                <select required value={form.childId} onChange={e => setForm({ ...form, childId: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#8BA888] rounded-xl focus:outline-none focus:border-[#6D8A6A] text-sm transition-colors">
                  <option value="">Choose your child...</option>
                  {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-[#2C3E50] font-semibold mb-1.5 text-sm">Select Day</label>
                <input type="date" required value={form.appointmentDate}
                  onChange={e => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={!form.advisorId}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    dateError ? 'border-red-500 focus:border-red-600' : 'border-[#8BA888] focus:border-[#6D8A6A]'
                  }`} />
                {dateError && (
                  <p className="mt-2 text-xs font-semibold text-red-700 bg-red-50 px-3 py-2 rounded-lg border-l-4 border-red-500">
                    ⚠️ {dateError}
                  </p>
                )}
                {!form.advisorId && (
                  <p className="mt-2 text-xs text-[#64748B] italic">Please select an advisor first</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-[#2C3E50] font-semibold mb-1.5 text-sm">Select Time Slot</label>
                <select
                  required
                  value={form.appointmentTime}
                  onChange={e => handleTimeSlotChange(e.target.value)}
                  disabled={!form.appointmentDate || !form.advisorId}
                  className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    timeSlotError || (form.appointmentDate && getAvailableTimeSlots().length === 0)
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-[#8BA888] focus:border-[#6D8A6A]'
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
                <label className="block text-[#2C3E50] font-semibold mb-1.5 text-sm">Reason (Optional)</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3}
                  placeholder="Brief reason for appointment..." className="w-full px-4 py-2.5 border-2 border-[#8BA888] rounded-xl focus:outline-none focus:border-[#6D8A6A] text-sm transition-colors resize-y" />
              </div>
              <p className="text-[0.8rem] text-[#64748B] mb-4 italic bg-gradient-to-r from-[#f5f7fa] to-[#e9ecef] px-2.5 py-2.5 rounded-lg border-l-4 border-[#8BA888] flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>Advisor will review your request and approve or reject it</span>
              </p>
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border-2 border-[#8BA888] rounded-lg bg-white text-[#8BA888] font-semibold cursor-pointer">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !!dateError || !!timeSlotError || getAvailableTimeSlots().length === 0}
                  className="flex-1 bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55 disabled:cursor-not-allowed">
                  {saving ? 'Submitting...' : (dateError || timeSlotError || getAvailableTimeSlots().length === 0) ? 'Fix Errors First' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
