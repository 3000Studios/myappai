'use client';

import { useEffect, useRef } from 'react';

// Production-safe, royalty-free tracks provided by the user
const AUDIO_TRACKS = [
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038691/background-jazz-golden-whisper-358520_wmtbyx.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038693/high-novelty-tech-solution-191634_he6uhx.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038692/digital-abstract-technology-lift-me-up-131534_tktfna.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038693/i-got-your-mind-342855_iq27b2.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038694/lounge-house-music-348882_fbmwtq.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038696/electricity-315581_ngtb0j.mp3',
];

export const AmbientAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const trackIndexRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial random track
    trackIndexRef.current = Math.floor(Math.random() * AUDIO_TRACKS.length);
    audio.src = AUDIO_TRACKS[trackIndexRef.current];
    audio.autoplay = true;
    audio.loop = true;
    audio.volume = 0.3;
    audio.muted = true; // start muted to satisfy autoplay policies

    const handleEnded = () => {
      // Switch to random track when current ends
      trackIndexRef.current = Math.floor(Math.random() * AUDIO_TRACKS.length);
      audio.src = AUDIO_TRACKS[trackIndexRef.current];
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);

    // Attempt autoplay (muted)
    audio.play().catch(() => {
      // Autoplay may be blocked; user interaction required
    });

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return <audio ref={audioRef} preload="auto" style={{ display: 'none' }} />;
};

