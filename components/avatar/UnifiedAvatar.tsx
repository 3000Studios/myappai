'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues with Three.js
const FemaleAvatar3D = dynamic(() => import('./FemaleAvatar3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase animate-pulse">
          INITIALIZING AVATAR...
        </span>
      </div>
    </div>
  ),
});

interface AvatarWrapperProps {
  variant?: 'full' | 'bust' | 'head';
  className?: string;
  showHUD?: boolean;
}

/**
 * UnifiedAvatar - Used across both public and admin sections
 * Provides consistent 3D female avatar experience
 */
export default function UnifiedAvatar({
  variant = 'bust',
  className = '',
  showHUD = true,
}: AvatarWrapperProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0,78,88,0.3) 0%, rgba(0,0,0,0.5) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212,175,55,0.2)',
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/50 rounded-full blur-[60px]" />
      </div>

      <FemaleAvatar3D variant={variant} showHUD={showHUD} />
    </div>
  );
}

