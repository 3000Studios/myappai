'use client';

/**
 * Gravity Footer Component
 * Physics-based footer with motion effects as specified in the blueprint
 * Features: parallax effect, hover animations, and gravity-inspired motion
 */

'use client';

import { Github, Heart, Linkedin, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import AdUnit from '@/components/monetization/AdUnit';
import AffiliateLinks from '@/components/monetization/AffiliateLinks';

export default function GravityFooter() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate relative position (0 to 1)
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate transform based on mouse position for parallax effect
  const transformStyle = {
    transform: `translate(${mousePosition.x * 10 - 5}px, ${mousePosition.y * 5 - 2.5}px)`,
    transition: 'transform 0.3s ease-out',
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative mt-20 border-t border-gold/20 bg-black/80 backdrop-blur-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Monetization Layer */}
      <AffiliateLinks />
      <div className="container mx-auto px-4">
        <AdUnit slotId="footer-banner" label="Sponsored Content" />
      </div>

      {/* Animated Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-20 left-1/4 w-64 h-64 bg-gold/10 rounded-full filter blur-3xl transition-all duration-700 ${isHovering ? 'scale-150' : 'scale-100'}`}
          style={transformStyle}
        ></div>
        <div
          className={`absolute -top-10 right-1/4 w-48 h-48 bg-sapphire/10 rounded-full filter blur-3xl transition-all duration-700 ${isHovering ? 'scale-150' : 'scale-100'}`}
          style={{ ...transformStyle, transitionDelay: '0.1s' }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold gradient-text">3000 STUDIOS</h2>
            <p className="text-gray-400 text-sm">
              Professional creative studio delivering cutting-edge digital experiences
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-gold font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-gold transition-colors">
                Home
              </Link>
              <Link href="/store" className="block text-gray-400 hover:text-gold transition-colors">
                Store
              </Link>
              <Link
                href="/projects"
                className="block text-gray-400 hover:text-gold transition-colors"
              >
                Projects
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-gold transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="text-gold font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <Link
                href="/portfolio"
                className="block text-gray-400 hover:text-gold transition-colors"
              >
                Portfolio
              </Link>
              <Link href="/live" className="block text-gray-400 hover:text-gold transition-colors">
                Live Stream
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-gold transition-colors"
              >
                Contact
              </Link>
              <Link href="/login" className="block text-gray-400 hover:text-gold transition-colors">
                Admin
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-gold font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Github size={20} className="text-gold" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-sapphire/10 hover:bg-sapphire/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Twitter size={20} className="text-sapphire" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-platinum/10 hover:bg-platinum/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Linkedin size={20} className="text-platinum" />
              </a>
              <a
                href="mailto:contact@3000studios.com"
                aria-label="Email Us"
                className="w-10 h-10 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-all hover:scale-110"
              >
                <Mail size={20} className="text-gold" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p className="flex items-center gap-1">
              © {currentYear} 3000 Studios. Built with{' '}
              <Heart size={14} className="text-gold" fill="currentColor" /> and cutting-edge tech.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-gold transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gold transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-gold transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

