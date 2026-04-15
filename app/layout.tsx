/**
 * Root Layout Component
 * Main layout wrapper for the entire application.
 * REVENUE LOCK — Contains AdSense, consent, and monetization infrastructure.
 * PERFORMANCE OPTIMIZED — Lazy loads heavy components via ClientEffects
 */

import ConsentBanner from '@/components/ConsentBanner';
import IntroVideoGate from '@/components/IntroVideoGate';
import StockMarquee from '@/components/StockMarquee';
import VideoBackground from '@/components/VideoBackground';
import { styleRegistry } from '@/lib/styleRegistry';
import { AppProviders } from '@/providers/AppProviders';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import '../styles/elite.css';
import '../styles/user-animations.css';
import ClientEffects from './components/ClientEffects';
import GravityFooter from './components/GravityFooter';
import './globals.css';
import { Playfair_Display } from 'next/font/google';
import GreetingAvatar from '@/components/GreetingAvatar';
import Nav from './ui/Nav';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// ============================================
// METADATA & SEO
// ============================================
const RAW_ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const ADSENSE_ACCOUNT = RAW_ADSENSE_ID
  ? RAW_ADSENSE_ID.startsWith('ca-pub-')
    ? RAW_ADSENSE_ID
    : `ca-pub-${RAW_ADSENSE_ID}`
  : undefined;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://3000studios.com'),
  title: {
    default: '3000 Studios - Award-Winning Creative Studio',
    template: '%s | 3000 Studios',
  },
  description:
    'Premium digital experiences, innovative solutions, and transformative projects. 250+ successful clients worldwide with 99% satisfaction rate. Specializing in AI-powered solutions, live streaming, and cutting-edge web development.',
  keywords: [
    'creative studio',
    'digital agency',
    'web development',
    'premium design',
    'innovation',
    '3D experiences',
    'AI solutions',
    'live streaming',
    'e-commerce',
    'luxury brand',
  ],
  authors: [{ name: '3000 Studios' }],
  creator: '3000 Studios',
  publisher: '3000 Studios',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://3000studios.vercel.app',
    siteName: '3000 Studios',
    title: '3000 Studios - Award-Winning Creative Studio',
    description:
      'Premium digital experiences and innovative solutions. 250+ successful clients worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '3000 Studios - Premium Creative Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@3000studios',
    creator: '@3000studios',
    title: '3000 Studios - Award-Winning Creative Studio',
    description: 'Premium digital experiences and innovative solutions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://3000studios.com',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || 'google-verification-code',
  },
  other: ADSENSE_ACCOUNT ? { 'google-adsense-account': ADSENSE_ACCOUNT } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://cdn.pixabay.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* DNS prefetch for third-party scripts */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body
        className={`${playfair.variable} font-serif flex min-h-screen w-full flex-col bg-black antialiased`}
        data-accent={styleRegistry.accent}
      >
        {/* Google AdSense Auto Ads - Load after initial hydration for best revenue */}
        {ADSENSE_ACCOUNT ? (
          <Script
            id="adsense"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ACCOUNT}`}
            crossOrigin="anonymous"
          />
        ) : null}

        <AppProviders>
          <VideoBackground
            src="https://res.cloudinary.com/dj92eb97f/video/upload/v1767519946/3843427-uhd_2160_4096_25fps_ggqwby.mp4"
            opacity={0.3}
          />
          <IntroVideoGate>
            {/* Navigation - Critical, loads immediately */}
            <Nav />
            {/* Main content - Critical path, auto-sizes to viewport */}
            <main className="relative z-10 flex-1 w-full pt-28 flex flex-col items-stretch">
              {children}
            </main>
            <StockMarquee />
            {/* Footer - Critical for SEO */}
            <GravityFooter />
            {/* Greeting AI Avatar - Phase 65 */}
            <GreetingAvatar />
            {/* Consent Banner - Important for compliance */}
            <ConsentBanner />
            {/* Analytics - Load after content */}
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
            {/* Non-critical visual effects - lazy loaded via Client Component */}
            <ClientEffects />
          </IntroVideoGate>
        </AppProviders>
      </body>
    </html>
  );
}
