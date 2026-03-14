'use client';

import dynamic from 'next/dynamic';

const ParentDashboard = dynamic(() => import('../../components/dashboard/ParentDashboard'), { ssr: false });

export default function DashboardPage() {
  return <ParentDashboard />;
}
