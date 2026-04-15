'use client';

import { useEffect, useRef, useState } from 'react';

const MUSIC_TRACKS = [
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038696/electricity-315581_ngtb0j.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038695/mrketid-127881_vz7wop.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038695/upbeat-future-bass-138706_nrfkt5.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038695/house-114914_mie0io.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038694/lounge-house-music-348882_fbmwtq.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038694/sweet-life-luxury-chill-438146_jclnty.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038693/i-got-your-mind-342855_iq27b2.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038693/funky-house-221081_rxgd2b.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038693/high-novelty-tech-solution-191634_he6uhx.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038692/digital-abstract-technology-lift-me-up-131534_tktfna.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1767038692/black-box-mana-of-artificial-intelligence-130408_mapnzt.mp3',
  'https://res.cloudinary.com/dj92eb97f/video/upload/v1766973391/sweet-life-luxury-chill-438146_mwxuot.mp3',
];

export default function BackgroundMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    // Select random track on mount
    const randomTrack = MUSIC_TRACKS[Math.floor(Math.random() * MUSIC_TRACKS.length)];
    setCurrentTrack(randomTrack);
  }, []);

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;

    audioRef.current.src = currentTrack;
    audioRef.current.volume = 0.3; // Set volume to 30%

    // Try to autoplay immediately
    const tryPlay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
        setHasInteracted(true);
        setShowIndicator(false);
      } catch {
        // Autoplay blocked - wait for user interaction
        console.log('Autoplay blocked, waiting for user interaction');
      }
    };

    tryPlay();
  }, [currentTrack]);

  useEffect(() => {
    if (hasInteracted) return;

    // Handle any user interaction to start music
    const startMusic = async () => {
      if (audioRef.current && !isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
          setShowIndicator(false);
        } catch (err: unknown) {
          console.log("", err);
        }
      }
    };

    // Listen for many types of interactions
    const events = ['click', 'keydown', 'touchstart', 'scroll', 'mousemove'];
    events.forEach((event) => {
      document.addEventListener(event, startMusic, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, startMusic);
      });
    };
  }, [hasInteracted, isPlaying]);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" />

      {/* Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-4 right-4 z-50 p-3 bg-black/80 border border-[#D4AF37]/50 rounded-full hover:bg-[#D4AF37]/20 transition-all group"
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}

        {/* Pulse animation when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border-2 border-[#D4AF37] animate-ping opacity-30" />
        )}
      </button>

      {/* Click to enable music indicator */}
      {showIndicator && !hasInteracted && (
        <div className="fixed bottom-16 right-4 z-50 px-3 py-2 bg-black/90 border border-[#D4AF37]/30 rounded-lg text-xs text-[#D4AF37] animate-pulse">
          🎵 Click anywhere to enable music
        </div>
      )}
    </>
  );
}

