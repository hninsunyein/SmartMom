'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchChildren } from '../../redux/slices/childrenSlice';
import { fetchAppointments } from '../../redux/slices/appointmentsSlice';
import DashboardLayout from './DashboardLayout';
import OverviewTab from './tabs/OverviewTab';
import ChildrenTab from './tabs/ChildrenTab';
import NutritionTab from './tabs/NutritionTab';
import GrowthTab from './tabs/GrowthTab';
import AppointmentsTab from './tabs/AppointmentsTab';
import AdvisorsTab from './tabs/AdvisorsTab';
import TipsTab from './tabs/TipsTab';
import AdminTab from './tabs/AdminTab';
import AdvisorClientsTab from './tabs/AdvisorClientsTab';
import AdvisorScheduleTab from './tabs/AdvisorScheduleTab';

const PREMIUM_TABS = new Set(['appointments', 'advisors']);

function UpgradeModal({ feature, onClose, onUpgrade }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden border border-[#E2E8F0]">
        <div className="bg-gradient-to-r from-[#FF9B8F] to-[#E87B6F] px-6 py-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Premium Feature</h2>
          <p className="text-white/90 text-sm mt-1">{feature} is available on the Premium plan</p>
        </div>
        <div className="p-6">
          <p className="text-[#64748B] text-sm mb-5 text-center">
            Upgrade to <strong className="text-[#2C3E50]">Premium (5,000 MMK)</strong> to unlock:
          </p>
          <ul className="space-y-2.5 mb-6">
            {[
              'Book appointments with advisors',
              'Browse and connect with advisors',
              'Multiple children profiles (unlimited)',
              'BMI-based personalized meal plans',
              'Save advisor notes and history',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-[#2C3E50]">
                <span className="w-5 h-5 rounded-full bg-[#8BA888] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-[#E2E8F0] text-[#64748B] font-semibold rounded-lg hover:border-[#FF9B8F] hover:text-[#FF9B8F] transition-colors text-sm"
            >
              Maybe Later
            </button>
            <button
              onClick={onUpgrade}
              className="flex-1 bg-[#FF9B8F] text-white font-semibold py-2.5 rounded-lg hover:bg-[#E87B6F] transition-all text-sm"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const getDefaultTab = (userType) => {
    if (userType === 'advisor') return 'overview';
    if (userType === 'admin') return 'advisors';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [upgradeModal, setUpgradeModal] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.userType === 'parent') { dispatch(fetchChildren()); dispatch(fetchAppointments()); }
    if (user?.userType === 'advisor') { dispatch(fetchAppointments()); }
    if (user) setActiveTab(getDefaultTab(user.userType));
  }, [isAuthenticated, user]);

  const isFree = user?.userType === 'parent' && user?.planType !== 'premium';

  const handleTabChange = (tab) => {
    if (isFree && user?.userType === 'parent' && PREMIUM_TABS.has(tab)) {
      const labels = { appointments: 'Book Appointments', advisors: 'Find Advisors' };
      setUpgradeModal(labels[tab] || tab);
      return;
    }
    setActiveTab(tab);
  };

  const renderTab = () => {
    if (user?.userType === 'admin') {
      switch (activeTab) {
        case 'tips': return <AdminTab initialSection="safety" />;
        case 'advisors':
        default: return <AdminTab initialSection="advisors" />;
      }
    }

    if (user?.userType === 'advisor') {
      switch (activeTab) {
        case 'requests': return <AppointmentsTab />;
        case 'clients': return <AdvisorClientsTab />;
        case 'schedule': return <AdvisorScheduleTab />;
        default: return <OverviewTab onNavigate={handleTabChange} />;
      }
    }

    // Parent
    switch (activeTab) {
      case 'children': return <ChildrenTab />;
      case 'nutrition': return <NutritionTab />;
      case 'growth': return <GrowthTab />;
      case 'appointments': return <AppointmentsTab />;
      case 'advisors': return <AdvisorsTab />;
      case 'tips': return <TipsTab />;
      default: return <OverviewTab onNavigate={handleTabChange} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderTab()}
      {upgradeModal && (
        <UpgradeModal
          feature={upgradeModal}
          onClose={() => setUpgradeModal(null)}
          onUpgrade={() => router.push('/upgrade')}
        />
      )}
    </DashboardLayout>
  );
}
