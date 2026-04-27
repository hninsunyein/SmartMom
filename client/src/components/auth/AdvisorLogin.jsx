'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white flex items-center justify-center">
        <div className="text-[#64748B] text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(formData)); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Smart Mom</h1>
          <p className="text-[#64748B] mt-1 text-sm">Healthcare Professional Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8">
          <h2 className="text-xl font-bold text-[#2C3E50] mb-1">Advisor Sign In</h2>
          <p className="text-[#64748B] text-sm mb-6">Access your advisor dashboard and manage appointments.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">Email Address</label>
              <input
                name="email" type="email" required
                placeholder="advisor@email.com"
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required
                  placeholder="Enter your password"
                  value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#8BA888] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#8BA888] text-white font-semibold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="flex justify-between mt-4">
            <a href="/forgot-password" className="text-[#8BA888] font-semibold text-sm hover:text-[#6D8A6A] transition-colors">
              Forgot Password?
            </a>
            <a href="/register/advisor" className="text-[#8BA888] font-semibold text-sm hover:text-[#6D8A6A] transition-colors">
              Sign Up
            </a>
          </div>

          <div className="border-t border-[#E2E8F0] mt-6 pt-6 text-center">
            <p className="text-[#64748B] text-sm mb-3">Are you a parent?</p>
            <a
              href="/login"
              className="block w-full bg-[#FF9B8F] text-white font-semibold py-3 rounded-lg hover:bg-[#E87B6F] transition-all text-sm"
            >
              Sign in as Parent
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
