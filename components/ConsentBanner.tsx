'use client';

/**
 * GDPR/Cookie Consent Banner
 *
 * Required for AdSense approval and compliance.
 * Displays cookie consent banner and manages user preferences.
 *
 * Features:
 * - GDPR compliant consent management
 * - Persistent storage of user preferences
 * - Required for Google AdSense approval
 * - Clean, non-intrusive UI
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_STORAGE_KEY = '3000studios_consent';

interface ConsentPreferences {
  analytics: boolean;
  advertising: boolean;
  timestamp: number;
}

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!storedConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent: ConsentPreferences = {
      analytics: true,
      advertising: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    setShowBanner(false);

    // Note: AdSense requires page reload to initialize properly
    // Using setTimeout to allow banner animation to complete
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 300);
  };

  const handleRejectNonEssential = () => {
    const consent: ConsentPreferences = {
      analytics: false,
      advertising: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleCustomize = (analytics: boolean, advertising: boolean) => {
    const consent: ConsentPreferences = {
      analytics,
      advertising,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    setShowBanner(false);

    // Only reload if advertising is enabled (required for AdSense)
    if (advertising) {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 300);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div
            className="max-w-6xl mx-auto rounded-lg shadow-2xl border"
            style={{
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 215, 0, 0.3)',
            }}
          >
            <div className="p-6 md:p-8">
              {!showDetails ? (
                // Simple consent view
                <>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#FFD700' }}>
                        🍪 We Value Your Privacy
                      </h3>
                      <p className="text-sm md:text-base" style={{ color: '#E5E4E2' }}>
                        We use cookies and similar technologies to enhance your experience, analyze
                        traffic, and show personalized ads. By clicking "Accept All", you consent to
                        our use of cookies.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <button
                        onClick={handleAcceptAll}
                        className="px-6 py-3 rounded-lg font-semibold text-black transition-all hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
                        }}
                      >
                        Accept All
                      </button>

                      <button
                        onClick={handleRejectNonEssential}
                        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#E5E4E2',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                      >
                        Reject Non-Essential
                      </button>

                      <button
                        onClick={() => setShowDetails(true)}
                        className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                        style={{
                          background: 'transparent',
                          color: '#FFD700',
                          textDecoration: 'underline',
                        }}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Detailed consent view
                <div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#FFD700' }}>
                    Customize Your Privacy Settings
                  </h3>

                  <div className="space-y-4 mb-6">
                    {/* Essential Cookies */}
                    <div
                      className="p-4 rounded-lg"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1" style={{ color: '#E5E4E2' }}>
                            Essential Cookies
                          </h4>
                          <p className="text-sm" style={{ color: 'rgba(229, 228, 226, 0.7)' }}>
                            Required for the website to function. Cannot be disabled.
                          </p>
                        </div>
                        <div className="ml-4">
                          <div
                            className="px-3 py-1 rounded text-sm font-semibold"
                            style={{ background: '#4CAF50', color: 'white' }}
                          >
                            Always Active
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <ConsentOption
                      title="Analytics Cookies"
                      description="Help us understand how visitors interact with our website."
                      id="analytics"
                    />

                    {/* Advertising Cookies */}
                    <ConsentOption
                      title="Advertising Cookies"
                      description="Used to deliver personalized ads and measure ad performance."
                      id="advertising"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: 'black',
                      }}
                    >
                      Accept All
                    </button>

                    <button
                      onClick={() => {
                        const analyticsEl = document.getElementById(
                          'analytics'
                        ) as HTMLInputElement;
                        const advertisingEl = document.getElementById(
                          'advertising'
                        ) as HTMLInputElement;
                        handleCustomize(
                          analyticsEl?.checked || false,
                          advertisingEl?.checked || false
                        );
                      }}
                      className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#E5E4E2',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                      }}
                    >
                      Save Preferences
                    </button>

                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-3 rounded-lg font-semibold transition-all"
                      style={{ color: '#FFD700' }}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable consent option component
function ConsentOption({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: string;
}) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold mb-1" style={{ color: '#E5E4E2' }}>
            {title}
          </h4>
          <p className="text-sm" style={{ color: 'rgba(229, 228, 226, 0.7)' }}>
            {description}
          </p>
        </div>
        <div className="ml-4">
          <label className="relative inline-block w-14 h-8 cursor-pointer">
            <input
              type="checkbox"
              id={id}
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="absolute inset-0 rounded-full transition-colors peer-checked:bg-[#FFD700] bg-gray-600"
              style={{
                background: enabled ? '#FFD700' : '#4a4a4a',
              }}
            />
            <div
              className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform"
              style={{
                transform: enabled ? 'translateX(24px)' : 'translateX(0)',
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if user has given consent for specific features
 */
export function useConsent() {
  const [consent, setConsent] = useState<ConsentPreferences | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (storedConsent) {
      setConsent(JSON.parse(storedConsent));
    }
  }, []);

  return {
    hasConsent: !!consent,
    analytics: consent?.analytics ?? false,
    advertising: consent?.advertising ?? false,
  };
}

