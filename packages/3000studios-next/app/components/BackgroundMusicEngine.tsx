'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundMusic({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.15;
    audioRef.current.play().catch(() => {});
  }, []);

  return <audio ref={audioRef} src={src} loop />;
}

