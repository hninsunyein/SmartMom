'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser, clearError } from '../../redux/slices/authSlice';

export default function AdvisorLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated, isHydrating, user } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isHydrating && isAuthenticated && user) router.push('/dashboard');
  }, [isHydrating, isAuthenticated, user, router]);
  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  if (isHydrating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(formData)); };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-1">👨‍⚕️</div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">Smart Mom</h1>
          <p className="text-white/85 mt-0.5 text-xs">Healthcare Professional Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">Advisor Sign In</h2>
          <p className="text-gray-400 text-xs mb-4">Access your advisor dashboard and manage appointments.</p>

          {error && (
            <div className="bg-red-500 text-white px-3 py-2 rounded-xl mb-3 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-purple-700 font-semibold mb-1 text-xs">Email Address</label>
              <input
                name="email" type="email" required
                placeholder="advisor@email.com"
                value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-300/30 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-purple-700 font-semibold mb-1 text-xs">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-300/30 text-sm transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex justify-between mt-3">
            <a href="/forgot-password" className="text-purple-600 font-semibold text-xs hover:underline">
              Forgot Password?
            </a>
            <a href="/register/advisor" className="text-purple-600 font-semibold text-xs hover:underline">
              Sign Up
            </a>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 text-center">
            <p className="text-gray-500 text-xs mb-2">Are you a parent?</p>
            <a
              href="/login"
              className="block w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-semibold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-xs text-center"
            >
              Sign in as Parent
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
