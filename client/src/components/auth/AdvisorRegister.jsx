'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Stethoscope } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white flex items-center justify-center px-5">
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-[#2C3E50] text-2xl font-bold mb-2">Registration Submitted!</h3>
          <p className="text-[#64748B] text-sm mb-5">
            Your application is pending admin approval. You will be redirected to the sign-in page shortly.
          </p>
          <button
            onClick={() => router.push('/login/advisor')}
            className="w-full bg-[#8BA888] text-white font-semibold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all text-sm"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF5F3] to-white flex items-start justify-center px-5 py-8">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2C3E50]">Smart Mom</h1>
          <p className="text-[#64748B] mt-1 text-sm">Join as Healthcare Advisor</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-8">
          <h2 className="text-xl font-bold text-[#2C3E50] mb-1">Advisor Sign Up</h2>
          <p className="text-[#64748B] text-sm mb-6">Register as a healthcare professional to join our platform.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {[
                { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Dr. Name' },
                { name: 'specialty', label: 'Specialization', type: 'text', placeholder: 'Child Nutrition, etc.' },
                { name: 'licenseNumber', label: 'License Number', type: 'text', placeholder: 'License #' },
                { name: 'experienceYears', label: 'Experience (years)', type: 'number', placeholder: '5' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'advisor@email.com' },
                { name: 'phone', label: 'Phone', type: 'tel', placeholder: '09xxxxxxxxx' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-[#2C3E50] font-semibold mb-2 text-sm">{label}</label>
                  <input
                    name={name} type={type} required
                    placeholder={placeholder} value={formData[name]} onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all"
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
                      className="w-full px-4 py-3 pr-12 border-2 border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#8BA888] focus:ring-3 focus:ring-[#8BA888]/10 text-sm transition-all"
                    />
                    <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#8BA888] transition-colors">
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-br from-[#F0F9F5] to-[#E6F4EF] border border-[#8BA888]/20 rounded-lg p-5 mb-4">
              <h4 className="text-[#2C3E50] font-bold mb-4 text-base">Set Your Availability</h4>
              <div className="space-y-2.5">
                {DAYS.map(day => (
                  <div key={day.value} className="bg-white rounded-lg px-4 py-3 border border-[#E2E8F0]">
                    <p className="font-bold text-[#2C3E50] text-sm mb-2">{day.label}</p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                      {[
                        { slot: 'morning', label: 'Morning (9AM–12PM)' },
                        { slot: 'evening', label: 'Evening (2PM–5PM)' },
                      ].map(({ slot, label }) => (
                        <label key={slot} className="flex items-center gap-2 cursor-pointer text-sm text-[#64748B]">
                          <input
                            type="checkbox"
                            checked={availability[day.value][slot]}
                            onChange={() => toggleSlot(day.value, slot)}
                            className="accent-[#8BA888] w-4 h-4"
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 text-sm text-[#64748B]">
              <span className="font-semibold text-[#2C3E50]">Note:</span> Your advisor account will be pending admin approval before you can log in.
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#8BA888] text-white font-semibold py-3 rounded-lg hover:bg-[#6D8A6A] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
            >
              {isLoading ? 'Submitting...' : 'Submit for Admin Review'}
            </button>
          </form>

          <a href="/login" className="block text-center text-[#8BA888] font-semibold text-sm mt-4 hover:text-[#6D8A6A] transition-colors">
            Already have an account? Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
