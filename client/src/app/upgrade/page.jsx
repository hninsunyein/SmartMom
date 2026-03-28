'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { upgradePlan } from '../../redux/slices/authSlice';

const FREE_FEATURES = [
  '1 child profile',
  'Nutrition calculator (calories)',
  'General meal suggestions by age group',
  'Height & weight growth tracking',
  'Growth chart records',
  'Safety tips by age group',
  'Health tips by age group',
];

const PREMIUM_FEATURES = [
  'Everything in Free',
  'Unlimited children profiles',
  'BMI-based personalized meal plans',
  'Book appointments with advisors',
  'Browse & connect with advisors',
  'Save advisor notes & consultation history',
];

const PAYMENT_STEPS = [
  { step: '1', text: 'Transfer 5,000 MMK to KBZ Pay / Wave Pay: 09-XXX-XXX-XXX (Smart Mom)' },
  { step: '2', text: 'Take a screenshot of your payment receipt' },
  { step: '3', text: 'Click "Confirm & Activate Premium" below' },
];

export default function UpgradePage() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isPremium = user?.planType === 'premium';

  const handleUpgrade = async () => {
    if (!confirmed) {
      setError('Please confirm that you have completed the payment.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await dispatch(upgradePlan()).unwrap();
      setSuccess(true);
    } catch (err) {
      setError(err || 'Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (user?.userType !== 'parent') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7ff] to-[#ede9ff] flex flex-col items-center px-4 py-10">

      {/* Header */}
      <div className="w-full max-w-4xl mb-8 flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-[#667eea] hover:text-[#764ba2] font-semibold text-sm flex items-center gap-1.5 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="w-full max-w-4xl">

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#667eea] to-[#764ba2]">Premium</span></h1>
          <p className="text-gray-500 text-sm">Unlock the full Smart Mom experience for your family</p>
        </div>

        {/* Already Premium */}
        {isPremium && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-8 text-center mb-8">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-emerald-700 mb-2">You're already on Premium!</h2>
            <p className="text-emerald-600 text-sm mb-5">All premium features are unlocked for your account.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Success State */}
        {success && !isPremium && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-8 text-center mb-8">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-emerald-700 mb-2">Welcome to Premium!</h2>
            <p className="text-emerald-600 text-sm mb-5">All premium features are now unlocked. Enjoy Smart Mom Premium!</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {!isPremium && !success && (
          <>
            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

              {/* Free Plan */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">📋</div>
                  <div>
                    <h3 className="font-bold text-gray-800">Free Plan</h3>
                    <p className="text-gray-400 text-sm font-semibold">0 MMK / forever</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-gray-400 mt-0.5 flex-shrink-0">○</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-[#667eea]/5 to-[#764ba2]/10 rounded-2xl border-2 border-[#667eea] p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-xl">⭐</div>
                  <div>
                    <h3 className="font-bold text-gray-800">Premium Plan</h3>
                    <p className="text-[#667eea] text-sm font-bold">5,000 MMK / one-time</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {PREMIUM_FEATURES.map((f, i) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${i === 0 ? 'text-[#667eea] font-bold text-base leading-none' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2]'}`}>
                        {i === 0 ? '↑' : (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className={i === 0 ? 'font-semibold text-[#667eea]' : ''}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-800 text-base mb-4">Payment Instructions</h2>
              <div className="space-y-3">
                {PAYMENT_STEPS.map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              {/* Confirmation checkbox */}
              <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => { setConfirmed(e.target.checked); setError(''); }}
                  className="w-5 h-5 rounded border-2 border-[#667eea] accent-[#667eea] cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I have completed the payment of <strong>5,000 MMK</strong> and understand it is non-refundable.
                </span>
              </label>

              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                  {error}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-3.5 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Maybe Later
              </button>
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-55 shadow-lg shadow-[#667eea]/30"
              >
                {loading ? 'Activating...' : '⭐ Confirm & Activate Premium'}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Having trouble? Contact us at support@smartmom.app
            </p>
          </>
        )}
      </div>
    </div>
  );
}
