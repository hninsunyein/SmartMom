'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function calcAge(dob) {
  if (!dob) return '';
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} year${years !== 1 ? 's' : ''}`;
}

export default function AdvisorClientsTab() {
  const { list: appointments } = useSelector((state) => state.appointments);

  // Derive unique clients from confirmed appointments
  const clientMap = {};
  appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .forEach(appt => {
      if (appt.parent && !clientMap[appt.parent.id]) {
        clientMap[appt.parent.id] = {
          parent: appt.parent,
          children: [],
          appointmentCount: 0,
          lastAppointment: null,
        };
      }
      if (appt.parent) {
        clientMap[appt.parent.id].appointmentCount += 1;
        if (appt.child && !clientMap[appt.parent.id].children.find(c => c.id === appt.child.id)) {
          clientMap[appt.parent.id].children.push(appt.child);
        }
        if (!clientMap[appt.parent.id].lastAppointment || new Date(appt.appointmentDate) > new Date(clientMap[appt.parent.id].lastAppointment)) {
          clientMap[appt.parent.id].lastAppointment = appt.appointmentDate;
        }
      }
    });

  const clients = Object.values(clientMap);

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">My Clients</div>

      {clients.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 text-center py-10">
          <div className="text-[3rem] mb-4">👨‍👩‍👧</div>
          <p className="text-[#636e72]">No clients yet. Clients appear here once you confirm their appointments.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clients.map(({ parent, children, appointmentCount, lastAppointment }) => (
          <div key={parent.id} className="bg-gradient-to-br from-yellow-100 to-orange-100 border border-orange-200 rounded-2xl p-5 shadow-sm">
            <h3 className="m-0 mb-2 text-base">
              👤 {parent.fullName}
            </h3>
            <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Email:</strong> {parent.email}</div>
            {parent.phone && <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Phone:</strong> {parent.phone}</div>}
            <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm"><strong>Appointments:</strong> {appointmentCount}</div>
            {lastAppointment && (
              <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                <strong>Last Visit:</strong> {new Date(lastAppointment).toLocaleDateString()}
              </div>
            )}
            {children.length > 0 && (
              <div className="mt-2.5">
                <div className="text-[0.8rem] font-semibold text-[#636e72] mb-1.5">CHILDREN</div>
                {children.map(child => (
                  <div key={child.id} className="text-[0.85rem] text-[#2d3436] mb-1">
                    {child.gender === 'female' ? '👧' : '👦'} {child.name} ({calcAge(child.dateOfBirth)})
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
