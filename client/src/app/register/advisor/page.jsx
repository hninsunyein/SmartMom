'use client';

import dynamic from 'next/dynamic';

const AdvisorRegister = dynamic(() => import('../../../components/auth/AdvisorRegister'), { ssr: false });

export default function AdvisorRegisterPage() {
  return <AdvisorRegister />;
}
