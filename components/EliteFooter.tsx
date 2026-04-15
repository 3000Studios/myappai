// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

'use client';
import React from 'react';

export default function EliteFooter() {
  return (
    <footer className="relative z-10 bg-black/60 backdrop-blur-xl border-t-2 border-gold py-8 mt-20 w-full luxury-border">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-lg">
          © {new Date().getFullYear()} <span className="text-gold font-bold">3000 Studios</span>.
          Powered by <span className="text-platinum font-bold">Shadow AI</span>.
        </p>
        <p className="text-sm text-gray-500 mt-2">Built with Next.js 15 + Vercel + WordPress API</p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a href="/privacy" className="text-platinum/80 hover:text-gold transition">
            Privacy Policy
          </a>
          <a href="/terms" className="text-platinum/80 hover:text-gold transition">
            Terms of Service
          </a>
          <a href="/contact" className="text-platinum/80 hover:text-gold transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

