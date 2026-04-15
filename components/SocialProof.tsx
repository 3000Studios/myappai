'use client';

import { useEffect, useState } from 'react';

const recentPurchases = [
  {
    name: 'Alex M.',
    product: 'AI Automation Toolkit',
    location: 'San Francisco, CA',
    time: '2 minutes ago',
  },
  {
    name: 'Sarah K.',
    product: 'Video Editing Course',
    location: 'New York, NY',
    time: '5 minutes ago',
  },
  {
    name: 'Mike T.',
    product: 'Ultimate Creator Bundle',
    location: 'Austin, TX',
    time: '8 minutes ago',
  },
  {
    name: 'Emma W.',
    product: 'Next.js Starter Template',
    location: 'Seattle, WA',
    time: '12 minutes ago',
  },
  {
    name: 'David L.',
    product: '3D Animation Masterclass',
    location: 'Los Angeles, CA',
    time: '15 minutes ago',
  },
  {
    name: 'Jessica P.',
    product: 'YouTube Growth Blueprint',
    location: 'Chicago, IL',
    time: '18 minutes ago',
  },
  {
    name: 'Chris B.',
    product: 'Live Streaming Bundle',
    location: 'Miami, FL',
    time: '22 minutes ago',
  },
  {
    name: 'Rachel S.',
    product: 'Creator Pro Yearly',
    location: 'Boston, MA',
    time: '25 minutes ago',
  },
];

export function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentPurchases.length);
        setIsVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const purchase = recentPurchases[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div
        className={`bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{purchase.name.charAt(0)}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white font-semibold text-sm">{purchase.name}</span>
              <span className="text-green-400 text-xs">✓ Verified</span>
            </div>
            <p className="text-purple-200 text-xs mb-1">
              Just purchased <span className="font-semibold text-cyan-400">{purchase.product}</span>
            </p>
            <div className="flex items-center gap-2 text-purple-400 text-xs">
              <span>📍 {purchase.location}</span>
              <span>•</span>
              <span>{purchase.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

