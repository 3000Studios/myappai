'use client';

import dynamic from 'next/dynamic';

const FemaleAvatar = dynamic(() => import('../admin/components/FemaleAvatar'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-cyan-500 text-xs">
      LOADING AVATAR...
    </div>
  ),
});

export default function AvatarWrapper() {
  return (
    <div
      className="fixed bottom-0 left-0 z-9999 pointer-events-none"
      style={{ width: '15vw', height: '40vh' }}
    >
      <FemaleAvatar />
    </div>
  );
}

