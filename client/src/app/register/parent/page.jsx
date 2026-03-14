'use client';

import dynamic from 'next/dynamic';

const ParentRegister = dynamic(() => import('../../../components/auth/ParentRegister'), { ssr: false });

export default function ParentRegisterPage() {
  return <ParentRegister />;
}
