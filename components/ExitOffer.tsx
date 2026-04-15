'use client';
import { useEffect, useState } from 'react';

export default function ExitOffer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (e.clientY < 10) setShow(true);
    };
    window.addEventListener('mouseout', fn);
    return () => window.removeEventListener('mouseout', fn);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center animate-in fade-in duration-300">
      <div className="glass p-12 rounded-xl text-center max-w-md mx-4 border border-yellow-500/30">
        <h2 className="gold-text text-4xl font-bold mb-4 font-display">Wait.</h2>
        <p className="text-gray-300 mb-8 text-lg">
          Don't leave empty handed. Take <span className="text-yellow-400 font-bold">20% off</span>{' '}
          your first order.
        </p>
        <button
          onClick={() => {
            window.location.href = '/store';
          }}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold py-4 rounded hover:scale-105 transition-all"
        >
          CLAIM DISCOUNT
        </button>
        <button
          onClick={() => setShow(false)}
          className="mt-4 text-sm text-gray-500 hover:text-white"
        >
          No thanks, I hate money.
        </button>
      </div>
    </div>
  );
}

