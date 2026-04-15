'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <span className="text-2xl font-bold text-white">:</span>
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl font-bold text-white">:</span>
      <TimeBlock value={timeLeft.seconds} label="Secs" />
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 min-w-[60px] shadow-lg">
        <span className="text-2xl font-black text-white">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-xs text-purple-300 mt-1 font-semibold">{label}</span>
    </div>
  );
}

