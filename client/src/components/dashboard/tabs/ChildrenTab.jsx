'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchChildren, addChild, deleteChild } from '../../../redux/slices/childrenSlice';

function calcAge(dob) {
  if (!dob) return '';
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} yr${years !== 1 ? 's' : ''}`;
}

function calcBmi(weight, height) {
  if (!weight || !height) return null;
  const h = parseFloat(height) / 100;
  return Math.round((parseFloat(weight) / (h * h)) * 10) / 10;
}

function bmiStatus(bmi) {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (bmi < 25)   return { label: 'Normal',      color: 'text-green-600 bg-green-50 border-green-200' };
  if (bmi < 30)   return { label: 'Overweight',  color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return               { label: 'Obese',         color: 'text-red-600 bg-red-50 border-red-200' };
}

const GENDER_LABEL = { male: 'Male', female: 'Female', other: 'Other' };
const FREE_PLAN_LIMIT = 1;

function UpgradeBanner({ onClose, onUpgrade }) {
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-5 flex items-start gap-4">
      <div className="flex-1">
        <p className="font-bold text-amber-800 text-sm mb-1">Free Plan — 1 Profile Limit Reached</p>
        <p className="text-amber-700 text-xs mb-3">
          You have used your 1 free child profile. Upgrade to <strong>Premium (5,000 MMK)</strong> to add unlimited children profiles.
        </p>
        <button
          onClick={onUpgrade}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all"
        >
          Upgrade to Premium
        </button>
      </div>
      <button onClick={onClose} className="text-amber-400 hover:text-amber-600 flex-shrink-0 text-sm font-semibold">
        Close
      </button>
    </div>
  );
}

export default function ChildrenTab() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, isLoading } = useSelector((s) => s.children);
  const { user } = useSelector((s) => s.auth);
  const [showForm, setShowForm] = useState(false);
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(false);
  const [form, setForm] = useState({
    name: '', dateOfBirth: '', gender: 'male',
    bloodType: '', allergies: '', medicalConditions: '',
    currentWeight: '', currentHeight: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isFree = user?.userType === 'parent' && user?.planType !== 'premium';
  const isPremium = user?.planType === 'premium';
  const atFreeLimit = isFree && list.length >= FREE_PLAN_LIMIT;

  useEffect(() => { dispatch(fetchChildren()); }, [dispatch]);

  const handleAddClick = () => {
    if (atFreeLimit) {
      setShowUpgradeBanner(true);
      return;
    }
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { currentWeight, currentHeight, ...childData } = form;
      await dispatch(addChild({
        ...childData,
        weight: currentWeight ? parseFloat(currentWeight) : undefined,
        height: currentHeight ? parseFloat(currentHeight) : undefined,
      })).unwrap();
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
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold text-lg px-5 py-3 rounded-xl shadow flex-1">
          My Children
          {isFree && (
            <span className="ml-3 text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">
              {list.length}/{FREE_PLAN_LIMIT} Free Profile{FREE_PLAN_LIMIT > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={handleAddClick}
          className={`ml-4 font-bold px-5 py-3 rounded-xl text-sm shadow transition-all active:scale-95 ${
            atFreeLimit
              ? 'bg-amber-400 text-white hover:bg-amber-500'
              : 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:opacity-90'
          }`}
        >
          {atFreeLimit ? 'Upgrade to Add More' : '+ Add Child'}
        </button>
      </div>

      {/* Upgrade banner */}
      {showUpgradeBanner && (
        <UpgradeBanner
          onClose={() => setShowUpgradeBanner(false)}
          onUpgrade={() => router.push('/upgrade')}
        />
      )}

      {isLoading && <p className="text-center text-gray-400 py-10">Loading...</p>}

      {/* Children Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(child => {
          const bmiVal = child.bmi ? parseFloat(child.bmi) : calcBmi(child.weight, child.height);
          const status = isPremium ? bmiStatus(bmiVal) : null;

          return (
            <div key={child.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              {/* Name + meta */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 text-base leading-snug">
                  {child.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400">{calcAge(child.dateOfBirth)}</span>
                  <span className="text-gray-200">|</span>
                  <span className="text-xs text-gray-400">{GENDER_LABEL[child.gender] || 'Other'}</span>
                  {child.bloodType && (
                    <>
                      <span className="text-gray-200">|</span>
                      <span className="text-xs text-gray-400">Blood type: {child.bloodType}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Weight / Height / BMI */}
              <div className={`grid gap-3 mb-4 ${isPremium ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <p className="text-gray-400 text-xs mb-0.5">Weight</p>
                  <p className="font-bold text-gray-800 text-sm">
                    {child.weight ? `${child.weight} kg` : '—'}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <p className="text-gray-400 text-xs mb-0.5">Height</p>
                  <p className="font-bold text-gray-800 text-sm">
                    {child.height ? `${child.height} cm` : '—'}
                  </p>
                </div>
                {isPremium && (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                    <p className="text-gray-400 text-xs mb-0.5">BMI</p>
                    {bmiVal ? (
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{bmiVal}</p>
                        {status && (
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${status.color}`}>
                            {status.label}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="font-bold text-gray-400 text-sm">—</p>
                    )}
                  </div>
                )}
              </div>

              {/* Allergies */}
              {child.allergies && (
                <p className="text-gray-400 text-xs mb-4 bg-gray-50 rounded-lg px-3 py-1.5">
                  Allergies: {child.allergies}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold py-2 rounded-xl text-xs hover:opacity-90 active:scale-95 transition-all">
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="flex-1 bg-white border-2 border-red-200 text-red-500 font-semibold py-2 rounded-xl text-xs hover:bg-red-50 active:scale-95 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New Child Card */}
        {!isLoading && !atFreeLimit && (
          <div
            onClick={handleAddClick}
            className="border-2 border-dashed border-[#667eea] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#667eea]/5 hover:bg-[#667eea]/10 transition-colors min-h-[180px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#667eea]/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-[#667eea]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-[#667eea] font-semibold text-sm">Add New Child</p>
          </div>
        )}

        {/* Locked card for free users at limit */}
        {!isLoading && atFreeLimit && (
          <div
            onClick={handleAddClick}
            className="border-2 border-dashed border-amber-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors min-h-[180px]"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-amber-600 font-semibold text-sm text-center">Premium Required</p>
            <p className="text-amber-500 text-xs mt-1 text-center">Upgrade to add more children</p>
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
