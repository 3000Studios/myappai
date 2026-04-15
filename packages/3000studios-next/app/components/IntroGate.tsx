'use client';

import { useEffect, useState } from 'react';

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check if user has seen splash
    const seen = sessionStorage.getItem('splash-seen');
    if (seen) {
      setDone(true);
    }
  }, []);

  const handleDone = () => {
    sessionStorage.setItem('splash-seen', 'true');
    setDone(true);
  };

  if (!done) {
    return (
      <div className="fixed inset-0 z-9999 bg-black">
        <video
          autoPlay
          muted
          playsInline
          onEnded={handleDone}
          onClick={handleDone}
          className="w-full h-full object-cover cursor-pointer"
        >
          <source
            src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    );
  }

  return <>{children}</>;
}

