'use client';

import { useEffect } from 'react';

/**
 * Manual AdSense ad unit. Use only if you have a specific data-ad-slot.
 * If you don't have a slot, rely on Auto Ads via the script injected in layout.tsx
 */
export function AdSenseUnit({ slot, style }: { slot: string; style?: React.CSSProperties }) {
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

    // Do not push in dev if we're showing the placeholder, or if no publisher ID
    if (!publisherId || isDev) return;

    try {
      // @ts-expect-error AdSense global may not be available
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore
    }
  }, []);

  // Only render if AdSense ID is configured
  if (typeof window === 'undefined') return null;

  const raw = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const isDev = process.env.NODE_ENV === 'development';

  if (!raw) {
    if (isDev) {
      return (
        <div
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px dashed rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            minHeight: '100px',
            width: '100%',
          }}
        >
          AdSense Unit (No ID configured)
          <br />
          Slot: {slot}
        </div>
      );
    }
    return null;
  }

  const client = raw.startsWith('ca-pub-') ? raw : `ca-pub-${raw}`;

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

