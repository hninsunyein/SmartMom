'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
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
      <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-purple-700 text-lg font-bold mb-1">Account Created!</h3>
          <p className="text-gray-500 text-xs">Welcome to Smart Mom! Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-start justify-center px-5 py-6">
      <div className="w-full max-w-sm">

        <div className="text-center mb-3">
          <div className="text-4xl mb-1">🤱</div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">Smart Mom</h1>
          <p className="text-white/85 mt-0.5 text-xs">Create your parent account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">Parent Sign Up</h2>
          <p className="text-gray-400 text-xs mb-3">Create your account to get started.</p>

          {(error || localError) && (
            <div className="bg-red-500 text-white px-3 py-2 rounded-xl mb-3 text-xs font-medium">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {[
              { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '09xxxxxxxxx' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-purple-700 font-semibold mb-1 text-xs">{label}</label>
                <input
                  name={name} type={type} required={name !== 'phone'}
                  placeholder={placeholder} value={formData[name]} onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#667eea]/20 text-sm transition-colors"
                />
              </div>
            ))}

            {[
              { name: 'password', label: 'Password', show: showPassword, toggle: () => setShowPassword(!showPassword) },
              { name: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
            ].map(({ name, label, show, toggle }) => (
              <div key={name}>
                <label className="block text-purple-700 font-semibold mb-1 text-xs">{label}</label>
                <div className="relative">
                  <input
                    name={name} type={show ? 'text' : 'password'} required
                    placeholder="••••••••" value={formData[name]} onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-[#764ba2] focus:ring-2 focus:ring-[#667eea]/20 text-sm transition-colors"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667eea] hover:text-purple-700 transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {name === 'confirmPassword' && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            ))}

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up as Parent'}
            </button>
          </form>

          <div className="flex justify-between mt-3">
            <a href="/login" className="text-purple-600 font-semibold text-xs hover:underline">
              Already have an account?
            </a>
            <a href="/login" className="text-purple-600 font-semibold text-xs hover:underline">
              Sign In
            </a>
          </div>

          <div className="border-t border-gray-100 mt-3 pt-3 text-center">
            <p className="text-gray-500 text-xs mb-2">Are you a healthcare professional?</p>
            <a
              href="/register/advisor"
              className="block w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-semibold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-xs text-center"
            >
              Register as Advisor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
