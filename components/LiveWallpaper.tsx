'use client';

// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
};

export default function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = 60;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    const mouse = { x: w / 2, y: h / 2 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function loop() {
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(mouse.x, mouse.y, 40, mouse.x, mouse.y, 600);
      g.addColorStop(0, 'rgba(251, 191, 36, 0.15)');
      g.addColorStop(1, 'rgba(20, 20, 0, 0.9)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      particles.push({
        x: mouse.x,
        y: mouse.y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        alpha: 1,
      });

      if (particles.length > maxParticles) particles.shift();

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        ctx.beginPath();
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }

    loop();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 pointer-events-none" />
  );
}

