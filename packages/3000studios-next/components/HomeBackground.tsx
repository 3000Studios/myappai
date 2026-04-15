'use client';

import { useEffect, useRef } from 'react';

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const text = '3000 STUDIOS';
    const fontSize = Math.min(canvas.width / 6, 200);

    const animate = () => {
      time += 0.02;

      // Clear for transparency to show global video background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw 3D text effect
      ctx.font = `bold ${fontSize}px "Playfair Display", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Multiple shadow layers for 3D effect
      for (let i = 30; i > 0; i--) {
        const alpha = i / 30;
        const offsetX = Math.sin(time + i * 0.1) * 2;
        const offsetY = Math.cos(time + i * 0.1) * 2;

        ctx.fillStyle = `rgba(30, 58, 95, ${alpha * 0.3})`;
        ctx.fillText(text, centerX + offsetX + i * 0.5, centerY + offsetY + i * 0.5);
      }

      // Main text with gold gradient
      const textGradient = ctx.createLinearGradient(
        centerX - fontSize * 3,
        centerY - fontSize / 2,
        centerX + fontSize * 3,
        centerY + fontSize / 2
      );
      textGradient.addColorStop(0, '#D4AF37');
      textGradient.addColorStop(0.3, '#FFD700');
      textGradient.addColorStop(0.5, '#D4AF37');
      textGradient.addColorStop(0.7, '#FFD700');
      textGradient.addColorStop(1, '#D4AF37');

      ctx.fillStyle = textGradient;
      ctx.fillText(text, centerX, centerY);

      // Glow effect
      ctx.shadowColor = '#D4AF37';
      ctx.shadowBlur = 20 + Math.sin(time * 2) * 10;
      ctx.fillText(text, centerX, centerY);
      ctx.shadowBlur = 0;

      // Particle overlay
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(time * 0.5 + i * 0.5) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.3 + i * 0.3) * 0.5 + 0.5) * canvas.height;
        const size = Math.sin(time + i) * 2 + 3;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

