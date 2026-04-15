'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create hover sound effect
    hoverSoundRef.current = new Audio(
      'data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0Ya4AAAA='
    );
  }, []);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  const pathname = usePathname();

  // Required navigation structure per MASTER DIRECTIVE
  const navLinks = [
    { href: '/home', label: 'HOME' },
    { href: '/store/3000-store', label: 'STORE' },
    { href: '/vip', label: 'VIP' },
    { href: '/projects', label: 'PROJECTS' },
    { href: '/live', label: 'LIVE' },
    { href: '/posts', label: 'POSTS' },
    { href: '/admin', label: 'ADMIN' },
  ];

  // Hide navigation entirely on the landing page (/)
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-20">
      {/* Contained Video Background - stays within nav boundaries */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        >
          <source
            src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986142/3dweb_azplaj.mp4"
            type="video/mp4"
          />
        </video>
        {/* Silver/Gold glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-amber-900/20 to-slate-900/85 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40"></div>
      </div>

      {/* Bottom fade gradient - blends smoothly into content below */}
      <div className="absolute -bottom-8 left-0 right-0 h-12 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none"></div>

      {/* Navigation Content */}
      <div className="relative h-full px-6">
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover-pop z-20"
            onMouseEnter={playHoverSound}
          >
            <img
              src="https://res.cloudinary.com/dj92eb97f/image/upload/v1766973137/new_logo_kz6pzz.png"
              alt="3000 Studios Logo"
              className="w-14 h-14 object-contain animate-glow"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-3 py-2 font-extrabold tracking-wide text-slate-200 hover:text-yellow-300 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-200 hover-pop"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(255,215,0,0.20)' }}
                onMouseEnter={playHoverSound}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl text-gold-gradient hover-pop"
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={playHoverSound}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-6 space-y-4 border border-slate-500/30 rounded-xl bg-gradient-to-b from-gray-900/80 via-slate-800/70 to-gray-900/80 shadow-xl">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block px-3 py-2 text-center font-extrabold tracking-wide text-slate-200 hover:text-yellow-300 border-b-2 border-transparent hover:border-yellow-300 transition-all duration-200"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(255,215,0,0.20)' }}
                onClick={() => setIsOpen(false)}
                onMouseEnter={playHoverSound}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

