'use client';

import Script from 'next/script';

export default function AdSlot({ slot = 'default' }: { slot?: string }) {
  return (
    <div className="my-8 border border-yellow-500/20 rounded-lg p-4 bg-black/20">
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXX"
        data-ad-slot={slot}
      />
      <div className="text-xs text-gray-600 text-center mt-2">Advertisement</div>
    </div>
  );
}

