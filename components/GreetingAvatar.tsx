'use client';

import { motion, useDragControls } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * GreetingAvatar Component
 * A movable female avatar that greets users.
 * Covers 15% of the screen height.
 */
export default function GreetingAvatar({
  name = 'Sarah',
  customGreeting = 'Welcome to 3000 Studios! How can I help you today?',
}) {
  const [greeting, setGreeting] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    // Show greeting after 2 seconds
    const timer = setTimeout(() => {
      setGreeting(customGreeting);
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [customGreeting]);

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      initial={{ opacity: 0, x: 100, y: 100 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      className="fixed bottom-10 right-10 z-[100] cursor-grab active:cursor-grabbing flex flex-col items-center"
      style={{ height: '30vh', width: 'auto' }}
    >
      {greeting && isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white text-sm max-w-[200px] shadow-2xl relative"
        >
          <p>{greeting}</p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
          >
            ✕
          </button>
          <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white/10 backdrop-blur-md border border-white/20 rotate-45 border-t-0 border-l-0" />
        </motion.div>
      )}

      <div className="relative h-full aspect-[2/3]">
        <Image
          src="/female_admin_avatar.png"
          alt="AI Assistant"
          fill
          className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] pointer-events-none"
          priority
        />
      </div>

      <div className="mt-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 text-[10px] text-platinum/50 uppercase tracking-widest">
        {name} (AI)
      </div>
    </motion.div>
  );
}
