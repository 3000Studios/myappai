'use client';

import { AlertCircle, Lock } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const JWS_PASSWORD = '88888888';

export default function JWSProtectedPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === JWS_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Background Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sapphire rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <div className="card">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full mb-4">
                <Lock className="text-black" size={32} />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">JWS Protected Area</h1>
              <p className="text-gray-400">Welcome, Boss Man J!</p>
            </div>

            <div className="space-y-6">
              {/* Private Content */}
              <div className="p-6 bg-gray-900 rounded-lg border border-gold/30">
                <h2 className="text-2xl font-bold text-gold mb-4">Executive Dashboard</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg">
                    🎯 <strong>Current Status:</strong> All systems operational
                  </p>
                  <p className="text-lg">
                    💼 <strong>Revenue:</strong> Tracking active
                  </p>
                  <p className="text-lg">
                    🚀 <strong>Projects:</strong> On schedule
                  </p>
                  <p className="text-lg">
                    🎨 <strong>Design System:</strong> ETHEREAL v2.0.4
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/matrix')}
                  className="p-4 bg-gradient-to-r from-gold to-platinum rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-black font-bold text-lg">🎛️ Matrix Control</h3>
                  <p className="text-gray-800 text-sm">Access admin panel</p>
                </button>

                <button
                  onClick={() => router.push('/store')}
                  className="p-4 bg-gradient-to-r from-sapphire to-cyan-600 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-white font-bold text-lg">🛍️ Store Management</h3>
                  <p className="text-gray-200 text-sm">View products & orders</p>
                </button>

                <button
                  onClick={() => router.push('/live')}
                  className="p-4 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-white font-bold text-lg">📺 Live Streaming</h3>
                  <p className="text-gray-200 text-sm">Manage broadcasts</p>
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-white font-bold text-lg">🏠 Home</h3>
                  <p className="text-gray-200 text-sm">Back to main site</p>
                </button>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  🔒 <strong>Security Notice:</strong> This area is password protected. Keep your
                  credentials secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sapphire rounded-full filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-full mb-4">
              <Lock className="text-black" size={32} />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">JWS Protected Area</h1>
            <p className="text-gray-400">Enter password to access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Enter password"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold text-black font-bold rounded-lg hover:bg-platinum transition-all duration-300 hover:shadow-lg"
            >
              Access Protected Area
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">🔒 JWS Protected • Authorized Access Only</p>
          </div>
        </div>
      </div>
    </div>
  );
}

