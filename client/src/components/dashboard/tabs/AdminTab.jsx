'use client';

import { useEffect, useState } from 'react';
import apiService from '../../../services/api';

const SAFETY_CATEGORIES = ['Home Safety', 'Outdoor Safety', 'Food Safety', 'Travel Safety'];
const HEALTH_CATEGORIES = ['Vaccination', 'Nutrition', 'Sleep & Rest', 'Physical Activity', 'Dental Health'];
const AGE_GROUPS = ['All Ages', '0-2 years', '3-5 years', '6-12 years'];

export default function AdminTab({ initialSection = 'advisors' }) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [pendingAdvisors, setPendingAdvisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tipForm, setTipForm] = useState({ type: 'safety', title: '', category: SAFETY_CATEGORIES[0], content: '', ageGroup: 'All Ages' });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (activeSection === 'advisors') {
      setLoading(true);
      apiService.getPendingAdvisors()
        .then(r => setPendingAdvisors(r.data || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [activeSection]);

  const handleApprove = async (id) => {
    await apiService.approveAdvisor(id);
    setPendingAdvisors(prev => prev.filter(a => a.id !== id));
  };

  const handleReject = async (id) => {
    await apiService.rejectAdvisor(id);
    setPendingAdvisors(prev => prev.filter(a => a.id !== id));
  };

  const handleTipSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiService.createTip(tipForm);
      setSuccessMsg('Tip published successfully!');
      setTipForm({ type: tipForm.type, title: '', category: SAFETY_CATEGORIES[0], content: '', ageGroup: 'All Ages' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const switchSection = (id) => {
    setActiveSection(id);
    if (id === 'safety') setTipForm(f => ({ ...f, type: 'safety', category: SAFETY_CATEGORIES[0] }));
    if (id === 'health') setTipForm(f => ({ ...f, type: 'health', category: HEALTH_CATEGORIES[0] }));
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">
        ⚙️ Admin Panel
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2.5 mb-5">
        {[
          { id: 'advisors', label: '🛡️ Advisor Approval' },
          { id: 'safety', label: '⚠️ Safety Tips' },
          { id: 'health', label: '💪 Health Tips' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => switchSection(id)}
            className={activeSection === id
              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55'
              : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm'}>
            {label}
          </button>
        ))}
      </div>

      {/* Advisor Approval */}
      {activeSection === 'advisors' && (
        <div>
          {loading && <p className="text-center text-[#636e72] py-5">Loading...</p>}
          {!loading && pendingAdvisors.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 text-center py-10">
              <div className="text-[3rem] mb-4">✅</div>
              <p className="text-[#636e72]">No pending advisor applications</p>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {pendingAdvisors.map(advisor => (
              <div key={advisor.id} className="bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-2xl p-5 shadow-md">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <h3 className="m-0 mb-2.5 text-[1.1rem]">{advisor.fullName}</h3>
                    <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Specialization:</strong> {advisor.specialty}</div>
                    <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>License #:</strong> {advisor.licenseNumber}</div>
                    <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Experience:</strong> {advisor.experienceYears} years</div>
                    <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Phone:</strong> {advisor.phone}</div>
                    {advisor.availability && advisor.availability.length > 0 && (
                      <div className="mt-2.5">
                        <div className="text-[0.8rem] font-semibold text-[#764ba2] mb-1.5">AVAILABILITY</div>
                        <div className="flex flex-wrap gap-1">
                          {advisor.availability.map(a => (
                            <span key={a.id}
                              className="text-[0.75rem] px-2 py-0.5 rounded-[10px] bg-[#f0eeff] text-[#667eea] border border-[#a29bfe] capitalize">
                              {a.dayOfWeek} {parseInt(a.startTime) < 13 ? 'Morning' : 'Evening'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleApprove(advisor.id)} className="bg-gradient-to-r from-emerald-400 to-green-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 text-sm">
                      ✓ Approve
                    </button>
                    <button onClick={() => handleReject(advisor.id)} className="bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 text-sm">
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      {(activeSection === 'safety' || activeSection === 'health') && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 max-w-[600px]">
          <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base">
            📝 Upload {activeSection === 'safety' ? 'Safety' : 'Health'} Tip
          </div>

          {successMsg && (
            <div className="bg-[#00b894] text-white px-3 py-3 rounded-lg mb-4 font-semibold">
              ✓ {successMsg}
            </div>
          )}

          <form onSubmit={handleTipSubmit}>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Title</label>
              <input required value={tipForm.title} onChange={e => setTipForm({ ...tipForm, title: e.target.value })}
                placeholder={activeSection === 'safety' ? 'e.g., Swimming Safety' : 'e.g., Vaccination Guide'}
                className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors" />
            </div>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Category</label>
              <select value={tipForm.category} onChange={e => setTipForm({ ...tipForm, category: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                {(activeSection === 'safety' ? SAFETY_CATEGORIES : HEALTH_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Age Group</label>
              <select value={tipForm.ageGroup} onChange={e => setTipForm({ ...tipForm, ageGroup: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors">
                {AGE_GROUPS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-[#764ba2] font-semibold mb-1.5 text-sm">Content</label>
              <textarea required value={tipForm.content} onChange={e => setTipForm({ ...tipForm, content: e.target.value })} rows={5}
                placeholder={`Enter ${activeSection} tip content...`}
                className="w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] text-sm transition-colors resize-y" />
            </div>
            <button type="submit" disabled={saving} className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55">
              {saving ? 'Publishing...' : '📤 Publish Tip'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
