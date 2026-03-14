'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '../../redux/slices/authSlice';

const parentNavItems = [
  { id: 'overview',      label: 'Overview',          icon: '🏠' },
  { id: 'children',      label: 'My Children',        icon: '👶' },
  { id: 'nutrition',     label: 'Nutrition',          icon: '🍎' },
  { id: 'growth',        label: 'Growth Tracking',   icon: '📈' },
  { id: 'appointments',  label: 'Appointments',       icon: '📅' },
  { id: 'advisors',      label: 'Find Advisors',     icon: '👨‍⚕️' },
  { id: 'tips',          label: 'Tips & Info',        icon: '📚' },
];

const advisorNavItems = [
  { id: 'overview',   label: 'Dashboard',             icon: '🏠' },
  { id: 'requests',   label: 'Appointment Requests',  icon: '📩' },
  { id: 'clients',    label: 'My Clients',            icon: '👨‍👩‍👧' },
  { id: 'schedule',   label: 'My Schedule',           icon: '📅' },
];

const adminNavItems = [
  { id: 'advisors', label: 'Advisor Approval', icon: '🛡️' },
  { id: 'tips',     label: 'Manage Tips',      icon: '📝' },
];

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => { dispatch(logout()); router.push('/'); };

  const navItems =
    user?.userType === 'advisor' ? advisorNavItems :
    user?.userType === 'admin'   ? adminNavItems   :
    parentNavItems;

  const tabLabel = navItems.find(n => n.id === activeTab)?.label || activeTab;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <aside className={`
        flex flex-col bg-gradient-to-b from-[#667eea] to-[#764ba2] text-white
        shadow-xl transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? 'w-60' : 'w-16'}
      `}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/20 flex-shrink-0">
          <span className="text-2xl">🤱</span>
          {sidebarOpen && (
            <span className="ml-2.5 font-bold text-base whitespace-nowrap">Smart Mom</span>
          )}
        </div>

        {/* User info */}
        {sidebarOpen && user && (
          <div className="px-4 py-3 border-b border-white/20 bg-white/10">
            <p className="text-white/70 text-xs mb-0.5">Logged in as</p>
            <p className="text-white font-semibold text-sm truncate">{user.fullName}</p>
            <span className="inline-block bg-white/25 text-white text-xs px-2.5 py-0.5 rounded-full mt-1 capitalize">
              {user.userType}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              title={!sidebarOpen ? label : ''}
              className={`
                w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-150
                ${activeTab === id
                  ? 'bg-white/25 text-white border-r-4 border-white font-bold'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'}
              `}
            >
              <span className="text-lg flex-shrink-0">{icon}</span>
              {sidebarOpen && <span className="ml-3 whitespace-nowrap">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/20">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center px-3 py-2 rounded-xl text-white/85 text-sm font-medium
              bg-white/10 hover:bg-red-400/30 border border-white/20 transition-colors
            `}
          >
            <span className="text-base">🚪</span>
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-white flex items-center px-5 gap-4 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#667eea] hover:text-[#764ba2] transition-colors p-1.5 rounded-lg hover:bg-[#667eea]/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-[#667eea] font-semibold">Smart Mom</span>
            <span>›</span>
            <span className="text-gray-800 font-semibold capitalize">{tabLabel}</span>
          </div>

          {user && (
            <div className="ml-auto text-sm text-gray-500">
              Welcome, <span className="text-[#764ba2] font-bold">{user.fullName?.split(' ')[0]}</span>!
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
