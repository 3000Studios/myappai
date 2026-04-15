/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { create } from 'zustand';
import { useNeuralCore } from '@/brain/neuralCore';

interface VocalizerState {
  speak: (text: string) => Promise<void>;
  audioCtx: AudioContext | null;
}

export const useVocalizer = create<VocalizerState>((set, get) => ({
  audioCtx: null,

  speak: async (text: string) => {
    const neural = useNeuralCore.getState();
    const mood = neural.predict('vocalizer');

    let audioCtx = get().audioCtx;
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      set({ audioCtx });
    }

    const resp = await fetch('/api/shadow/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mood }),
    });

    const arrayBuf = await resp.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuf);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;

    const gain = audioCtx.createGain();
    const intensity = (neural as any).state?.intensity ?? 0.8;
    gain.gain.value = Math.max(0.2, Math.min(1.0, intensity));

    source.playbackRate.value =
      mood === 'angry' ? 0.85 : mood === 'excited' ? 1.25 : mood === 'whisper' ? 0.6 : 1.0;

    source.connect(gain).connect(audioCtx.destination);
    source.start(0);
  },
}));

