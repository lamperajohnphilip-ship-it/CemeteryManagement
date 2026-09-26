'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/cemetery-overview');
  }, [router]);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#A09885',
      fontSize: '0.9rem',
      fontFamily: 'Jost, sans-serif'
    }}>
      <span>Redirecting to Cemetery Overview…</span>
    </div>
  );
}
