'use client';

import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('../components/auth/LandingPage'), { ssr: false });

export default function Home() {
  return <LandingPage />;
}
