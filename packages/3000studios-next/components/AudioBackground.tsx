'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AudioBackgroundProps {
  publicId: string;
  autoplay?: boolean;
  loop?: boolean;
}

export function AudioBackground({ publicId, autoplay = true, loop = true }: AudioBackgroundProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (autoplay && isMuted) {
      // Start playing muted (browser autoplay policy)
      audio.muted = true;
      audio.play().catch((err) => {
        console.log("", err);
      });
    }
  }, [autoplay, isMuted]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const audioUrl = `https://res.cloudinary.com/dj92eb97f/video/upload/f_auto:video:vp9/${publicId}.mp3`;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        autoPlay={autoplay}
        loop={loop}
        muted={isMuted}
        playsInline
      />

      {/* Mute Toggle Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-40 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-white/40"
        title={isMuted ? 'Unmute Background Music' : 'Mute Background Music'}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>
    </>
  );
}

