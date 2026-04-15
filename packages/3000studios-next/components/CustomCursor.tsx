'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    };

    const animate = () => {
      // Smooth follow effect
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animate);
    };

    const handleMouseDown = () => {
      cursor.classList.add('scale-75');
      follower.classList.add('scale-150');
    };

    const handleMouseUp = () => {
      cursor.classList.remove('scale-75');
      follower.classList.remove('scale-150');
    };

    const handleMouseEnterLink = () => {
      cursor.classList.add('scale-150');
      follower.classList.add('scale-200', 'border-[#D4AF37]');
    };

    const handleMouseLeaveLink = () => {
      cursor.classList.remove('scale-150');
      follower.classList.remove('scale-200', 'border-[#D4AF37]');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Add hover effects to interactive elements
    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach((link) => {
      link.addEventListener('mouseenter', handleMouseEnterLink);
      link.addEventListener('mouseleave', handleMouseLeaveLink);
    });

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      links.forEach((link) => {
        link.removeEventListener('mouseenter', handleMouseEnterLink);
        link.removeEventListener('mouseleave', handleMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed w-3 h-3 bg-[#D4AF37] rounded-full pointer-events-none z-99999 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 mix-blend-difference"
        style={{ left: '-100px', top: '-100px' }}
      />
      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed w-10 h-10 border-2 border-white/50 rounded-full pointer-events-none z-99998 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
        style={{ left: '-100px', top: '-100px' }}
      />
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}

