/**
 * Video Hero Component
 * Autoplay, muted, looping video background with WebM + MP4 fallback
 * REVENUE LOCK — DO NOT MODIFY
 * This component is critical for conversion optimization
 */

'use client';

import { useEffect, useRef } from 'react';

interface VideoHeroProps {
  webmSrc?: string;
  mp4Src: string;
  posterSrc?: string;
  opacity?: number;
  className?: string;
}

export default function VideoHero({
  webmSrc,
  mp4Src,
  posterSrc,
  opacity = 0.3,
  className = '',
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mount (some browsers need this)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - this is fine, video will be muted
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        <source src={mp4Src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
    </div>
  );
}

