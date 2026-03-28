'use client';

import { useEffect, useState } from 'react';
import apiService from '../../../services/api';

const SAFETY_CATEGORIES = ['Home Safety', 'Outdoor Safety', 'Food Safety', 'Travel Safety'];
const HEALTH_CATEGORIES = ['Vaccination', 'Nutrition', 'Sleep & Rest', 'Physical Activity', 'Dental Health'];
const AGE_GROUPS = ['All Ages', '0-2 years', '3-5 years', '6-12 years', '13-18 years'];

const inputCls = 'w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#667eea]/20 text-sm transition-colors';
const labelCls = 'block text-[#764ba2] font-semibold mb-1.5 text-sm';

// ── Confirm Modal ─────────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] px-6 py-4">
          <p className="text-white font-bold text-base">Confirm Action</p>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 py-2.5 border-2 border-[#667eea] text-[#667eea] font-semibold rounded-xl hover:bg-[#667eea]/5 active:scale-95 transition-all text-sm">
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_BADGE = {
  pending:  'bg-amber-50 text-amber-600 border border-amber-200',
  approved: 'bg-green-50 text-green-600 border border-green-200',
  rejected: 'bg-red-50 text-red-500 border border-red-200',
};

// ── Advisor Card ─────────────────────────────────────────────────────────────

function AdvisorCard({ advisor, onApprove, onReject, onDelete }) {
  const status = advisor.approvalStatus || 'pending';
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] px-5 py-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-bold text-base leading-snug">{advisor.fullName}</h3>
          <p className="text-white/70 text-xs mt-0.5">{advisor.email || ''}</p>
        </div>
        <span className={`text-[0.7rem] font-bold px-2.5 py-1 rounded-lg capitalize shrink-0 mt-0.5 ${STATUS_BADGE[status]}`}>
          {status}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-gray-400 text-xs mb-0.5">Specialization</p>
            <p className="font-semibold text-gray-800 text-sm">{advisor.specialty || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-gray-400 text-xs mb-0.5">Experience</p>
            <p className="font-semibold text-gray-800 text-sm">{advisor.experienceYears ? `${advisor.experienceYears} yrs` : '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-gray-400 text-xs mb-0.5">License No.</p>
            <p className="font-semibold text-gray-800 text-sm">{advisor.licenseNumber || '—'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-gray-400 text-xs mb-0.5">Phone</p>
            <p className="font-semibold text-gray-800 text-sm">{advisor.phone || '—'}</p>
          </div>
        </div>

        {/* Availability */}
        {advisor.availability && advisor.availability.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#764ba2] mb-2 uppercase tracking-wide">Availability</p>
            <div className="flex flex-wrap gap-1.5">
              {advisor.availability.map((a, i) => (
                <span key={a.id ?? i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#f0eeff] text-[#667eea] border border-[#a29bfe] capitalize font-medium">
                  {a.dayOfWeek} — {parseInt(a.startTime) < 13 ? 'Morning' : 'Afternoon'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {status === 'pending' && (
            <>
              <button onClick={() => onApprove(advisor.id)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all">
                Approve
              </button>
              <button onClick={() => onReject(advisor.id)}
                className="flex-1 bg-white border-2 border-amber-300 text-amber-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-amber-50 active:scale-95 transition-all">
                Reject
              </button>
            </>
          )}
          <button onClick={() => onDelete(advisor.id)}
            className="flex-1 bg-white border-2 border-red-200 text-red-500 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-50 active:scale-95 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tip Row ──────────────────────────────────────────────────────────────────

function TipRow({ tip, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <span className="text-[0.7rem] px-2 py-0.5 bg-[#f0eeff] text-[#667eea] rounded-lg font-bold">{tip.category}</span>
          {tip.ageGroup && (
            <span className="text-[0.7rem] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-lg">{tip.ageGroup}</span>
          )}
        </div>
        <p className="font-semibold text-gray-800 text-sm">{tip.title}</p>
        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{tip.content}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onEdit(tip)}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-95 transition-all">
          Edit
        </button>
        <button onClick={() => onDelete(tip.id)}
          className="bg-white border-2 border-red-200 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 active:scale-95 transition-all">
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Edit Tip Modal ────────────────────────────────────────────────────────────

function EditTipModal({ tip, onSave, onClose }) {
  const isHealth = tip.type === 'health';
  const categories = isHealth ? HEALTH_CATEGORIES : SAFETY_CATEGORIES;
  const [form, setForm] = useState({
    title: tip.title,
    category: tip.category,
    ageGroup: tip.ageGroup || 'All Ages',
    content: tip.content,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(tip.id, form);
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update tip.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-6 py-4">
          Edit Tip
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
          <div>
            <label className={labelCls}>Title</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Age Group</label>
            <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })} className={inputCls}>
              {AGE_GROUPS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Content</label>
            <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className={inputCls + ' resize-y'} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border-2 border-[#667eea] text-[#667eea] font-semibold rounded-xl hover:bg-[#667eea]/5 active:scale-95 transition-all text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 text-sm">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminTab({ initialSection = 'advisors' }) {
  const [activeSection, setActiveSection] = useState(initialSection);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm }

  // Advisor state
  const [advisors, setAdvisors] = useState([]);
  const [advisorFilter, setAdvisorFilter] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected'
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState('');

  // Tips state
  const [tipView, setTipView] = useState('list');
  const [tipsList, setTipsList] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [tipForm, setTipForm] = useState({ type: 'safety', title: '', category: SAFETY_CATEGORIES[0], content: '', ageGroup: 'All Ages' });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [tipError, setTipError] = useState('');

  useEffect(() => { setActiveSection(initialSection); }, [initialSection]);

  // Load all advisors
  useEffect(() => {
    if (activeSection !== 'advisors') return;
    setAdvisorLoading(true);
    setAdvisorError('');
    apiService.getAllAdvisors()
      .then(r => setAdvisors(r.data || []))
      .catch(err => setAdvisorError(err?.message || 'Failed to load advisors.'))
      .finally(() => setAdvisorLoading(false));
  }, [activeSection]);

  // Load tips list
  useEffect(() => {
    if (activeSection !== 'safety' && activeSection !== 'health') return;
    setTipsLoading(true);
    apiService.getTips(activeSection)
      .then(r => setTipsList(r.data || []))
      .catch(() => setTipsList([]))
      .finally(() => setTipsLoading(false));
  }, [activeSection]);

  const switchSection = (id) => {
    setActiveSection(id);
    setSuccessMsg('');
    setTipError('');
    setTipView('list');
    if (id === 'safety') setTipForm(f => ({ ...f, type: 'safety', title: '', category: SAFETY_CATEGORIES[0], content: '', ageGroup: 'All Ages' }));
    if (id === 'health') setTipForm(f => ({ ...f, type: 'health', title: '', category: HEALTH_CATEGORIES[0], content: '', ageGroup: 'All Ages' }));
  };

  // Advisor actions
  const handleApprove = async (id) => {
    try {
      await apiService.approveAdvisor(id);
      setAdvisors(prev => prev.map(a => a.id === id ? { ...a, approvalStatus: 'approved' } : a));
    } catch (err) { setAdvisorError(err?.message || 'Failed to approve advisor.'); }
  };

  const handleReject = async (id) => {
    try {
      await apiService.rejectAdvisor(id);
      setAdvisors(prev => prev.map(a => a.id === id ? { ...a, approvalStatus: 'rejected' } : a));
    } catch (err) { setAdvisorError(err?.message || 'Failed to reject advisor.'); }
  };

  const handleDeleteAdvisor = (id) => {
    setConfirmModal({
      message: 'Are you sure you want to permanently delete this advisor account? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await apiService.deleteAdvisor(id);
          setAdvisors(prev => prev.filter(a => a.id !== id));
        } catch (err) { setAdvisorError(err?.message || 'Failed to delete advisor.'); }
      },
    });
  };

  // Filtered advisors
  const filteredAdvisors = advisorFilter === 'all'
    ? advisors
    : advisors.filter(a => a.approvalStatus === advisorFilter);

  const counts = {
    all:      advisors.length,
    pending:  advisors.filter(a => a.approvalStatus === 'pending').length,
    approved: advisors.filter(a => a.approvalStatus === 'approved').length,
    rejected: advisors.filter(a => a.approvalStatus === 'rejected').length,
  };

  // Tip actions
  const handleTipSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTipError('');
    try {
      const created = await apiService.createTip(tipForm);
      setTipsList(prev => [created.data, ...prev]);
      setSuccessMsg('Tip published successfully!');
      setTipForm(f => ({ ...f, title: '', content: '' }));
      setTimeout(() => setSuccessMsg(''), 3000);
      setTipView('list');
    } catch (err) {
      setTipError(err?.message || 'Failed to publish tip. Please try again.');
    } finally { setSaving(false); }
  };

  const handleTipUpdate = async (id, data) => {
    const updated = await apiService.updateTip(id, data);
    setTipsList(prev => prev.map(t => t.id === id ? updated.data : t));
  };

  const handleTipDelete = (id) => {
    setConfirmModal({
      message: 'Are you sure you want to delete this tip? This action cannot be undone.',
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await apiService.deleteTip(id);
          setTipsList(prev => prev.filter(t => t.id !== id));
        } catch (err) { setTipError(err?.message || 'Failed to delete tip.'); }
      },
    });
  };

  const categories = activeSection === 'safety' ? SAFETY_CATEGORIES : HEALTH_CATEGORIES;

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-lg">
        Admin Panel
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2.5 mb-6 flex-wrap">
        {[
          { id: 'advisors', label: 'Advisor Management' },
          { id: 'safety',   label: 'Safety Tips' },
          { id: 'health',   label: 'Health Tips' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => switchSection(id)}
            className={activeSection === id
              ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow'
              : 'bg-white border-2 border-[#667eea] text-[#667eea] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#667eea]/5 active:scale-95 transition-all'}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Advisor Management ───────────────────────────────────────────── */}
      {activeSection === 'advisors' && (
        <div>
          {advisorError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{advisorError}</div>
          )}

          {/* Filter tabs */}
          {!advisorLoading && (
            <div className="flex gap-2 mb-5 flex-wrap">
              {[
                { key: 'all',      label: 'All' },
                { key: 'pending',  label: 'Pending' },
                { key: 'approved', label: 'Approved' },
                { key: 'rejected', label: 'Rejected' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => setAdvisorFilter(key)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                    advisorFilter === key
                      ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-transparent shadow'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#667eea] hover:text-[#667eea]'
                  }`}>
                  {label}
                  <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    advisorFilter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{counts[key]}</span>
                </button>
              ))}
            </div>
          )}

          {advisorLoading && <p className="text-center text-gray-400 py-10">Loading advisors...</p>}

          {!advisorLoading && filteredAdvisors.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#f0eeff] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#667eea]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-semibold">No {advisorFilter === 'all' ? '' : advisorFilter} advisors found</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAdvisors.map(advisor => (
              <AdvisorCard
                key={advisor.id}
                advisor={advisor}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDeleteAdvisor}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Safety / Health Tips ─────────────────────────────────────────── */}
      {(activeSection === 'safety' || activeSection === 'health') && (
        <div>
          {/* Sub-tabs */}
          <div className="flex gap-2 mb-5">
            <button onClick={() => setTipView('list')}
              className={tipView === 'list'
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2 rounded-xl text-sm shadow'
                : 'bg-white border-2 border-[#667eea] text-[#667eea] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#667eea]/5 transition-all'}>
              Manage Tips {tipsList.length > 0 && `(${tipsList.length})`}
            </button>
            <button onClick={() => { setTipView('add'); setSuccessMsg(''); setTipError(''); }}
              className={tipView === 'add'
                ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-4 py-2 rounded-xl text-sm shadow'
                : 'bg-white border-2 border-[#667eea] text-[#667eea] font-semibold px-4 py-2 rounded-xl text-sm hover:bg-[#667eea]/5 transition-all'}>
              + Add New Tip
            </button>
          </div>

          {tipError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">{tipError}</div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-4 font-semibold">{successMsg}</div>
          )}

          {/* List view */}
          {tipView === 'list' && (
            <div>
              {tipsLoading && <p className="text-center text-gray-400 py-10">Loading...</p>}
              {!tipsLoading && tipsList.length === 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                  <p className="text-gray-500 font-semibold">No {activeSection} tips yet</p>
                  <p className="text-gray-400 text-sm mt-1">Click "+ Add New Tip" to publish your first tip.</p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {tipsList.map(tip => (
                  <TipRow key={tip.id} tip={tip} onEdit={setEditingTip} onDelete={handleTipDelete} />
                ))}
              </div>
            </div>
          )}

          {/* Add form */}
          {tipView === 'add' && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm max-w-[600px]">
              <p className="font-bold text-[#764ba2] text-base mb-5">
                New {activeSection === 'safety' ? 'Safety' : 'Health'} Tip
              </p>
              <form onSubmit={handleTipSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>Title</label>
                  <input required value={tipForm.title} onChange={e => setTipForm({ ...tipForm, title: e.target.value })}
                    placeholder={activeSection === 'safety' ? 'e.g., Swimming Safety' : 'e.g., Vaccination Guide'}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={tipForm.category} onChange={e => setTipForm({ ...tipForm, category: e.target.value })} className={inputCls}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Age Group</label>
                  <select value={tipForm.ageGroup} onChange={e => setTipForm({ ...tipForm, ageGroup: e.target.value })} className={inputCls}>
                    {AGE_GROUPS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Content</label>
                  <textarea required value={tipForm.content} onChange={e => setTipForm({ ...tipForm, content: e.target.value })} rows={5}
                    placeholder={`Enter ${activeSection} tip content...`}
                    className={inputCls + ' resize-y'} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setTipView('list')}
                    className="flex-1 py-3 border-2 border-[#667eea] text-[#667eea] font-semibold rounded-xl hover:bg-[#667eea]/5 active:scale-95 transition-all text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 text-sm">
                    {saving ? 'Publishing...' : 'Publish Tip'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingTip && (
        <EditTipModal tip={editingTip} onSave={handleTipUpdate} onClose={() => setEditingTip(null)} />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}
