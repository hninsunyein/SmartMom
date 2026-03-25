'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import apiService from '../../services/api';

const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const initAvail = () => {
  const a = {};
  DAYS.forEach(d => { a[d.value] = { morning: false, evening: false }; });
  return a;
};

export default function AdvisorRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '', specialty: '', licenseNumber: '', experienceYears: '',
    email: '', phone: '', password: '', confirmPassword: '',
  });
  const [availability, setAvailability] = useState(initAvail());
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };
  const toggleSlot = (day, slot) => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], [slot]: !prev[day][slot] } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }

    const availabilityArray = [];
    for (const [day, slots] of Object.entries(availability)) {
      if (slots.morning) availabilityArray.push({ dayOfWeek: day, startTime: '09:00', endTime: '12:00' });
      if (slots.evening) availabilityArray.push({ dayOfWeek: day, startTime: '14:00', endTime: '17:00' });
    }
    if (availabilityArray.length === 0) { setError('Please set at least one availability slot'); return; }

    setIsLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      data.experienceYears = parseInt(data.experienceYears) || 0;
      data.availability = availabilityArray;
      const response = await apiService.registerAdvisor(data);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => router.push('/login/advisor'), 3000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-purple-700 text-lg font-bold mb-1">Registration Submitted!</h3>
          <p className="text-gray-500 text-xs mb-5">
            Your application is pending admin approval. You will be redirected to the sign-in page shortly.
          </p>
          <button
            onClick={() => router.push('/login/advisor')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-start justify-center px-5 py-6">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-4">
          <div className="text-4xl mb-1">👨‍⚕️</div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">Smart Mom</h1>
          <p className="text-white/85 mt-0.5 text-xs">Join as Healthcare Advisor</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">Advisor Sign Up</h2>
          <p className="text-gray-400 text-xs mb-4">Register as a healthcare professional to join our platform.</p>

          {error && (
            <div className="bg-red-500 text-white px-3 py-2 rounded-xl mb-3 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {[
                { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Dr. Name' },
                { name: 'specialty', label: 'Specialization', type: 'text', placeholder: 'Child Nutrition, etc.' },
                { name: 'licenseNumber', label: 'License Number', type: 'text', placeholder: 'License #' },
                { name: 'experienceYears', label: 'Experience (years)', type: 'number', placeholder: '5' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'advisor@email.com' },
                { name: 'phone', label: 'Phone', type: 'tel', placeholder: '09xxxxxxxxx' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-purple-700 font-semibold mb-1 text-xs">{label}</label>
                  <input
                    name={name} type={type} required
                    placeholder={placeholder} value={formData[name]} onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20 text-sm transition-colors"
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
                      className="w-full px-3 py-2 pr-10 border-2 border-purple-400 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-400/20 text-sm transition-colors"
                    />
                    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 transition-colors">
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-r from-[#a29bfe] to-[#6c5ce7] rounded-xl p-4 mb-3">
              <h4 className="text-white font-bold mb-3 text-sm">Set Your Availability</h4>
              <div className="space-y-1.5">
                {DAYS.map(day => (
                  <div key={day.value} className="bg-white rounded-xl px-3 py-2">
                    <p className="font-bold text-gray-700 text-xs mb-1.5">{day.label}</p>
                    <div className="flex gap-6">
                      {[
                        { slot: 'morning', label: 'Morning (9AM–12PM)' },
                        { slot: 'evening', label: 'Evening (2PM–5PM)' },
                      ].map(({ slot, label }) => (
                        <label key={slot} className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={availability[day.value][slot]}
                            onChange={() => toggleSlot(day.value, slot)}
                            className="accent-purple-400 w-3.5 h-3.5"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-3 text-xs text-gray-600">
              <span className="font-semibold">Note:</span> Your advisor account will be pending admin approval before you can log in.
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white font-bold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-55 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? 'Submitting...' : 'Submit for Admin Review'}
            </button>
          </form>

          <a href="/login" className="block text-center text-purple-400 font-semibold text-xs mt-3 hover:underline">
            Already have an account? Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
