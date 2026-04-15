'use client';

/*
 * Copyright (c) 2025 NAME.
 * All rights reserved.
 * Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function BackgroundHybrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    // Get initial dimensions (only runs client-side in useEffect)
    const getCanvasSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const initialSize = getCanvasSize();
    canvas.width = initialSize.width;
    canvas.height = initialSize.height;

    // Create gradient once, recreate only on resize
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#050505');
    gradient.addColorStop(1, '#0e0e0e');

    const particles: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
      });
    }

    let animationId: number;

    function render() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Marble color base - use cached gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Embers + particles
      ctx.fillStyle = 'rgba(0,195,255,0.7)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    }

    render();

    // Handle resize
    const handleResize = () => {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      const size = getCanvasSize();
      canvas.width = size.width;
      canvas.height = size.height;

      // Recreate gradient for new canvas size
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#050505');
      gradient.addColorStop(1, '#0e0e0e');

      // Scale particle positions proportionally
      const scaleX = size.width / oldWidth;
      const scaleY = size.height / oldHeight;
      particles.forEach((p) => {
        p.x *= scaleX;
        p.y *= scaleY;
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />;
}

