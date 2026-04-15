import React from 'react';

interface AvatarProps {
  mood: 'idle' | 'talking' | 'dancing' | 'sarcastic';
}

export const Avatar: React.FC<AvatarProps> = ({ mood }) => {
  return (
    <div
      className={`relative w-48 h-48 mx-auto transition-all duration-500 ${
        mood === 'dancing' ? 'animate-dance scale-110' : ''
      }`}
    >
      {/* Holographic Base Container */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-900/50 to-transparent blur-md"></div>

      {/* The "Realistic" Face (Styled via CSS gradients and shapes to look like a digital wireframe of a woman) */}
      <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
        {/* Head */}
        <div className="w-32 h-40 bg-gradient-to-b from-purple-200 to-purple-400 rounded-[50px] shadow-[0_0_20px_rgba(255,255,255,0.4)] relative overflow-hidden border border-white/30">
          {/* Hair Effect */}
          <div className="absolute top-0 w-full h-16 bg-black/80 rounded-b-xl filter blur-sm"></div>

          {/* Eyes */}
          <div className="absolute top-14 w-full flex justify-center gap-4 px-4">
            <div
              className={`h-3 w-8 bg-black rounded-full transition-all duration-200 ${mood === 'sarcastic' ? 'rotate-12' : ''} overflow-hidden`}
            >
              <div className="w-2 h-2 bg-white rounded-full ml-1 mt-0.5 animate-pulse"></div>
            </div>
            <div
              className={`h-3 w-8 bg-black rounded-full transition-all duration-200 ${mood === 'sarcastic' ? '-rotate-12' : ''} overflow-hidden`}
            >
              <div className="w-2 h-2 bg-white rounded-full ml-1 mt-0.5 animate-pulse"></div>
            </div>
          </div>

          {/* Mouth (Animates when talking) */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-900/80 rounded-full transition-all duration-100 ${
              mood === 'talking'
                ? 'animate-pulse-fast w-10 h-6 border-2 border-red-400'
                : mood === 'sarcastic'
                  ? 'w-10 h-1 border-b-2 border-black rotate-6'
                  : 'w-8 h-2'
            }`}
          ></div>

          {/* Cheeks */}
          <div className="absolute top-20 left-2 w-4 h-2 bg-pink-500/30 rounded-full blur-sm"></div>
          <div className="absolute top-20 right-2 w-4 h-2 bg-pink-500/30 rounded-full blur-sm"></div>
        </div>

        {/* Neck/Shoulders */}
        <div className="absolute -bottom-4 w-40 h-20 bg-gray-800 rounded-t-full -z-10 border-t border-blue-500/50"></div>
      </div>

      {/* Holographic Interference Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.1)_50%)] bg-[length:100%_4px] pointer-events-none animate-pulse"></div>

      {/* Mood Text Badge */}
      <div className="absolute -bottom-2 w-full text-center">
        <span className="bg-black/80 text-cyan-400 text-[10px] font-mono px-2 py-1 rounded border border-cyan-500 uppercase tracking-widest">
          {mood}
        </span>
      </div>
    </div>
  );
};

