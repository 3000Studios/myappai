import { useState } from 'react';
import Wormhole from './Wormhole';
import ConfettiEffect from './ConfettiEffect';

const objects = [
  { id: 1, label: 'Diamond', win: false },
  { id: 2, label: 'Gold Bar', win: false },
  { id: 3, label: 'Platinum Coin', win: false },
  { id: 4, label: 'Mystery Box', win: false },
  { id: 5, label: 'Quantum Chip', win: false },
  { id: 6, label: 'Laser Cube', win: false },
  { id: 7, label: 'Wormhole', win: false },
  { id: 8, label: 'AI Core', win: false },
  { id: 9, label: 'Secret Star', win: true }, // Only one win
];

export default function GuessingGame() {
  const [showWormhole, setShowWormhole] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState('');
  const [clicked, setClicked] = useState<number | null>(null);

  function handleClick(obj: (typeof objects)[0]) {
    setClicked(obj.id);
    if (obj.win) {
      setShowConfetti(true);
      setMessage('You Win! 🎉');
      setTimeout(() => setShowConfetti(false), 3000);
      // Play win sound
      const audio = new Audio('/audio/win.mp3');
      audio.play();
    } else {
      setShowWormhole(true);
      setMessage('Try Again! Tech Surprise!');
      setTimeout(() => setShowWormhole(false), 1200);
      // Play tech sound
      const audio = new Audio('/audio/tech.mp3');
      audio.play();
    }
  }

  return (
    <div className="relative z-10 py-8">
      <Wormhole show={showWormhole} />
      <ConfettiEffect show={showConfetti} />
      <h2 className="text-3xl font-bold text-center mb-6 text-gold">Guessing Game</h2>
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        {objects.map((obj) => (
          <button
            key={obj.id}
            className={`luxury-btn text-xl px-8 py-6 shadow-xl transition-all duration-300 ${clicked === obj.id ? 'scale-110' : ''}`}
            onClick={() => handleClick(obj)}
            disabled={showWormhole || showConfetti}
          >
            {obj.label}
          </button>
        ))}
      </div>
      {message && (
        <div className="text-center text-2xl font-bold text-platinum mt-4 animate-fade-in-up">
          {message}
        </div>
      )}
    </div>
  );
}

