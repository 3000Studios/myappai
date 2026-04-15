/**
 * Shadow Avatar - Main Component
 * 3D animated AI avatar for homepage
 */

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const AvatarScene = dynamic(() => import('./AvatarScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-gold text-2xl animate-pulse">Loading Shadow PRIME...</div>
    </div>
  ),
});

export default function ShadowAvatar() {
  return (
    <div className="w-full h-[600px] relative">
      <Suspense fallback={<div>Loading...</div>}>
        <AvatarScene />
      </Suspense>
    </div>
  );
}

