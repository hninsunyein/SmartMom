'use client';

import dynamic from 'next/dynamic';

const ParentLogin = dynamic(() => import('../../components/auth/ParentLogin'), { ssr: false });

export default function LoginPage() {
  return <ParentLogin />;
}
