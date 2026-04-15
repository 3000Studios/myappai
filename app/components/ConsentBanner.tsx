'use client';

/**
 * GDPR Consent Banner
 * Required for AdSense compliance
 * REVENUE LOCK — DO NOT MODIFY
 * Removing this component risks AdSense approval and compliance
 */

'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie-consent', 'true');
    }
    setShowBanner(false);
  };

  const handleDecline = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie-consent', 'false');
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/95 backdrop-blur-lg border-t border-cyan-500/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">Cookie & Privacy Notice</p>
          <p>
            We use cookies and similar technologies to enhance your experience, serve personalized
            ads, and analyze traffic. By clicking "Accept", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

