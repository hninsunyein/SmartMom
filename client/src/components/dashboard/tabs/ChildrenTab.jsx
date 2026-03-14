'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChildren, addChild, deleteChild } from '../../../redux/slices/childrenSlice';
import apiService from '../../../services/api';

function calcAge(dob) {
  if (!dob) return '';
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} yr${years !== 1 ? 's' : ''}`;
}

const GENDER_EMOJI = { male: '👦', female: '👧', other: '🧒' };

export default function ChildrenTab() {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector((s) => s.children);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', dateOfBirth: '', gender: 'male',
    bloodType: '', allergies: '', medicalConditions: '',
    currentWeight: '', currentHeight: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [growthMap, setGrowthMap] = useState({});

  useEffect(() => { dispatch(fetchChildren()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { currentWeight, currentHeight, ...childData } = form;
      const result = await dispatch(addChild(childData)).unwrap();
      const childId = result.id;
      if ((currentWeight || currentHeight) && childId) {
        try {
          await apiService.addGrowthMeasurement({
            childId,
            measurementDate: new Date().toISOString().split('T')[0],
            weight: currentWeight ? parseFloat(currentWeight) : undefined,
            height: currentHeight ? parseFloat(currentHeight) : undefined,
          });
          setGrowthMap(prev => ({ ...prev, [childId]: { weight: currentWeight, height: currentHeight } }));
        } catch { /* silent */ }
      }
      setShowForm(false);
      setForm({ name: '', dateOfBirth: '', gender: 'male', bloodType: '', allergies: '', medicalConditions: '', currentWeight: '', currentHeight: '' });
    } catch (err) { setError(err); }
    finally { setSaving(false); }
  };

  const handleDelete = (id) => { if (confirm('Remove this child?')) dispatch(deleteChild(id)); };

  const inputCls = 'w-full px-4 py-2.5 border-2 border-[#667eea] rounded-xl focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#667eea]/20 text-sm transition-colors';
  const labelCls = 'block text-[#764ba2] font-semibold mb-1 text-sm';

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-lg px-5 py-3 rounded-xl shadow flex-1">
          My Children
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="ml-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm shadow"
        >
          + Add Child
        </button>
      </div>

      {isLoading && <p className="text-center text-gray-400 py-10">Loading...</p>}

      {/* Children Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(child => {
          const g = growthMap[child.id] || {};
          return (
            <div key={child.id} className="bg-gradient-to-br from-yellow-100 to-orange-100 border border-orange-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 text-base mb-3">
                {GENDER_EMOJI[child.gender] || '🧒'} {child.name}{' '}
                <span className="text-gray-500 font-normal text-sm">({calcAge(child.dateOfBirth)})</span>
              </h3>

              <div className="flex gap-3 mb-3">
                {[{ label: 'Weight', val: g.weight ? `${g.weight} kg` : '—' }, { label: 'Height', val: g.height ? `${g.height} cm` : '—' }].map(({ label, val }) => (
                  <div key={label} className="flex-1 bg-white/70 rounded-xl px-3 py-2 border-l-4 border-[#667eea]">
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="font-bold text-gray-800 text-sm">{val}</p>
                  </div>
                ))}
              </div>

              {child.bloodType && (
                <p className="text-gray-500 text-xs mb-3">
                  Blood Type: {child.bloodType}
                  {child.allergies ? ` • Allergies: ${child.allergies}` : ''}
                </p>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-[#a8b5ff] to-[#b197fc] text-white font-semibold py-2 rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all">
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="flex-1 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold py-2 rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Child Card */}
        {!isLoading && (
          <div
            onClick={() => setShowForm(true)}
            className="border-3 border-dashed border-[#667eea] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#667eea]/5 hover:bg-[#667eea]/10 transition-colors min-h-[180px]"
          >
            <div className="text-4xl mb-3">👶</div>
            <p className="text-[#667eea] font-semibold text-sm">+ Add New Child</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-base px-6 py-4 rounded-t-2xl">
              Create Child Profile
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-500 text-white px-4 py-3 rounded-xl text-sm">{error}</div>}

              <div>
                <label className={labelCls}>Child Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Enter child's name" />
              </div>

              <div>
                <label className={labelCls}>Date of Birth</label>
                <input required type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inputCls}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Weight (kg)</label>
                  <input type="number" step="0.1" min="0" value={form.currentWeight} onChange={e => setForm({ ...form, currentWeight: e.target.value })} className={inputCls} placeholder="e.g. 16.5" />
                </div>
                <div>
                  <label className={labelCls}>Height (cm)</label>
                  <input type="number" step="0.1" min="0" value={form.currentHeight} onChange={e => setForm({ ...form, currentHeight: e.target.value })} className={inputCls} placeholder="e.g. 101" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Blood Type (Optional)</label>
                <select value={form.bloodType} onChange={e => setForm({ ...form, bloodType: e.target.value })} className={inputCls}>
                  <option value="">Select blood type</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className={labelCls}>Allergies (Optional)</label>
                <input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} className={inputCls} placeholder="e.g. Peanuts, Dairy" />
              </div>

              <div>
                <label className={labelCls}>Medical Conditions (Optional)</label>
                <textarea value={form.medicalConditions} onChange={e => setForm({ ...form, medicalConditions: e.target.value })} rows={2} className={inputCls} placeholder="Any known conditions" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 border-2 border-[#667eea] text-[#667eea] font-semibold rounded-xl hover:bg-[#667eea]/5 active:scale-95 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55">
                  {saving ? 'Saving...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
