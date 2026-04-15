'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { playSound } from '@/lib/sound/sfx';

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  playHover: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playNav: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);

  const playHover = useCallback(() => !isMuted && playSound('hover'), [isMuted]);
  const playClick = useCallback(() => !isMuted && playSound('click'), [isMuted]);
  const playSuccess = useCallback(() => !isMuted && playSound('success'), [isMuted]);
  const playNav = useCallback(() => !isMuted && playSound('nav'), [isMuted]);

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        volume,
        setVolume,
        toggleMute,
        playHover,
        playClick,
        playSuccess,
        playNav,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}

