'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BackgroundEngine() {
  const pathname = usePathname();
  const [videoSrc, setVideoSrc] = useState('/assets/video/marble-flow.mp4');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade out
    const fadeOutTimeout = setTimeout(() => setOpacity(0), 0);

    const timeout = setTimeout(() => {
      // Determine video based on route
      if (pathname === '/') {
        setVideoSrc('/assets/video/marble-flow.mp4');
      } else if (pathname.startsWith('/store')) {
        // Ideally a different video for store, using same for now or a variant if available
        setVideoSrc('/assets/video/marble-flow.mp4');
      } else if (pathname.startsWith('/live')) {
        setVideoSrc('/assets/video/marble-flow.mp4');
      } else {
        setVideoSrc('/assets/video/marble-flow.mp4');
      }

      // Fade in
      setOpacity(0.4); // Keep it subtle so text is readable
    }, 500);

    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* Base Texture Layer */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `url('/assets/textures/marble-dark.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Video Layer */}
      <video
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        style={{ opacity }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay Gradient for Readability */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80 z-10" />

      {/* Particle/Dust Effect (CSS only for performance) */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
}

