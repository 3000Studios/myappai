/**
 * Shadow PRIME OS - Global State Management
 * Central nervous system for the entire 3000Studios.com AI OS
 */

import { create } from 'zustand';

interface ShadowOSState {
  // Avatar state
  emotion: string;
  intensity: number;
  lastResponse: string;
  avatarAudio: string;

  // World engine state
  uiMood: string;
  systemEvent: Record<string, unknown> | null;

  // Analytics state
  liveVisitors: number;
  totalRevenue: number;
  aiCost: number;

  // Matrix state
  isAuthenticated: boolean;
  voiceActive: boolean;

  // Actions
  updateEmotion: (emotion: string, intensity: number) => void;
  setResponse: (text: string) => void;
  setAvatarAudio: (url: string) => void;
  setSystemEvent: (ev: Record<string, unknown>) => void;
  setUIMood: (mood: string) => void;
  setLiveVisitors: (count: number) => void;
  addRevenue: (amount: number) => void;
  addAICost: (cost: number) => void;
  setAuthenticated: (auth: boolean) => void;
  setVoiceActive: (active: boolean) => void;
}

export const useShadowOS = create<ShadowOSState>((set) => ({
  // Initial state
  emotion: 'neutral',
  intensity: 0.4,
  lastResponse: '',
  avatarAudio: '',
  uiMood: 'neutral',
  systemEvent: null,
  liveVisitors: 0,
  totalRevenue: 0,
  aiCost: 0,
  isAuthenticated: false,
  voiceActive: false,

  // Actions
  updateEmotion: (emotion, intensity) => set({ emotion, intensity }),

  setResponse: (text) => set({ lastResponse: text }),

  setAvatarAudio: (url) => set({ avatarAudio: url }),

  setSystemEvent: (ev) => set({ systemEvent: ev }),

  setUIMood: (mood) => set({ uiMood: mood }),

  setLiveVisitors: (count) => set({ liveVisitors: count }),

  addRevenue: (amount) => set((state) => ({ totalRevenue: state.totalRevenue + amount })),

  addAICost: (cost) => set((state) => ({ aiCost: state.aiCost + cost })),

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setVoiceActive: (active) => set({ voiceActive: active }),
}));

