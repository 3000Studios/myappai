/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

'use client';

import { useEffect, useState } from 'react';

export default function useVoiceAvatar() {
  const [state, setState] = useState({
    talking: false,
    volume: 0,
    mood: 'idle',
  });

  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('Voice Avatar: getUserMedia not supported');
      return;
    }

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;
    let animationFrame: number;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        microphone.connect(analyser);

        // --- PATCHED SECTION ---
        const buffer = new ArrayBuffer(analyser.frequencyBinCount);
        const dataArray = new Uint8Array(buffer);

        const detectSpeech = () => {
          analyser.getByteFrequencyData(dataArray as Uint8Array);

          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          // You can setState here if needed, e.g.:
          // setState({ talking: average > 20, volume: average, mood: average > 40 ? 'angry' : average > 25 ? 'talking' : 'idle' });

          if (average > 20) {
            setState((prev) => ({ ...prev, talking: true, volume: average, mood: 'talking' }));
          } else {
            setState((prev) => ({ ...prev, talking: false, volume: average, mood: 'idle' }));
          }

          animationFrame = requestAnimationFrame(detectSpeech);
        };

        detectSpeech();
      })
      .catch((error) => {
        console.error("", error);
      });

    // Cleanup
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  return state;
}

