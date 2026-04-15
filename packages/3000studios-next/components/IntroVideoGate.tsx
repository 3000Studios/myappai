'use client';

import { useEffect, useState } from 'react';

export default function IntroVideoGate({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user has already dismissed the intro (persistent)
    const hasSeenIntro = localStorage.getItem('intro-dismissed');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleDismiss = () => {
    setShowIntro(false);
    localStorage.setItem('intro-dismissed', 'true');
  };

  if (!isClient) return null;

  if (showIntro) {
    return (
      <div
        onClick={handleDismiss}
        className="fixed inset-0 z-99999 bg-black cursor-pointer flex items-center justify-center"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleDismiss()}
        aria-label="Click to enter site"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767018521/Click_me_video_b34knz.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute bottom-20 text-center">
          <p className="text-white text-2xl font-playfair animate-pulse drop-shadow-lg">
            Click anywhere to enter
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

