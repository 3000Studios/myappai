'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VendorsPage() {
  const router = useRouter();

  useEffect(() => {
    // Vendors info is now on the Info page - redirect there
    router.replace('/info#vendors');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to Info...</p>
      </div>
    </div>
  );
}

