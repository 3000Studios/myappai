'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

// --- Sound Generation Utility ---
const playElectricSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const bufferSize = 2048;
    const whiteNoise = ctx.createScriptProcessor(bufferSize, 1, 1);

    whiteNoise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    };

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.05;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.2);

    setTimeout(() => {
      whiteNoise.disconnect();
      gainNode.disconnect();
      filter.disconnect();
      ctx.close();
    }, 240);
  } catch {
    // Audio context could be blocked; fail silently
  }
};

// --- Electric Link ---
type ElectricLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
};

const ElectricLink = ({ href, label, isActive, onClick }: ElectricLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isZapping, setIsZapping] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const router = useRouter();

  const arcPaths = useMemo(
    () => [
      'M0,20 Q25,12 50,20 T100,20',
      'M0,20 Q25,28 50,20 T100,20',
      'M0,20 Q25,16 50,20 T100,20',
    ],
    []
  );

  useEffect(() => {
    const timer = setInterval(
      () => {
        if (Math.random() > 0.65 && !isHovered) {
          setIsZapping(true);
          setTimeout(() => setIsZapping(false), 220);
        }
      },
      Math.random() * 3500 + 1800
    );

    return () => clearInterval(timer);
  }, [isHovered]);

  const handleHover = () => {
    setIsHovered(true);
    playElectricSound();
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsExploding(true);
    playElectricSound();
    playElectricSound();

    setTimeout(() => {
      onClick?.();
      router.push(href);
    }, 420);
  };

  return (
    <div className="relative group">
      <Link
        href={href}
        onClick={handleClick}
        onMouseEnter={handleHover}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative block px-4 py-2 text-lg font-bold tracking-wider transition-all duration-300 ${
          isActive ? 'text-[var(--electric-blue)]' : 'text-gray-200'
        } ${isExploding ? 'opacity-0 scale-150' : 'opacity-100'}`}
        style={{
          textShadow:
            isHovered || isZapping || isActive
              ? '0 0 6px #fff, 0 0 12px #00f3ff, 0 0 28px #00f3ff'
              : 'none',
        }}
      >
        {label}

        <AnimatePresence>
          {(isHovered || isZapping) && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              {arcPaths.map((d, idx) => (
                <motion.path
                  key={idx}
                  d={d}
                  stroke="#00f3ff"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 0.35,
                    repeat: Infinity,
                    delay: idx * 0.05,
                  }}
                />
              ))}
            </motion.svg>
          )}
        </AnimatePresence>
      </Link>

      {isExploding && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[var(--electric-blue)] rounded-full"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [1, 0],
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 120,
                opacity: [1, 0],
              }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.45 }}
          />
        </div>
      )}
    </div>
  );
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/store', label: 'STORE' },
    { href: '/vendors-platform', label: 'VENDORS' },
    { href: '/projects', label: 'PROJECTS' },
    { href: '/portfolio', label: 'PORTFOLIO' },
    { href: '/live', label: 'LIVE' },
    { href: '/blog', label: 'BLOG' },
  ];

  // Removed: studio, experience, avatar, dashboard, team, contact per directive

  const isActiveLink = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-premium border-b border-gold/30 shadow-2xl'
          : 'glass border-b border-gray-800/50'
      }`}
    >
      {/* Header nav background video */}
      <div className="absolute inset-0 -z-10">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source
            src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986156/digitalliquid_q8jesa.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 group relative z-10">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110 duration-300">
              <Image
                src="/brand-logo.png"
                alt="3000 Studios"
                width={48}
                height={48}
                className="drop-shadow-[0_0_18px_rgba(0,243,255,0.45)]"
              />
            </div>
            {/* Removed text label per directive: logo-only */}
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 ml-10"></div>

          <div className="hidden md:block ml-4">
            <Link
              href="/login"
              className="relative px-6 py-2 overflow-hidden font-bold text-white rounded-full group bg-gray-900 border border-[var(--platinum)]/40 hover:border-[var(--electric-blue)]"
            >
              <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-[var(--electric-blue)] top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease" />
              <span className="relative transition duration-300 group-hover:text-black ease">
                LOGIN
              </span>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen((p) => !p)}
            className="md:hidden relative p-2 text-gray-300 hover:text-[var(--electric-blue)] transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 min-h-screen bg-black/95 backdrop-blur-xl md:hidden pt-24 px-4"
          >
            <div className="flex flex-col items-center space-y-8">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-6 px-8 py-3 rounded-full bg-[var(--electric-blue)] text-black font-bold text-lg shadow-[0_0_22px_rgba(0,243,255,0.45)]"
              >
                LOGIN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

