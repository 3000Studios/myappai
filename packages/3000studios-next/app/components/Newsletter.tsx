/**
 * Newsletter Component
 * Enhanced newsletter subscription with validation and backend integration
 * Revenue generation through lead capture
 */

'use client';

import { AlertCircle, Check, Gift, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

interface NewsletterProps {
  variant?: 'default' | 'compact' | 'hero';
  title?: string;
  description?: string;
  showBenefits?: boolean;
  className?: string;
}

export default function Newsletter({
  variant = 'default',
  title = 'Join Our Newsletter',
  description = 'Get exclusive insights, industry trends, and special offers delivered to your inbox',
  showBenefits = true,
  className = '',
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setStatus('idle');

    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setMessage("You're subscribed! Check your inbox for updates.");
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    'Weekly industry insights',
    'Exclusive tips & tutorials',
    'Early access to new products',
    'Special subscriber-only discounts',
  ];

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            disabled={isSubmitting || status === 'success'}
            className={`flex-1 px-4 py-3 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition-all disabled:opacity-50`}
            aria-label="Email address"
            aria-invalid={!!error}
          />
          <button
            type="submit"
            disabled={isSubmitting || status === 'success'}
            className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-black font-semibold rounded-lg hover:from-platinum hover:to-white transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Subscribing...
              </>
            ) : status === 'success' ? (
              <>
                <Check size={20} />
                Subscribed!
              </>
            ) : (
              <>
                <Mail size={20} />
                Subscribe
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}

        {status === 'success' && (
          <p className="mt-2 text-green-400 text-sm flex items-center gap-1">
            <Check size={14} /> {message}
          </p>
        )}

        {status === 'error' && (
          <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
            <AlertCircle size={14} /> {message}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`card-premium text-center ${className}`}>
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 glow">
            <Gift className="text-black" size={32} />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">{title}</h2>
          <p className="text-gray-400 text-lg mb-8">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting || status === 'success'}
                className="flex-1 px-5 py-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition-all disabled:opacity-50"
                aria-label="Name"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isSubmitting || status === 'success'}
                required
                className={`flex-1 px-5 py-4 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition-all disabled:opacity-50`}
                aria-label="Email address"
                aria-invalid={!!error}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || status === 'success'}
              className="w-full py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold text-lg rounded-lg hover:from-platinum hover:to-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <Check size={24} />
                  You're Subscribed!
                </>
              ) : (
                <>
                  <Mail size={24} />
                  Subscribe Free
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="mt-4 text-red-400 flex items-center justify-center gap-2">
              <AlertCircle size={18} /> {error}
            </p>
          )}

          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
              <p className="text-green-200 flex items-center justify-center gap-2">
                <Check size={18} /> {message}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-200 flex items-center justify-center gap-2">
                <AlertCircle size={18} /> {message}
              </p>
            </div>
          )}

          <p className="mt-4 text-gray-500 text-sm">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`card bg-gradient-to-br from-gold/10 to-sapphire/10 border-gold ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center glow">
            <Mail className="text-black" size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold gradient-text">{title}</h3>
        </div>

        <p className="text-gray-400 mb-6">{description}</p>

        {showBenefits && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300">
                <Check className="text-gold flex-shrink-0" size={18} />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={isSubmitting || status === 'success'}
              required
              className={`flex-1 px-4 py-3 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold transition-all disabled:opacity-50`}
              aria-label="Email address"
              aria-invalid={!!error}
            />
            <button
              type="submit"
              disabled={isSubmitting || status === 'success'}
              className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-platinum transition-all duration-300 hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Subscribing...
                </>
              ) : status === 'success' ? (
                <>
                  <Check size={20} />
                  Subscribed!
                </>
              ) : (
                <>Subscribe Free</>
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm flex items-center justify-center gap-1">
              <AlertCircle size={14} /> {error}
            </p>
          )}

          {status === 'success' && (
            <p className="text-green-400 text-sm flex items-center justify-center gap-1">
              <Check size={14} /> {message}
            </p>
          )}

          {status === 'error' && (
            <p className="text-red-400 text-sm flex items-center justify-center gap-1">
              <AlertCircle size={14} /> {message}
            </p>
          )}
        </form>

        <p className="text-gray-500 text-sm mt-4">
          Join 1,000+ subscribers. No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

