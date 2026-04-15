'use client';

import { useEffect } from 'react';

/**
 * Smooth Scroll Implementation
 * Provides buttery smooth scrolling experience
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Lenis-like smooth scroll effect
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    const ease = 0.1;

    const smoothScrollStep = () => {
      targetScrollY = window.scrollY;
      currentScrollY += (targetScrollY - currentScrollY) * ease;

      if (Math.abs(targetScrollY - currentScrollY) < 0.5) {
        currentScrollY = targetScrollY;
      }

      requestAnimationFrame(smoothScrollStep);
    };

    smoothScrollStep();

    // Handle anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return null;
}

