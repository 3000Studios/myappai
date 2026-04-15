'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'ACCESS DENIED');
        setLoading(false);
      } else {
        router.push(searchParams?.get('callbackUrl') || '/admin');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setError('SYSTEM ERROR: CONNECTION FAILED');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 font-mono flex items-center justify-center relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dj92eb97f/image/upload/v1767519946/noise_y8x1q6.png')] opacity-[0.03]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          {/* Border glow */}
          <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-3xl pointer-events-none group-hover:border-[#D4AF37]/40 transition-colors" />

          <div className="text-center mb-8">
            <div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]" />
            <h1 className="text-2xl font-black uppercase text-[#D4AF37] tracking-widest">
              SYSTEM LOGIN
            </h1>
            <p className="text-[10px] text-gray-500 mt-2 tracking-[0.3em]">
              SECURE GATEWAY v3.0 // 3000 STUDIOS
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70">
                Identity
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#D4AF37] text-[#D4AF37] text-sm tracking-wider transition-all placeholder:text-gray-700"
                placeholder="ENTER EMAIL"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70">
                Security Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[#D4AF37] text-[#D4AF37] text-sm tracking-wider transition-all placeholder:text-gray-700"
                placeholder="ENTER PASSWORD"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-500 text-[10px] text-center font-bold tracking-wider">
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-xl hover:bg-[#b5952f] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'AUTHENTICATING...' : 'INITIATE CONNECTION'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

