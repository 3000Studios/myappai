'use client';

import { useEffect, useRef, useState } from 'react';

export default function ShopifyRedirect() {
  const [progress, setProgress] = useState(0);
  const redirectedRef = useRef(false);

  useEffect(() => {
    // Fancy redirect after 2 seconds
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);
      /workspaces/;
      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else if (!redirectedRef.current) {
        redirectedRef.current = true;
        window.location.href = 'https://3000-studios.myshopify.com/';
      }
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://videos.pexels.com/video-files/3819871/3819871-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-black mb-4">Store</h1>
        <p className="text-xl text-platinum/80 mb-8">Redirecting you to our Shopify storefront</p>
        <div className="w-full max-w-md mx-auto h-3 rounded-full bg-white/10 overflow-hidden border border-amber-400/30">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

