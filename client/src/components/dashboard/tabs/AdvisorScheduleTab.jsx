'use client';

import { useSelector } from 'react-redux';
import { Calendar, CalendarDays, CalendarCheck, Phone, Mail, Briefcase, Clock } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdvisorScheduleTab() {
  const { user } = useSelector((state) => state.auth);
  const { list: appointments } = useSelector((state) => state.appointments);

  const today = new Date().toISOString().split('T')[0];

  const todayAppts = appointments
    .filter(a => {
      const d = a.appointmentDate?.split('T')[0] || a.appointmentDate;
      return d === today && a.status === 'confirmed';
    })
    .sort((a, b) => (a.appointmentTime || '').localeCompare(b.appointmentTime || ''));

  const upcomingAppts = appointments
    .filter(a => {
      const d = a.appointmentDate?.split('T')[0] || a.appointmentDate;
      return d > today && a.status === 'confirmed';
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  const availability = user?.advisorProfile?.availability || [];
  const byDay = {};
  availability.forEach(a => {
    if (!byDay[a.dayOfWeek]) byDay[a.dayOfWeek] = [];
    const hour = parseInt(a.startTime);
    byDay[a.dayOfWeek].push(hour < 13 ? 'Morning (9AM–12PM)' : 'Evening (2PM–5PM)');
  });

  return (
    <div>
      <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">My Schedule</div>

      {/* Today's appointments */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-5">
        <div className="bg-gradient-to-r from-[#55efc4] to-[#00b894] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <span>Today's Appointments — {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        {todayAppts.length === 0 ? (
          <p className="text-[#64748B] text-center py-5">No appointments scheduled for today</p>
        ) : (
          todayAppts.map(appt => (
            <div key={appt.id} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-xl mb-2 text-sm flex justify-between items-center">
              <div>
                <strong>{appt.appointmentTime} — {appt.parent?.fullName || 'Parent'}</strong>
                {appt.child && <div className="text-[0.85rem]">Child: {appt.child.name}</div>}
                {appt.reason && <div className="text-[0.85rem] italic">"{appt.reason}"</div>}
              </div>
              <span className="status-approved">confirmed</span>
            </div>
          ))
        )}
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-5">
        <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          <span>Upcoming Appointments</span>
        </div>
        {upcomingAppts.length === 0 ? (
          <p className="text-[#64748B] text-center py-5">No upcoming appointments</p>
        ) : (
          upcomingAppts.map(appt => (
            <div key={appt.id} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-xl mb-2 text-sm flex justify-between items-center">
              <div>
                <strong>
                  {new Date(appt.appointmentDate).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {' '} at {appt.appointmentTime}
                </strong>
                <div className="text-[0.85rem]">
                  {appt.parent?.fullName || 'Parent'}{appt.child ? ` (${appt.child.name})` : ''}
                </div>
              </div>
              <span className="status-approved">confirmed</span>
            </div>
          ))
        )}
      </div>

      {/* Weekly availability */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-5">
        <div className="bg-gradient-to-r from-[#8BA888] to-[#6D8A6A] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-base flex items-center gap-2">
          <CalendarCheck className="w-5 h-5" />
          <span>My Availability</span>
        </div>
        {availability.length === 0 ? (
          <p className="text-[#64748B] text-center py-5">
            Availability is set during registration
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-2.5">
            {DAYS.map(day => {
              const slots = byDay[day.toLowerCase()] || [];
              return (
                <div key={day}
                  className={`p-3 rounded-[10px] ${slots.length > 0 ? 'bg-[#F0F9F5] border-2 border-[#8BA888]' : 'bg-[#f5f5f5] border-2 border-[#e0e0e0]'}`}>
                  <div className={`font-semibold text-[0.85rem] mb-1.5 ${slots.length > 0 ? 'text-[#8BA888]' : 'text-[#b2bec3]'}`}>
                    {day}
                  </div>
                  {slots.length > 0 ? (
                    slots.map(s => <div key={s} className="text-[0.8rem] text-[#2C3E50] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8BA888]" />
                      <span>{s}</span>
                    </div>)
                  ) : (
                    <div className="text-[0.8rem] text-[#b2bec3]">Not Available</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm mb-4">
        <h3 className="text-[#2C3E50] font-bold mb-3 flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#8BA888]" />
          <span>Contact Information</span>
        </h3>
        {user?.phone && (
          <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#8BA888]" />
            <span><strong>Phone:</strong> {user.phone}</span>
          </div>
        )}
        {user?.email && (
          <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8BA888]" />
            <span><strong>Email:</strong> {user.email}</span>
          </div>
        )}
        {user?.advisorProfile?.specialty && (
          <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#8BA888]" />
            <span><strong>Specialization:</strong> {user.advisorProfile.specialty}</span>
          </div>
        )}
        {user?.advisorProfile?.experienceYears && (
          <div className="bg-[#F8FAFC] border-l-4 border-[#8BA888] px-3 py-2 rounded-r-xl mb-2 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#8BA888]" />
            <span><strong>Experience:</strong> {user.advisorProfile.experienceYears} years</span>
          </div>
        )}
        {!user?.phone && !user?.email && (
          <p className="text-[#64748B] text-[0.9rem]">No contact info available</p>
        )}
      </div>
    </div>
  );
}
