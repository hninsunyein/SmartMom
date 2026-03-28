'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments, bookAppointment, approveAppointment, rejectAppointment, cancelAppointment, saveAppointmentNotes } from '../../../redux/slices/appointmentsSlice';
import apiService from '../../../services/api';

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

  useEffect(() => {
    dispatch(fetchAppointments());
    if (user?.userType === 'parent') {
      apiService.getAdvisors().then(r => setAdvisors(r.data || [])).catch(() => {});
    }
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slot = TIME_SLOTS.find(t => t.value === form.appointmentTime);
      await dispatch(bookAppointment({ ...form, timeSlot: slot?.slot || 'morning' })).unwrap();
      setShowForm(false);
      setForm({ advisorId: '', childId: '', appointmentDate: '', appointmentTime: '09:00', timeSlot: 'morning', reason: '' });
    } catch (err) { console.error(err); }
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
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl shadow flex-1">
          {isAdvisor ? 'Appointment Requests' : 'My Appointments'}
        </div>
        {isParent && (
          <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55 ml-4"
            onClick={() => setShowForm(true)}>
            + Book Appointment
          </button>
        )}
      </div>

      {isLoading && <p className="text-[#636e72] text-center py-5">Loading appointments...</p>}

      {/* Empty state */}
      {list.length === 0 && !isLoading && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 text-center py-10">
          <div className="text-[3rem] mb-4">📅</div>
          <p className="text-[#636e72] mb-4">No appointments yet</p>
          {isParent && (
            <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55" onClick={() => setShowForm(true)}>
              Book Your First Appointment
            </button>
          )}
        </div>
      )}

      {/* ── ADVISOR VIEW ── */}
      {isAdvisor && (
        <>
          {pendingList.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
              <div className="bg-gradient-to-r from-[#ffeaa7] to-[#fdcb6e] text-[#2d3436] font-bold px-5 py-3 rounded-xl mb-5 shadow">
                📩 Pending Requests ({pendingList.length})
              </div>
              {pendingList.map(appt => (
                <div key={appt.id} className="bg-gradient-to-r from-[#ffeaa7] to-[#fdcb6e] p-4 rounded-[10px] mb-2.5">
                  <div className="flex justify-between items-start flex-wrap gap-2.5">
                    <div>
                      <p className="m-0 mb-1 font-bold text-[#2d3436] text-base">{appt.parent?.fullName || 'Parent'}</p>
                      <p className="m-0 mb-1 text-[#2d3436] text-[0.9rem]">
                        📅 {formatDate(appt.appointmentDate)} — {appt.timeSlot === 'morning' ? 'Morning' : 'Evening'} ({appt.appointmentTime})
                      </p>
                      {appt.child && <p className="m-0 mb-1 text-[#2d3436] text-[0.9rem]">Child: {appt.child.name}</p>}
                      {appt.reason && <p className="m-0 text-[#636e72] text-[0.85rem] italic">"{appt.reason}"</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => dispatch(approveAppointment(appt.id))} className="bg-gradient-to-r from-emerald-400 to-green-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 text-sm">
                        ✓ Approve
                      </button>
                      <button onClick={() => dispatch(rejectAppointment(appt.id))} className="bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 text-sm">
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {[...confirmedList, ...otherList].length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow">All Appointments</div>
              {[...confirmedList, ...otherList].map(appt => (
                <div key={appt.id} className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white px-4 py-2.5 flex justify-between items-center flex-wrap gap-2">
                    <strong className="text-sm">{appt.parent?.fullName || 'Parent'}</strong>
                    <div className="flex items-center gap-2">
                      <span className={`status-${appt.status} text-xs`}>{appt.status}</span>
                      <button onClick={() => openNotes(appt)}
                        className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-all border border-white/30">
                        📝 Notes
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-3 text-sm text-[#2d3436]">
                    <div className="mb-1">📅 {formatDate(appt.appointmentDate)} ⏰ {appt.appointmentTime}</div>
                    {appt.child && <div className="mb-1">👶 Child: {appt.child.name}</div>}
                    {appt.reason && <div className="text-[#636e72] italic mb-1">"{appt.reason}"</div>}
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
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="text-[#764ba2] font-bold mb-3">✅ Confirmed Appointments</h3>
              {confirmedList.map(appt => (
                <div key={appt.id} className="mb-4 pb-4 border-b border-[#f0f0f0]">
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Dr. {appt.advisor?.fullName || 'Advisor'}</strong></div>
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                    📅 {formatDate(appt.appointmentDate)} — {appt.timeSlot === 'morning' ? 'Morning' : 'Evening'} ({appt.appointmentTime})
                  </div>
                  {appt.child && <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">👶 Child: {appt.child.name}</div>}
                  {appt.reason && <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm italic">"{appt.reason}"</div>}
                  {appt.notes && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 px-3 py-2.5 rounded-r-xl mb-2 text-sm">
                      <div className="font-semibold text-amber-700 mb-1">📝 Doctor's Notes</div>
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
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="text-[#764ba2] font-bold mb-3">⏳ Pending Requests</h3>
              {pendingList.map(appt => (
                <div key={appt.id} className="mb-4 pb-4 border-b border-[#f0f0f0]">
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Dr. {appt.advisor?.fullName || 'Advisor'}</strong></div>
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                    📅 {formatDate(appt.appointmentDate)} — {appt.timeSlot === 'morning' ? 'Morning' : 'Evening'} ({appt.appointmentTime})
                  </div>
                  {appt.child && <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">👶 Child: {appt.child.name}</div>}
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
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="text-[#764ba2] font-bold mb-3">📋 Past & Other</h3>
              {otherList.map(appt => (
                <div key={appt.id} className="mb-2.5 pb-2.5 border-b border-[#f0f0f0]">
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Dr. {appt.advisor?.fullName || 'Advisor'}</strong></div>
                  <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">📅 {formatDate(appt.appointmentDate)}</div>
                  {appt.child && <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">👶 Child: {appt.child.name}</div>}
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
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-t-2xl flex justify-between items-center">
              <span>📝 Appointment Notes</span>
              <button onClick={() => setNotesModal(null)} className="text-white/80 hover:text-white text-xl leading-none">✕</button>
            </div>
            <div className="p-5">
              <div className="mb-3 text-sm text-[#636e72]">
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
                    className="w-8 h-8 rounded-lg border border-[#667eea] text-[#667eea] font-bold text-sm hover:bg-[#667eea] hover:text-white transition-all">
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
                className="w-full px-4 py-3 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors resize-y font-mono"
              />

              <div className="flex gap-2.5 mt-4">
                <button onClick={() => setNotesModal(null)}
                  className="flex-1 py-2.5 border-2 border-[#667eea] rounded-xl bg-white text-[#667eea] font-semibold text-sm">
                  Cancel
                </button>
                <button onClick={handleSaveNotes} disabled={notesSaving}
                  className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55">
                  {notesSaving ? 'Saving…' : notesSaved ? '✓ Saved!' : 'Save Notes'}
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
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-t-2xl shadow text-[1.1rem]">Book Appointment</div>
            <form onSubmit={handleSubmit} className="p-5">
              <div className="mb-4">
                <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Select Advisor</label>
                <select required value={form.advisorId} onChange={e => setForm({ ...form, advisorId: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                  <option value="">Choose an advisor...</option>
                  {advisors.map(a => <option key={a.id} value={a.id}>{a.fullName} — {a.specialty}</option>)}
                </select>
              </div>
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
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3}
                  placeholder="Brief reason for appointment..." className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors resize-y" />
              </div>
              <p className="text-[0.8rem] text-[#636e72] mb-4 italic bg-gradient-to-r from-[#f5f7fa] to-[#e9ecef] px-2.5 py-2.5 rounded-lg border-l-4 border-[#667eea]">
                ℹ️ Advisor will review your request and approve or reject it
              </p>
              <div className="flex gap-2.5">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border-2 border-[#667eea] rounded-lg bg-white text-[#667eea] font-semibold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55">
                  {saving ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
