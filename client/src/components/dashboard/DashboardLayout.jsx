'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Home, Baby, Apple, TrendingUp, Calendar, Stethoscope,
  BookOpen, LayoutDashboard, Inbox, Users, Clock,
  Shield, FileText, LogOut, Star, Lock, Menu
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const PREMIUM_TABS = new Set(['appointments', 'advisors']);

const parentNavItems = [
  { id: 'overview',      label: 'Overview',          icon: Home },
  { id: 'children',      label: 'My Children',        icon: Baby },
  { id: 'nutrition',     label: 'Nutrition',          icon: Apple },
  { id: 'growth',        label: 'Growth Tracking',   icon: TrendingUp },
  { id: 'appointments',  label: 'Appointments',       icon: Calendar, premium: true },
  { id: 'advisors',      label: 'Find Advisors',     icon: Stethoscope, premium: true },
  { id: 'tips',          label: 'Tips & Info',        icon: BookOpen },
];

const advisorNavItems = [
  { id: 'overview',   label: 'Dashboard',             icon: LayoutDashboard },
  { id: 'requests',   label: 'Appointment Requests',  icon: Inbox },
  { id: 'clients',    label: 'My Clients',            icon: Users },
  { id: 'schedule',   label: 'My Schedule',           icon: Clock },
];

const adminNavItems = [
  { id: 'advisors', label: 'Advisor Approval', icon: Shield },
  { id: 'tips',     label: 'Manage Tips',      icon: FileText },
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
  const isParent = user?.userType === 'parent';
  const isFree = isParent && user?.planType !== 'premium';

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">

      {/* Sidebar */}
      <aside className={`
        flex flex-col bg-white border-r border-[#E2E8F0]
        shadow-sm transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8BA888] to-[#6D8A6A] rounded-lg flex items-center justify-center flex-shrink-0">
            <Baby className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="ml-3 font-bold text-base text-[#2C3E50] whitespace-nowrap">Smart Mom</span>
          )}
        </div>

        {/* User info + plan badge */}
        {sidebarOpen && user && (
          <div className="px-4 py-4 border-b border-[#E2E8F0] bg-[#F0F9F5]">
            <p className="text-[#64748B] text-xs mb-1 font-medium">Logged in as</p>
            <p className="text-[#2C3E50] font-semibold text-sm truncate">{user.fullName}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-block bg-[#8BA888]/20 text-[#8BA888] text-xs px-2.5 py-1 rounded-lg capitalize font-medium border border-[#8BA888]/30">
                {user.userType}
              </span>
              {user.userType === 'parent' && (
                <span className={`inline-block text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                  user.planType === 'premium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-[#F0F9F5] text-[#64748B] border-[#E2E8F0]'
                }`}>
                  {user.planType === 'premium' ? 'Premium' : 'Free Plan'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {navItems.map(({ id, label, icon: Icon, premium }) => {
            const isLocked = premium && isFree && user?.userType === 'parent';
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                title={!sidebarOpen ? (isLocked ? `${label} — Premium` : label) : (isLocked ? 'Premium feature — Upgrade to access' : '')}
                className={`
                  w-full flex items-center px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg mb-1
                  ${isActive
                    ? 'bg-[#8BA888] text-white shadow-sm'
                    : isLocked
                      ? 'text-[#94A3B8] hover:bg-[#F0F9F5] cursor-pointer'
                      : 'text-[#64748B] hover:bg-[#F0F9F5] hover:text-[#2C3E50]'}
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {sidebarOpen && (
                  <span className="ml-3 flex-1 flex items-center justify-between whitespace-nowrap">
                    {label}
                    {isLocked && (
                      <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-200 ml-2">
                        <Lock className="w-3 h-3" />
                        <span>Pro</span>
                      </span>
                    )}
                  </span>
                )}
                {!sidebarOpen && isLocked && (
                  <Lock className="absolute left-10 top-2 w-3 h-3 text-amber-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade button for free parents */}
        {isFree && sidebarOpen && (
          <div className="px-3 pb-3">
            <button
              onClick={() => router.push('/upgrade')}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-bold px-4 py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" fill="currentColor" />
              <span>Upgrade to Premium</span>
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-[#E2E8F0]">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center px-3 py-2.5 rounded-lg text-[#64748B] text-sm font-medium
              bg-white hover:bg-red-50 border border-[#E2E8F0] hover:border-red-200 hover:text-red-600 transition-all
            `}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="h-16 bg-white flex items-center px-6 gap-4 shadow-sm flex-shrink-0 border-b border-[#E2E8F0]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#64748B] hover:text-[#8BA888] transition-colors p-2 rounded-lg hover:bg-[#F0F9F5]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span className="text-[#8BA888] font-semibold">Smart Mom</span>
            <span>›</span>
            <span className="text-[#2C3E50] font-semibold capitalize">{tabLabel}</span>
          </div>

          {user && (
            <div className="ml-auto text-sm text-[#64748B]">
              Welcome, <span className="text-[#8BA888] font-bold">{user.fullName?.split(' ')[0]}</span>!
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA]">
          {children}
        </main>
      </div>
    </div>
  );
}
