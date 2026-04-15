'use client';

/**
 * 404 Not Found Page
 * Custom error page for missing routes
 */

'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#E5E4E2] to-[#0F52BA] mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#0F52BA] text-black font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-[#E5E4E2] animate-pulse delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-[#0F52BA] animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}

