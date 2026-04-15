'use client';

/**
 * Sticky Upgrade Button
 * Always visible CTA for subscription conversion
 * REVENUE LOCK — DO NOT MODIFY
 * Primary conversion point for subscription revenue
 */

'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function StickyUpgradeButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after user scrolls down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -20,
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 right-4 z-40"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      <Link
        href="/store"
        className="flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-xl backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #00f5d4 0%, #7000ff 100%)',
          color: '#000',
          boxShadow: '0 0 30px rgba(0, 245, 212, 0.5)',
        }}
      >
        <Zap size={20} fill="currentColor" />
        <span className="hidden sm:inline">Upgrade</span>
      </Link>
    </motion.div>
  );
}

