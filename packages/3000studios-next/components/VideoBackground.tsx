'use client';

// Phase 64: Video Background Fix (All Pages)
// Global component that plays once, pauses on blur, resumes on focus.

import { useEffect, useRef } from 'react';

type VideoBackgroundProps = {
  src?: string;
  opacity?: number;
};

export default function VideoBackground({
  src = '/default-bg.mp4',
  opacity = 0.3,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className="fixed inset-0 -z-10 object-cover w-full h-full pointer-events-none"
      style={{ opacity: opacity }}
      src={src}
    />
  );
}

