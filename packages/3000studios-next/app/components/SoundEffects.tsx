'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Interactive Sound Effects System
 * Plays sophisticated click sounds and ambient audio
 * Includes "Enable Sound" overlay for browser autoplay policies
 */
export default function SoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window === 'undefined') return;

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContext();
    audioContextRef.current.resume();

    setEnabled(true);
    setShowOverlay(false);
    localStorage.setItem('sound-enabled', 'true');
  }, []);

  const disableSound = () => {
    setEnabled(false);
    setShowOverlay(false);
    localStorage.setItem('sound-enabled', 'false');
  };

  const enableSound = () => {
    setEnabled(true);
    setShowOverlay(false);
    localStorage.setItem('sound-enabled', 'true');
  };

  useEffect(() => {
    if (!enabled) return;

    // Initialize Web Audio API if not already
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }

    // Function to create a sophisticated click sound
    const playClickSound = () => {
      if (!audioContextRef.current || audioContextRef.current.state === 'suspended') return;

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Sophisticated tone - higher frequency for elegant sound
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      // Envelope for natural sound
      const now = context.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      oscillator.start(now);
      oscillator.stop(now + 0.1);
    };

    // Function to create a hover sound
    const playHoverSound = () => {
      if (!audioContextRef.current || audioContextRef.current.state === 'suspended') return;

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = 600;
      oscillator.type = 'sine';

      const now = context.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      oscillator.start(now);
      oscillator.stop(now + 0.08);
    };

    // Add click sound to all interactive elements
    const addSoundToElements = () => {
      const buttons = document.querySelectorAll('button, a, [role="button"]');

      buttons.forEach((element) => {
        element.addEventListener('click', playClickSound);
        element.addEventListener('mouseenter', playHoverSound);
      });
    };

    // Initial setup
    addSoundToElements();

    // Observer to add sounds to dynamically added elements
    const observer = new MutationObserver(() => {
      addSoundToElements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  if (!showOverlay) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 border border-yellow-500/30 p-4 rounded-lg shadow-lg backdrop-blur-md flex flex-col gap-2 max-w-xs animate-in fade-in slide-in-from-bottom-4">
      <p className="text-sm text-white font-medium">Enable immersive audio effects?</p>
      <div className="flex gap-2">
        <button
          onClick={enableSound}
          className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-500 border border-yellow-500/50 rounded px-3 py-1 text-xs transition-colors font-bold"
        >
          Enable
        </button>
        <button
          onClick={disableSound}
          className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10 rounded px-3 py-1 text-xs transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

