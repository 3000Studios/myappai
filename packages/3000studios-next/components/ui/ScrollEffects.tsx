'use client';
import { useEffect } from 'react';

export default function ScrollEffects() {
  useEffect(() => {
    (async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
      gsap.registerPlugin(ScrollTrigger);

      const elements = document.querySelectorAll<HTMLElement>('[data-animate]');
      elements.forEach((el) => {
        const type = el.dataset.animate || 'fade-up';
        const base = { opacity: 0, y: 24 };
        const to = { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' };
        const from = type === 'fade-in' ? { opacity: 0 } : base;

        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    })();
  }, []);

  return null;
}

