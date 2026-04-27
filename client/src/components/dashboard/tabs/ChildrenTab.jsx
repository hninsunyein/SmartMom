'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchChildren, addChild, deleteChild } from '../../../redux/slices/childrenSlice';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden border border-[#E2E8F0]">
        <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] px-6 py-4">
          <p className="text-white font-bold text-base">Confirm Action</p>
        </div>
        <div className="p-6">
          <p className="text-[#64748B] text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 py-2.5 border-2 border-[#E2E8F0] text-[#64748B] font-semibold rounded-lg hover:border-[#8BA888] hover:text-[#8BA888] transition-all text-sm">
              Cancel
            </button>
            <button onClick={onConfirm}
              className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-lg hover:bg-red-600 transition-all text-sm">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 mb-5 flex items-start gap-4">
      <div className="flex-1">
        <p className="font-bold text-amber-800 text-sm mb-1">Free Plan — 1 Profile Limit Reached</p>
        <p className="text-amber-700 text-xs mb-3">
          You have used your 1 free child profile. Upgrade to <strong>Premium (5,000 MMK)</strong> to add unlimited children profiles.
        </p>
        <button
          onClick={onUpgrade}
          className="bg-[#8BA888] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#6D8A6A] transition-all"
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
  const [confirmId, setConfirmId] = useState(null);

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

  const handleDelete = (id) => setConfirmId(id);
  const handleConfirmDelete = () => { dispatch(deleteChild(confirmId)); setConfirmId(null); };
  const handleCancelDelete = () => setConfirmId(null);

  const inputCls = 'w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all';
  const labelCls = 'block text-[#2C3E50] font-semibold mb-2 text-sm';

  return (
    <div>
      {confirmId && (
        <ConfirmModal
          message="Are you sure to remove?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold text-xl px-6 py-4 rounded-lg shadow-sm flex-1">
          My Children
          {isFree && (
            <span className="ml-3 text-xs font-normal bg-white/20 px-2.5 py-1 rounded-full">
              {list.length}/{FREE_PLAN_LIMIT} Free Profile{FREE_PLAN_LIMIT > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={handleAddClick}
          className={`ml-4 font-bold px-5 py-3 rounded-lg text-sm shadow-sm transition-all ${
            atFreeLimit
              ? 'bg-amber-400 text-white hover:bg-amber-500'
              : 'bg-[#8BA888] text-white hover:bg-[#6D8A6A]'
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

      {isLoading && <p className="text-center text-[#64748B] py-10">Loading...</p>}

      {/* Children Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map(child => {
          const bmiVal = child.bmi ? parseFloat(child.bmi) : calcBmi(child.weight, child.height);
          const status = isPremium ? bmiStatus(bmiVal) : null;

          return (
            <div key={child.id} className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              {/* Name + meta */}
              <div className="mb-4">
                <h3 className="font-bold text-[#2C3E50] text-lg leading-snug">
                  {child.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-[#64748B]">{calcAge(child.dateOfBirth)}</span>
                  <span className="text-[#E2E8F0]">|</span>
                  <span className="text-xs text-[#64748B]">{GENDER_LABEL[child.gender] || 'Other'}</span>
                  {child.bloodType && (
                    <>
                      <span className="text-[#E2E8F0]">|</span>
                      <span className="text-xs text-[#64748B]">Blood type: {child.bloodType}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Weight / Height / BMI */}
              <div className={`grid gap-3 mb-4 ${isPremium ? 'grid-cols-3' : 'grid-cols-2'}`}>
                <div className="bg-[#F0F9F5] border border-[#8BA888]/20 rounded-lg px-3 py-3">
                  <p className="text-[#64748B] text-xs mb-1 font-medium">Weight</p>
                  <p className="font-bold text-[#2C3E50] text-sm">
                    {child.weight ? `${child.weight} kg` : '—'}
                  </p>
                </div>
                <div className="bg-[#F0F9F5] border border-[#8BA888]/20 rounded-lg px-3 py-3">
                  <p className="text-[#64748B] text-xs mb-1 font-medium">Height</p>
                  <p className="font-bold text-[#2C3E50] text-sm">
                    {child.height ? `${child.height} cm` : '—'}
                  </p>
                </div>
                {isPremium && (
                  <div className="bg-[#F0F9F5] border border-[#8BA888]/20 rounded-lg px-3 py-3">
                    <p className="text-[#64748B] text-xs mb-1 font-medium">BMI</p>
                    {bmiVal ? (
                      <div>
                        <p className="font-bold text-[#2C3E50] text-sm">{bmiVal}</p>
                        {status && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${status.color}`}>
                            {status.label}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="font-bold text-[#64748B] text-sm">—</p>
                    )}
                  </div>
                )}
              </div>

              {/* Allergies */}
              {child.allergies && (
                <p className="text-[#64748B] text-xs mb-4 bg-[#FFF5F3] border border-[#FF9B8F]/20 rounded-lg px-3 py-2">
                  Allergies: {child.allergies}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-[#8BA888] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#6D8A6A] transition-all">
                  View Details
                </button>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="flex-1 bg-white border-2 border-red-200 text-red-500 font-semibold py-2.5 rounded-lg text-sm hover:bg-red-50 transition-all"
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
            className="border-2 border-dashed border-[#8BA888] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#F0F9F5] hover:bg-[#E6F4EF] transition-colors min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#8BA888]/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-[#8BA888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-[#8BA888] font-semibold text-sm">Add New Child</p>
          </div>
        )}

        {/* Locked card for free users at limit */}
        {!isLoading && atFreeLimit && (
          <div
            onClick={handleAddClick}
            className="border-2 border-dashed border-amber-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl border border-[#E2E8F0]">
            <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold text-lg px-6 py-4 rounded-t-xl">
              Create Child Profile
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

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
                  className="flex-1 py-3 border-2 border-[#E2E8F0] text-[#64748B] font-semibold rounded-lg hover:border-[#8BA888] hover:text-[#8BA888] transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#8BA888] text-white font-bold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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
