'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser, clearError } from '../../redux/slices/authSlice';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated, isHydrating, user } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isHydrating && isAuthenticated && user) router.push('/dashboard');
  }, [isHydrating, isAuthenticated, user, router]);
  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  if (isHydrating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fd79a8] to-[#e84393] flex items-center justify-center">
        <div className="text-white text-lg font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); dispatch(loginUser(formData)); };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#fd79a8] to-[#e84393] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">

        <div className="text-center mb-4">
          <div className="text-4xl mb-1">⚙️</div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">Smart Mom</h1>
          <p className="text-white/85 mt-0.5 text-xs">System Administration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-lg font-extrabold text-[#e84393] text-center mb-0.5">Admin Sign In</h2>
          <div className="w-10 h-1 bg-gradient-to-r from-[#fd79a8] to-[#e84393] rounded-full mx-auto mb-4"></div>

          {error && (
            <div className="bg-red-500 text-white px-3 py-2 rounded-xl mb-3 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[#e84393] font-semibold mb-1 text-xs">Admin Email</label>
              <input
                name="email" type="email" required
                placeholder="admin@smartmom.com"
                value={formData.email} onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-[#fd79a8] rounded-xl focus:outline-none focus:border-[#e84393] focus:ring-2 focus:ring-[#fd79a8]/20 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#e84393] font-semibold mb-1 text-xs">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                  className="w-full px-3 py-2 pr-10 border-2 border-[#fd79a8] rounded-xl focus:outline-none focus:border-[#e84393] focus:ring-2 focus:ring-[#fd79a8]/20 text-sm transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e84393] hover:text-[#fd79a8] transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#fd79a8] to-[#e84393] text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <a href="/" className="block text-center text-[#e84393] font-semibold text-xs mt-4 hover:underline">
            ← Back to Home
          </a>
        </div>

        <p className="text-center mt-3 text-white/70 text-xs">
          This portal is for system administrators only.
        </p>
      </div>
    </div>
  );
}
