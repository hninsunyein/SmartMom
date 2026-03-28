'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';

function calcAge(dob) {
  if (!dob) return '';
  const years = Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} year${years !== 1 ? 's' : ''}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function renderNotes(text) {
  if (!text) return null;
  // Render **bold**, _italic_, and • bullets as styled spans
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const isBullet = line.startsWith('• ');
    const content = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.+?)_/g, '<em>$1</em>');
    return (
      <div key={i} className={isBullet ? 'flex gap-1.5 mb-0.5' : 'mb-0.5'}>
        {isBullet && <span className="text-[#667eea] font-bold shrink-0">•</span>}
        <span dangerouslySetInnerHTML={{ __html: isBullet ? content.replace(/^•\s/, '') : content }} />
      </div>
    );
  });
}

function ClientDetailsModal({ client, appointments, onClose }) {
  const clientAppts = appointments
    .filter(a => a.parent?.id === client.parent.id)
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const STATUS_COLORS = {
    confirmed:  'bg-green-100 text-green-700 border-green-200',
    pending:    'bg-yellow-100 text-yellow-700 border-yellow-200',
    rejected:   'bg-red-100 text-red-600 border-red-200',
    cancelled:  'bg-gray-100 text-gray-500 border-gray-200',
    completed:  'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-4 rounded-t-2xl flex justify-between items-start">
          <div>
            <div className="text-lg">👤 {client.parent.fullName}</div>
            <div className="text-white/75 text-sm font-normal mt-0.5">{client.parent.email}</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl leading-none mt-0.5">✕</button>
        </div>

        <div className="p-5">
          {/* Client info */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {client.parent.phone && (
              <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl text-sm col-span-2">
                <strong>Phone:</strong> {client.parent.phone}
              </div>
            )}
            <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl text-sm">
              <strong>Appointments:</strong> {clientAppts.length}
            </div>
            {client.lastAppointment && (
              <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl text-sm">
                <strong>Last Visit:</strong> {new Date(client.lastAppointment).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Children */}
          {client.children.length > 0 && (
            <div className="mb-5">
              <div className="text-xs font-semibold text-[#636e72] uppercase mb-2">Children</div>
              <div className="flex flex-wrap gap-2">
                {client.children.map(child => (
                  <span key={child.id} className="bg-purple-50 border border-purple-200 text-purple-700 rounded-full px-3 py-1 text-xs">
                    {child.gender === 'female' ? '👧' : '👦'} {child.name} ({calcAge(child.dateOfBirth)})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Appointments with notes */}
          <div className="text-xs font-semibold text-[#636e72] uppercase mb-2">Appointment History</div>
          {clientAppts.length === 0 ? (
            <p className="text-[#b2bec3] text-sm text-center py-4">No appointments found.</p>
          ) : (
            clientAppts.map(appt => (
              <div key={appt.id} className="border border-gray-200 rounded-xl mb-3 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2.5 bg-gray-50">
                  <div className="text-sm font-medium text-[#2d3436]">
                    📅 {formatDate(appt.appointmentDate)} ⏰ {appt.appointmentTime}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[appt.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {appt.status}
                  </span>
                </div>
                {appt.child && (
                  <div className="px-4 py-1.5 text-xs text-[#636e72] border-t border-gray-100">
                    👶 {appt.child.name}
                    {appt.reason && <span className="ml-2 italic">· "{appt.reason}"</span>}
                  </div>
                )}
                {appt.notes ? (
                  <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                    <div className="text-xs font-semibold text-amber-700 mb-1.5">📝 Doctor Notes</div>
                    <div className="text-sm text-[#2d3436] leading-relaxed">
                      {renderNotes(appt.notes)}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 border-t border-gray-100 text-xs text-[#b2bec3] italic">
                    No notes added yet.
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdvisorClientsTab() {
  const { list: appointments } = useSelector((state) => state.appointments);
  const [detailsModal, setDetailsModal] = useState(null);

  // Derive unique clients from all appointments (not just confirmed)
  const clientMap = {};
  appointments.forEach(appt => {
    if (!appt.parent) return;
    if (!clientMap[appt.parent.id]) {
      clientMap[appt.parent.id] = {
        parent: appt.parent,
        children: [],
        appointmentCount: 0,
        lastAppointment: null,
      };
    }
    const entry = clientMap[appt.parent.id];
    entry.appointmentCount += 1;
    if (appt.child && !entry.children.find(c => c.id === appt.child.id)) {
      entry.children.push(appt.child);
    }
    if (!entry.lastAppointment || new Date(appt.appointmentDate) > new Date(entry.lastAppointment)) {
      entry.lastAppointment = appt.appointmentDate;
    }
  });

  const clients = Object.values(clientMap);

  return (
    <div>
      <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-bold px-5 py-3 rounded-xl mb-5 shadow text-[1.3rem]">My Clients</div>

      {clients.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-4 text-center py-10">
          <div className="text-[3rem] mb-4">👨‍👩‍👧</div>
          <p className="text-[#636e72]">No clients yet. Clients appear here once you have appointments.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clients.map(({ parent, children, appointmentCount, lastAppointment }) => (
          <div key={parent.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            {/* Card header */}
            <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-3 text-white">
              <div className="font-bold text-base">👤 {parent.fullName}</div>
              <div className="text-white/75 text-xs mt-0.5">{parent.email}</div>
            </div>
            {/* Card body */}
            <div className="p-4 flex-1">
              {parent.phone && (
                <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                  <strong>Phone:</strong> {parent.phone}
                </div>
              )}
              <div className="bg-gray-50 border-l-4 border-[#667eea] px-3 py-2 rounded-r-xl mb-2 text-sm">
                <strong>Appointments:</strong> {appointmentCount}
              </div>
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
            {/* Card footer */}
            <div className="px-4 pb-4">
              <button
                onClick={() => setDetailsModal({ parent, children, appointmentCount, lastAppointment })}
                className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailsModal && (
        <ClientDetailsModal
          client={detailsModal}
          appointments={appointments}
          onClose={() => setDetailsModal(null)}
        />
      )}
    </div>
  );
}
