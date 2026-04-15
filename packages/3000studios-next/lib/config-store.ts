/**
 * Real-Time Config Store
 * Hot-reloadable configuration without redeploys
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SiteConfig {
  branding: {
    siteName: string;
    tagline: string;
    logo: string;
    favicon: string;
  };
  theme: {
    default: string;
    pageOverrides: Record<string, string>;
  };
  media: {
    heroVideo: string;
    backgroundVideos: string[];
    splashVideo: string;
  };
  monetization: {
    adsEnabled: boolean;
    affiliateEnabled: boolean;
    checkoutProvider: 'stripe' | 'paypal' | 'both';
    pricingTiers: Array<{
      name: string;
      price: number;
      interval: 'monthly' | 'yearly' | 'lifetime';
    }>;
  };
  features: {
    voiceControl: boolean;
    aiChat: boolean;
    liveAvatar: boolean;
    analytics: boolean;
    blog: boolean;
    store: boolean;
  };
  performance: {
    enableGPUAcceleration: boolean;
    imageFormat: 'webp' | 'avif' | 'auto';
    videoBitrate: 'high' | 'medium' | 'low' | 'auto';
  };
  autonomousMode: {
    enabled: boolean;
    tasks: string[];
    schedule: string;
  };
}

const defaultConfig: SiteConfig = {
  branding: {
    siteName: '3000 Studios',
    tagline: 'Award-Winning Creative Studio',
    logo: 'https://res.cloudinary.com/dj92eb97f/image/upload/v1767046287/new_logo-min_zd44u2.png',
    favicon: '/favicon.ico',
  },
  theme: {
    default: 'marble',
    pageOverrides: {},
  },
  media: {
    heroVideo: 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
    backgroundVideos: [
      'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
    ],
    splashVideo: 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
  },
  monetization: {
    adsEnabled: true,
    affiliateEnabled: true,
    checkoutProvider: 'stripe',
    pricingTiers: [
      { name: 'Monthly', price: 29, interval: 'monthly' },
      { name: 'Yearly', price: 299, interval: 'yearly' },
      { name: 'Lifetime', price: 999, interval: 'lifetime' },
    ],
  },
  features: {
    voiceControl: true,
    aiChat: true,
    liveAvatar: true,
    analytics: true,
    blog: true,
    store: true,
  },
  performance: {
    enableGPUAcceleration: true,
    imageFormat: 'auto',
    videoBitrate: 'auto',
  },
  autonomousMode: {
    enabled: false,
    tasks: ['build', 'optimize', 'publish'],
    schedule: 'hourly',
  },
};

interface ConfigStoreState extends SiteConfig {
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => void;
}

export const useConfigStore = create<ConfigStoreState>()(
  persist(
    (set, get) => ({
      ...defaultConfig,

      updateConfig: (updates) => {
        set((state) => ({
          ...state,
          ...updates,
        }));
      },

      resetConfig: () => {
        set(defaultConfig);
      },

      exportConfig: () => {
        const config = get();
        const { updateConfig, resetConfig, exportConfig, importConfig, ...data } = config;
        return JSON.stringify(data, null, 2);
      },

      importConfig: (json) => {
        try {
          const imported = JSON.parse(json);
          set(imported);
        } catch (error: unknown) {
          console.error("", error);
        }
      },
    }),
    { name: 'site-config' }
  )
);

