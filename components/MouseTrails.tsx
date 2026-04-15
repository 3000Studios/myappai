'use client';

import { useEffect, useRef, useState } from 'react';

const PALETTE = [
  { name: 'gold', color: '#D4AF37' },
  { name: 'blue', color: '#3B82F6' },
  { name: 'green', color: '#22C55E' },
  { name: 'white', color: '#FFFFFF' },
  { name: 'silver', color: '#C0C0C0' },
  { name: 'yellow', color: '#FACC15' },
  { name: 'orange', color: '#FB923C' },
];

export default function MouseTrails() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paletteIndex, setPaletteIndex] = useState<number>(() =>
    Math.floor(Math.random() * PALETTE.length)
  );
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trails: { x: number; y: number; alpha: number }[] = [];
    function onMove(e: MouseEvent) {
      mouse = { x: e.clientX, y: e.clientY };
      trails.push({ x: mouse.x, y: mouse.y, alpha: 1 });
      if (trails.length > 60) trails.shift();
    }
    window.addEventListener('mousemove', onMove);
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < trails.length; i++) {
        const t = trails[i];
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 10, 0, 2 * Math.PI);
        const base = PALETTE[paletteIndex].color;
        ctx.fillStyle = base;
        ctx.shadowBlur = 20;
        ctx.shadowColor = base;
        ctx.fill();
        ctx.restore();
        t.alpha *= 0.96;
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();
    const colorInterval = setInterval(() => {
      setPaletteIndex((idx) => (idx + 1) % PALETTE.length);
    }, 15000);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationId);
      clearInterval(colorInterval);
    };
  }, [paletteIndex]);

  return (
    <canvas
      ref={canvasRef}
      width={typeof window !== 'undefined' ? window.innerWidth : 1920}
      height={typeof window !== 'undefined' ? window.innerHeight : 1080}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
}

