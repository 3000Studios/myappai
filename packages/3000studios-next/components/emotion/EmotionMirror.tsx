'use client';

import { useEffect, useRef, useState } from 'react';

type EmotionType = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral';

const EMOTION_MAP: Record<EmotionType, string> = {
  happy: 'cheer',
  sad: 'silent',
  angry: 'boo',
  surprised: 'ovation',
  neutral: 'idle',
};

export default function EmotionMirror() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let frameId: number;
    let stream: MediaStream | null = null;

    async function init() {
      try {
        // Check if we can access the camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsEnabled(true);
        }

        // Simple emotion detection based on video presence
        // TensorFlow/blazeface integration would go here if the package is installed
        const loop = () => {
          if (!videoRef.current) return;

          // Simple placeholder for emotion detection
          // In a full implementation, this would use @tensorflow-models/blazeface
          const emotionGuess: EmotionType = 'neutral';

          // Broadcast to entire system
          window.postMessage(`emotion:${emotionGuess}`, '*');
          window.postMessage(`crowd:${EMOTION_MAP[emotionGuess]}`, '*');

          frameId = requestAnimationFrame(loop);
        };

        // Start the loop after a short delay
        setTimeout(() => {
          frameId = requestAnimationFrame(loop);
        }, 1000);
      } catch (error: unknown) {
        console.warn("", error);
        setIsEnabled(false);
      }
    }

    init();

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className="absolute w-px h-px opacity-0 pointer-events-none"
      playsInline
      muted
    />
  );
}

