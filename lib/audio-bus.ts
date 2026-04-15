/**
 * Sound & Music Master Bus
 * Centralized audio controller with global mute/volume
 */

'use client';

import { create } from 'zustand';

interface AudioState {
  isMuted: boolean;
  volume: number;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  toggleMute: () => void;
  setVolume: (vol: number) => void;
  toggleMusic: () => void;
  toggleSFX: () => void;
  playSound: (type: 'hover' | 'click' | 'success' | 'nav') => void;
}

export const useAudioBus = create<AudioState>((set, get) => ({
  isMuted: false,
  volume: 0.5,
  musicEnabled: true,
  sfxEnabled: true,

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setVolume: (vol) => set({ volume: Math.max(0, Math.min(1, vol)) }),

  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

  toggleSFX: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),

  playSound: (type) => {
    const state = get();
    if (state.isMuted || !state.sfxEnabled) return;

    if (typeof Audio !== 'undefined') {
      const audio = new Audio(`/audio/${type}.mp3`);
      audio.volume = state.volume;
      audio.play().catch(() => {});
    }
  },
}));

