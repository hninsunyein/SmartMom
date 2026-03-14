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

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user?.userType === 'parent') { dispatch(fetchChildren()); dispatch(fetchAppointments()); }
    if (user?.userType === 'advisor') { dispatch(fetchAppointments()); }
    if (user) setActiveTab(getDefaultTab(user.userType));
  }, [isAuthenticated, user]);

  const handleTabChange = (tab) => setActiveTab(tab);

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
    </DashboardLayout>
  );
}
