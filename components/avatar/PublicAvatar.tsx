'use client';

import dynamic from 'next/dynamic';

const AvatarScene = dynamic(() => import('./AvatarScene'), {
  ssr: false,
});

export default function PublicAvatar() {
  return (
    <div className="relative w-full h-[70vh]">
      <AvatarScene />
      <div className="absolute bottom-6 left-6 text-white text-lg opacity-80 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
        👋 Talk to me - I'm listening
      </div>
      <div className="absolute top-6 right-6 text-white text-sm opacity-60 bg-black/30 backdrop-blur-sm px-3 py-1 rounded">
        🎤 Mic enabled
      </div>
    </div>
  );
}

