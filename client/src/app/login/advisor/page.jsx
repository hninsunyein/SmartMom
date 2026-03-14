'use client';

import dynamic from 'next/dynamic';

const AdvisorLogin = dynamic(() => import('../../../components/auth/AdvisorLogin'), { ssr: false });

export default function AdvisorLoginPage() {
  return <AdvisorLogin />;
}
