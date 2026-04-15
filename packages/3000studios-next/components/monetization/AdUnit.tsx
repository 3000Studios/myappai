'use client';

import { useEffect } from 'react';

export default function AdUnit({
  slotId,
  format = 'auto',
  label = 'Advertisement',
  className = '',
}: {
  slotId: string;
  format?: string;
  label?: string;
  className?: string;
}) {
  useEffect(() => {
    // Return early if not in production or if AdSense script isn't loaded
    if (process.env.NODE_ENV === 'development') return;

    try {
      // Extend window interface for AdSense
      interface WindowWithAdSense extends Window {
        adsbygoogle?: unknown[];
      }
      const win = window as WindowWithAdSense;

      // Attempt to push only if adsbygoogle exists and is an array
      if (typeof window !== 'undefined' && win.adsbygoogle) {
        win.adsbygoogle.push({});
      }
    } catch (err: unknown) {
      console.error("", err);
    }
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="w-full p-4 my-8 border border-dashed border-gray-700 bg-gray-900/50 text-center">
        <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">{label}</p>
        <div className="h-24 flex items-center justify-center text-gray-600">
          [AdSense Slot: {slotId}]
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full my-8 overflow-hidden ${className}`}>
      <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest py-1">
        {label}
      </div>
      <ins
        className="adsbygoogle block"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

