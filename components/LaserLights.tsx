'use client';

import { useRef, useEffect } from 'react';

type Laser = {
  x: number;
  y: number;
  length: number;
  speed: number;
  color: string;
  width: number;
};

export default function LaserLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    const lasers: Laser[] = [];
    function spawnLaser() {
      if (!canvas) return;
      lasers.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        length: 200 + Math.random() * 200,
        speed: 6 + Math.random() * 8,
        color: `hsl(${Math.random() * 360},100%,60%)`,
        width: 2 + Math.random() * 4,
      });
    }
    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = l.color;
        ctx.lineWidth = l.width;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x, l.y - l.length);
        ctx.shadowBlur = 24;
        ctx.shadowColor = l.color;
        ctx.stroke();
        ctx.restore();
        l.y -= l.speed;
        if (l.y + l.length < 0) lasers.splice(i, 1);
      }
      if (Math.random() < 0.18) spawnLaser();
      animationId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className="fixed inset-0 pointer-events-none z-30 laser-canvas"
    />
  );
}

