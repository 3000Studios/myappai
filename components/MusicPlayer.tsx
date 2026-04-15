// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import { useRef, useState, useEffect } from 'react';

interface Song {
  title: string;
  artist: string;
  src: string;
}

const songs: Song[] = [
  {
    title: 'Symphony',
    artist: 'Clean Bandit ft. Zara Larsson',
    src: 'https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Clean-Bandit-Symphony.mp3',
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    src: 'https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Dua-Lipa-Levitating.mp3',
  },
  {
    title: 'Flowers',
    artist: 'Miley Cyrus',
    src: 'https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Miley-Cyrus-Flowers.mp3',
  },
  {
    title: 'Heat Waves',
    artist: 'Glass Animals',
    src: 'https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Glass-Animals-Heat-Waves.mp3',
  },
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    setCurrentIndex((currentIndex + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentIndex((currentIndex - 1 + songs.length) % songs.length);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      nextSong();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextSong]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = parseFloat(e.target.value);
      setCurrentTime(audio.currentTime);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl shadow-2xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">{songs[currentIndex].title}</h2>
        <p className="text-gray-400">{songs[currentIndex].artist}</p>
      </div>

      <audio ref={audioRef} src={songs[currentIndex].src} />

      {/* Progress Bar */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          title="Seek audio"
          placeholder="Seek audio"
        />
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6 justify-center items-center">
        <button
          onClick={prevSong}
          className="text-4xl hover:text-purple-400 transition-colors hover:scale-110 transform"
          title="Previous"
        >
          ⏮
        </button>
        <button
          onClick={playPause}
          className="text-5xl hover:text-purple-400 transition-colors hover:scale-110 transform"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button
          onClick={nextSong}
          className="text-4xl hover:text-purple-400 transition-colors hover:scale-110 transform"
          title="Next"
        >
          ⏭
        </button>
      </div>

      {/* Song List */}
      <div className="mt-6 space-y-2">
        {songs.map((song, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`p-2 rounded cursor-pointer transition-colors ${
              index === currentIndex
                ? 'bg-purple-600/30 border border-purple-500'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <p className="font-semibold text-sm">{song.title}</p>
            <p className="text-xs text-gray-400">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

