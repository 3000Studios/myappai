'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [showTransition, setShowTransition] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLandingClick = () => {
    if (!showTransition) {
      setShowTransition(true);
    }
  };

  useEffect(() => {
    if (showTransition && videoRef.current) {
      const transitionVideo = videoRef.current;
      transitionVideo.currentTime = 0;
      transitionVideo.play().catch(() => {});

      let didNavigate = false;
      const goHome = () => {
        if (didNavigate) return;
        didNavigate = true;
        router.push('/home');
      };

      const timeoutId = setTimeout(goHome, 4000);
      transitionVideo.addEventListener('ended', goHome);

      return () => {
        clearTimeout(timeoutId);
        transitionVideo.removeEventListener('ended', goHome);
      };
    }
  }, [showTransition, router]);

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden"
      onClick={handleLandingClick}
      role="presentation"
    >
      {/* Main Landing Video Background */}
      {!showTransition && (
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source
              src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767018521/Click_me_video_b34knz.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      )}

      {/* Transition Video - Full screen, plays on click */}
      {showTransition && (
        <div className="absolute inset-0 z-50">
          <video ref={videoRef} playsInline className="w-full h-full object-cover">
            <source
              src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986203/slow_tunnel_v0hpc8.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      )}
    </div>
  );
}

