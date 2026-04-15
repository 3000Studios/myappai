'use client';

import { playSound } from '@/lib/sound/sfx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const PUBLIC_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Projects', href: '/projects' },
  { label: 'Live', href: '/live' },
  { label: 'Store', href: '/store' },
  { label: 'Apps', href: '/apps' },
  { label: 'Info', href: '/info' },
  { label: 'Admin', href: '/login' },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-2xl ${mobileMenuOpen ? 'h-screen' : 'h-24'}`}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      >
        <source
          src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986203/slow_tunnel_v0hpc8.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Border */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo Video */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-16 h-16 overflow-hidden rounded-full border border-white/10 group-hover:border-[#D4AF37] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source
                  src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767266852/marblenoback-ezgif.com-resize-video_kn63v8.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </Link>

          {/* Desktop Navigation - 3D Cube Style */}
          <div className="hidden lg:flex items-center space-x-6">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('nav')}
                  className="nav-cube-link"
                >
                  <span className={isActive ? 'text-[#D4AF37]' : ''}>{item.label}</span>
                  <span className={isActive ? 'text-[#D4AF37]' : ''}>{item.label}</span>
                  <span className={isActive ? 'text-[#D4AF37]' : ''}>{item.label}</span>
                  <span className={isActive ? 'text-[#D4AF37]' : ''}>{item.label}</span>
                </Link>
              );
            })}

            {/* VIP ENTRY */}
            <Link
              href="/vip"
              className="px-4 py-1 rounded border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition-colors"
            >
              VIP
            </Link>
          </div>

          {/* Mobile Menu Button - Animated Hamburger */}
          <div className="lg:hidden flex items-center">
            <div
              className={`menu-icon-wrapper ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="lg:hidden fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white text-4xl"
            >
              ×
            </button>
            <div className="flex flex-col space-y-8 items-center">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      playSound('nav');
                    }}
                    className={`text-3xl font-serif tracking-widest ${isActive ? 'text-[#D4AF37]' : 'text-white'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/vip"
                onClick={() => setMobileMenuOpen(false)}
                className="px-12 py-3 rounded-full border-2 border-yellow-500 text-yellow-400 text-2xl font-bold"
              >
                VIP ACCESS
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
