'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Heart, CheckCircle } from 'lucide-react';
import { registerParent, clearError } from '../../redux/slices/authSlice';

export default function ParentRegister() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, error, isAuthenticated, user } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.userType === 'parent') {
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setLocalError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (formData.password !== formData.confirmPassword) { setLocalError('Passwords do not match'); return; }
    if (formData.password.length < 8) { setLocalError('Password must be at least 8 characters'); return; }
    const { confirmPassword, ...submitData } = formData;
    submitData.age = 30;
    await dispatch(registerParent(submitData));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white flex items-center justify-center px-5">
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-[#2C3E50] text-2xl font-bold mb-2">Account Created!</h3>
          <p className="text-[#64748B] text-sm">Welcome to Smart Mom! Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white flex items-start justify-center px-5 py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FF9B8F] to-[#E87B6F] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Smart Mom</h1>
          <p className="text-[#64748B] mt-1 text-sm">Create your parent account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8">
          <h2 className="text-xl font-bold text-[#2C3E50] mb-1">Parent Sign Up</h2>
          <p className="text-[#64748B] text-sm mb-6">Create your account to get started.</p>

          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '09xxxxxxxxx' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">{label}</label>
                <input
                  name={name} type={type} required={name !== 'phone'}
                  placeholder={placeholder} value={formData[name]} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#FF9B8F] focus:ring-3 focus:ring-[#FF9B8F]/10 text-sm transition-all"
                />
              </div>
            ))}

            {[
              { name: 'password', label: 'Password', show: showPassword, toggle: () => setShowPassword(!showPassword) },
              { name: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
            ].map(({ name, label, show, toggle }) => (
              <div key={name}>
                <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">{label}</label>
                <div className="relative">
                  <input
                    name={name} type={show ? 'text' : 'password'} required
                    placeholder="Enter your password" value={formData[name]} onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#FF9B8F] focus:ring-3 focus:ring-[#FF9B8F]/10 text-sm transition-all"
                  />
                  <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#FF9B8F] transition-colors">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {name === 'confirmPassword' && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            ))}

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#FF9B8F] text-white font-semibold py-3 rounded-lg hover:bg-[#E87B6F] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up as Parent'}
            </button>
          </form>

          <div className="flex justify-between mt-4">
            <a href="/login" className="text-[#FF9B8F] font-semibold text-sm hover:text-[#E87B6F] transition-colors">
              Already have an account?
            </a>
            <a href="/login" className="text-[#FF9B8F] font-semibold text-sm hover:text-[#E87B6F] transition-colors">
              Sign In
            </a>
          </div>

          <div className="border-t border-[#E2E8F0] mt-6 pt-6 text-center">
            <p className="text-[#64748B] text-sm mb-3">Are you a healthcare professional?</p>
            <a
              href="/register/advisor"
              className="block w-full bg-[#8BA888] text-white font-semibold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all text-sm"
            >
              Register as Advisor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
