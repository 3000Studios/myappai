'use client';
import { useEffect, useState } from 'react';

export default function IntroVideo() {
  const [done, setDone] = useState(true);

  useEffect(() => {
    // Check session storage to see if intro has already played
    if (sessionStorage.getItem('introPlayed')) return;
    setDone(false);
  }, []);

  const finish = () => {
    sessionStorage.setItem('introPlayed', '1');
    setDone(true);
  };

  if (done) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-black" onClick={finish}>
      <video autoPlay muted playsInline onEnded={finish} className="w-full h-full object-cover">
        <source src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4" />
      </video>
    </div>
  );
}

