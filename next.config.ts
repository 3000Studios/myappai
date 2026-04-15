import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

import path from 'path';

const nextConfig: NextConfig = {
  // This helps Next.js correctly infer the workspace root when multiple lockfiles exist
  outputFileTracingRoot: path.resolve(__dirname),

  // Standalone output for smallest deploy bundle
  output: 'standalone',

  // React strict mode for robust dev
  reactStrictMode: true,

  // Explicit Turbopack declaration (required for Next.js 16+)
  turbopack: {},

  // Webpack compatibility layer (non-invasive)
  webpack: (config: any) => {
    return config;
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Optimized headers for performance + caching
  headers: async () => [
    {
      // Cache static assets aggressively
      source: '/static/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      // Cache images
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
      ],
    },
    {
      // Cache fonts
      source: '/fonts/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      // Cache JS/CSS bundles
      source: '/_next/static/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      // Default: short cache with revalidation for dynamic pages
      source: '/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=300' }],
    },
  ],

  // Optimized image handling
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'models.readyplayer.me' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
    // Modern formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimize device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimize image processing
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable gzip/brotli compression
  compress: true,

  // Reduce unused JavaScript
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'framer-motion': {
      transform: 'framer-motion/dist/es/{{member}}',
      skipDefaultConversion: true,
    },
  },

  // Experimental optimizations
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      '@react-three/drei',
      '@react-three/fiber',
      'three',
      'framer-motion',
      'lucide-react',
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
