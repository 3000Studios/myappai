'use client';

interface BackgroundVideoProps {
  src: string;
  poster?: string;
  opacity?: number;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
  zoom?: boolean;
}

/**
 * Reusable background video component
 * - Autoplay, muted, looping
 * - Optional overlay
 * - Optional parallax zoom effect
 * - Responsive and optimized
 */
export default function BackgroundVideo({
  src,
  poster,
  opacity = 1,
  overlay = true,
  overlayColor = 'black',
  overlayOpacity = 0.5,
  className = '',
  zoom = false,
}: BackgroundVideoProps) {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className={`w-full h-full object-cover ${zoom ? 'group-hover:scale-105 transition-transform duration-700' : ''}`}
        style={{ opacity }}
      >
        <source src={src} type="video/mp4" />
      </video>
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}

