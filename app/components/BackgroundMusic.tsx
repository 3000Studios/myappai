'use client';

export default function BackgroundMusic() {
  if (typeof window === 'undefined') return null;

  const playMusic = () => {
    const audio = new Audio('/audio/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch(() => {
      // Silent fail - user interaction required
    });
  };

  // Auto-play on user interaction
  if (typeof document !== 'undefined') {
    document.addEventListener('click', playMusic, { once: true });
  }

  return null;
}

