'use client';

import { useEffect } from 'react';

const BRANDING_TEXTS = ['3000 STUDIOS', 'WELCOME', 'COME ON IN', 'HELLO'];

export default function ScrollZoom3D() {
  useEffect(() => {
    const texts = document.querySelectorAll('.branding-text-3d');

    // Initial trigger
    setTimeout(() => {
      texts.forEach((text) => {
        text.classList.add('visible');
      });
    }, 300);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollLayer = document.getElementById('scrollLayer');

      if (scrollY > window.innerHeight * 1.5 && scrollLayer) {
        scrollLayer.style.opacity = '0';
        scrollLayer.style.pointerEvents = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      id="scrollLayer"
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-100 pointer-events-none"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {BRANDING_TEXTS.map((text, i) => (
        <div
          key={i}
          className={`branding-text-3d scroll-text-${i + 1} absolute`}
          style={{
            fontSize: 'clamp(1.5rem, 10vw, 8rem)',
            fontWeight: 'bold',
            letterSpacing: '4px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #D4AF37, #e8e8e8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0,
            transform: 'translateZ(0) scale(0.3) rotateX(45deg) rotateY(45deg)',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 20px 40px rgba(212, 175, 55, 0.5))',
            whiteSpace: 'nowrap',
            willChange: 'transform, opacity',
            animationDelay: `${i * 1.3}s`,
          }}
        >
          {text}
        </div>
      ))}
      <style jsx>{`
        .branding-text-3d.visible {
          animation: scroll3DZoom 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        @keyframes scroll3DZoom {
          0% {
            opacity: 0;
            transform: translateZ(-500px) scale(0.2) rotateX(60deg) rotateY(60deg) rotateZ(30deg);
          }
          40% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateZ(1000px) scale(2.5) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
          }
        }
      `}</style>
    </div>
  );
}

