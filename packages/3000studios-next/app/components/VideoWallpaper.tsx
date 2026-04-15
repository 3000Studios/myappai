/**
 * Video Wallpaper Component
 * Live video background for pages as specified in the blueprint
 * Supports: local videos, animated gradients, and future live stream integration
 */

'use client';

import { useState } from 'react';

interface VideoWallpaperProps {
  videoSrc?: string;
  fallbackGradient?: boolean;
  opacity?: number;
}

export default function VideoWallpaper({
  videoSrc,
  fallbackGradient = false,
  opacity = 0.3,
}: VideoWallpaperProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Background */}
      {fallbackGradient && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"
          style={{ opacity: videoLoaded ? 0 : 1 }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sapphire/20 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-platinum/10 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
      )}

      {/* Video Background - when provided */}
      {videoSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoLoaded ? opacity : 0 }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay to ensure readability */}
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
}

