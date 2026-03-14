'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '../../services/api';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await apiService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
          <div className="text-4xl mb-3">📧</div>
          <h3 className="text-purple-700 text-lg font-bold mb-1">Check Your Email</h3>
          <p className="text-gray-500 text-xs mb-5">
            If this email exists, a reset link has been sent to{' '}
            <span className="text-purple-600 font-semibold">{email}</span>.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        <div className="text-center mb-4">
          <div className="text-4xl mb-1">🔑</div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">Smart Mom</h1>
          <p className="text-white/85 mt-0.5 text-xs">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">Forgot Password</h2>
          <p className="text-gray-400 text-xs mb-4">Enter your email address to receive a password reset link.</p>

          {error && (
            <div className="bg-red-500 text-white px-3 py-2 rounded-xl mb-3 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-purple-700 font-semibold mb-1 text-xs">Email Address</label>
              <input
                type="email" required
                placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-300/30 text-sm transition-colors"
              />
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <a href="/login" className="block text-center text-purple-600 font-semibold text-xs mt-4 hover:underline">
            ← Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
