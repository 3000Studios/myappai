'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RevenuePage() {
  const router = useRouter();

  useEffect(() => {
    // Revenue page is now admin-only - redirect to admin
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to Admin...</p>
      </div>
    </div>
  );
}

