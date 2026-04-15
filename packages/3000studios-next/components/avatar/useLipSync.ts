'use client';

import { RefObject, useEffect } from 'react';
import { Group } from 'three';

export default function useLipSync(ref: RefObject<Group>) {
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.mediaDevices) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        const src = ctx.createMediaStreamSource(stream);
        src.connect(analyser);

        analyser.fftSize = 256;
        const data = new Uint8Array(analyser.frequencyBinCount);

        const loop = () => {
          analyser.getByteFrequencyData(data);
          const volume = data.reduce((a, b) => a + b) / data.length;

          if (ref.current) {
            ref.current.rotation.x = volume / 800;
          }

          requestAnimationFrame(loop);
        };

        loop();
      })
      .catch((err) => {
        console.log("", err);
      });
  }, [ref]);
}

