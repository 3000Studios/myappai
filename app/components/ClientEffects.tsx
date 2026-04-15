'use client';

/**
 * ClientEffects Component
 * Wraps all heavy visual effects in a client component for proper lazy loading.
 * These are non-critical and load after the main content.
 */

import { styleRegistry } from '@/lib/styleRegistry';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Heavy visual effects - load after initial paint with ssr: false
const BackgroundMusicPlayer = dynamic(() => import('@/components/BackgroundMusic'), {
  ssr: false,
  loading: () => null,
});

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), {
  ssr: false,
  loading: () => null,
});

const IntroVideoGate = dynamic(() => import('@/components/IntroVideoGate'), {
  ssr: false,
  loading: () => null,
});

const MouseTrails = dynamic(() => import('@/components/MouseTrails'), {
  ssr: false,
  loading: () => null,
});

const VideoBackground = dynamic(() => import('@/components/VideoBackground'), {
  ssr: false,
  loading: () => null,
});

const AvatarWrapper = dynamic(() => import('./AvatarWrapper'), {
  ssr: false,
  loading: () => null,
});

const SmoothScroll = dynamic(() => import('./SmoothScroll'), {
  ssr: false,
  loading: () => null,
});

const SoundEffects = dynamic(() => import('./SoundEffects'), {
  ssr: false,
  loading: () => null,
});

const VideoWallpaper = dynamic(() => import('./VideoWallpaper'), {
  ssr: false,
  loading: () => null,
});

const VideoSplash = dynamic(() => import('../ui/VideoSplash'), {
  ssr: false,
  loading: () => null,
});

export default function ClientEffects() {
  return (
    <Suspense fallback={null}>
      <IntroVideoGate>
        <VideoSplash />
        <VideoWallpaper opacity={0.25} />
        <BackgroundMusicPlayer />
        <SmoothScroll />
        <SoundEffects />
        <MouseTrails />
        <CustomCursor />
        <VideoBackground src={styleRegistry.backgroundVideo} />
        <AvatarWrapper />
      </IntroVideoGate>
    </Suspense>
  );
}

