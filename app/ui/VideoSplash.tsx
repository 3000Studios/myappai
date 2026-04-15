'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function VideoSplash() {
  const [showSplash, setShowSplash] = useState(false);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  useEffect(() => {
    // Check if user has seen splash in this session
    const seen = sessionStorage.getItem('splash-seen');
    if (!seen) {
      setShowSplash(true);
    } else {
      setHasSeenSplash(true);
    }
  }, []);

  const handleSplashEnd = () => {
    sessionStorage.setItem('splash-seen', 'true');
    setShowSplash(false);
    setHasSeenSplash(true);
  };

  if (hasSeenSplash) return null;

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black cursor-pointer"
          onClick={handleSplashEnd}
        >
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleSplashEnd}
            className="w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4"
              type="video/mp4"
            />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

