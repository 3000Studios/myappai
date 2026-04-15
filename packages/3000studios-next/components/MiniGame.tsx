'use client';

// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import { useEffect, useRef, useState } from 'react';

export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let playerY = 200;
    let playerVelocity = 0;
    type Obstacle = {
      x: number;
      y: number;
      width: number;
      height: number;
      scored?: boolean;
    };
    let obstacles: Obstacle[] = [];
    let gameScore = 0;
    let gameOver = false;

    const gravity = 0.5;
    const jumpStrength = -10;
    const playerSize = 40;
    const obstacleWidth = 60;
    const obstacleGap = 200; // Unused

    const reset = () => {
      playerY = 200;
      playerVelocity = 0;
      obstacles = [];
      gameScore = 0;
      gameOver = false;
      setScore(0);
    };

    const jump = () => {
      if (!gameStarted) {
        setGameStarted(true);
        reset();
      }
      if (!gameOver) {
        playerVelocity = jumpStrength;
      } else {
        reset();
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!gameStarted) {
        // Draw start screen
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click or Press Space to Start', canvas.width / 2, canvas.height / 2);

        // Draw player preview
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(100, playerY, playerSize, playerSize);

        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      if (gameOver) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${gameScore}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      // Update player
      playerVelocity += gravity;
      playerY += playerVelocity;

      // Ground collision
      if (playerY > canvas.height - playerSize) {
        playerY = canvas.height - playerSize;
        playerVelocity = 0;
      }

      // Ceiling collision
      if (playerY < 0) {
        playerY = 0;
        playerVelocity = 0;
      }

      // Draw player
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(100, playerY, playerSize, playerSize);

      // Add new obstacles
      if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300) {
        const gapY = Math.random() * (canvas.height - 250) + 75;
        obstacles.push({
          x: canvas.width,
          y: 0,
          width: obstacleWidth,
          height: gapY - 75,
        });
        obstacles.push({
          x: canvas.width,
          y: gapY + 75,
          width: obstacleWidth,
          height: canvas.height - (gapY + 75),
        });
      }

      // Update and draw obstacles
      obstacles = obstacles.filter((obs) => {
        obs.x -= 3;

        // Draw obstacle
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Check collision
        if (
          100 + playerSize > obs.x &&
          100 < obs.x + obs.width &&
          playerY + playerSize > obs.y &&
          playerY < obs.y + obs.height
        ) {
          gameOver = true;
        }

        // Score point
        if (obs.x + obs.width < 100 && !obs.scored) {
          gameScore++;
          setScore(gameScore);
          obs.scored = true;
        }

        return obs.x + obs.width > 0;
      });

      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${gameScore}`, 10, 30);

      // Draw ground
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted]);

  return (
    <div className="glass p-6 rounded-2xl">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold">KBH Game Arcade</h3>
        <p className="text-gray-400">Use Space or Click to Jump</p>
        <p className="text-xl font-bold text-purple-400 mt-2">Score: {score}</p>
      </div>
      <canvas
        ref={canvasRef}
        width="800"
        height="400"
        className="mx-auto rounded-xl shadow-xl border border-purple-500/30 cursor-pointer"
      />
      <p className="text-center text-sm text-gray-500 mt-4">
        Avoid the green obstacles and survive as long as you can!
      </p>
    </div>
  );
}

