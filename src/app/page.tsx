'use client';

import dynamic from 'next/dynamic';

const AppContent = dynamic(() => import('@/App').then((mod) => mod.AppContent), {
  ssr: false,
});

export default function HomePage() {
  return <AppContent />;
}
