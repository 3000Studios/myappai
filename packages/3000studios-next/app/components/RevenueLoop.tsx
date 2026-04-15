'use client';

export default function RevenueLoop() {
  const links = [
    'https://3000studios.com/store',
    'https://3000studios.com/revenue',
    'https://3000studios.com/apps',
  ];

  const pick = links[Math.floor(Math.random() * links.length)];

  return (
    <a
      href={pick}
      className="fixed top-1/2 right-0 bg-linear-to-l from-yellow-600 to-yellow-400 text-black px-4 py-8 font-bold shadow-2xl hover:scale-105 transition-transform z-40 rounded-l-lg"
      style={{ transform: 'translateY(-50%)' }}
    >
      <div className="writing-mode-vertical">UPGRADE</div>
    </a>
  );
}

