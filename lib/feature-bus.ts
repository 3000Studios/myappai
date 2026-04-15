/**
 * Global Feature Bus
 * Registry and controller for all platform features
 */

'use client';

import { create } from 'zustand';

export interface Feature {
  name: string;
  permissions: string[];
  mount: string[];
  enabled: boolean;
  config?: Record<string, unknown>;
}

interface FeatureBusState {
  features: Map<string, Feature>;
  registerFeature: (feature: Feature) => void;
  enableFeature: (name: string) => void;
  disableFeature: (name: string) => void;
  isFeatureEnabled: (name: string, route?: string) => boolean;
  getFeatureConfig: (name: string) => Record<string, unknown> | undefined;
}

export const useFeatureBus = create<FeatureBusState>((set, get) => ({
  features: new Map([
    [
      'LiveAvatar',
      {
        name: 'LiveAvatar',
        permissions: ['admin', 'public'],
        mount: ['/', '/about', '/jws'],
        enabled: true,
      },
    ],
    [
      'AISalesChat',
      {
        name: 'AISalesChat',
        permissions: ['public'],
        mount: ['/', '/store', '/apps', '/revenue'],
        enabled: true,
      },
    ],
    [
      'VideoBackground',
      { name: 'VideoBackground', permissions: ['public'], mount: ['*'], enabled: true },
    ],
    ['VoiceControl', { name: 'VoiceControl', permissions: ['admin'], mount: ['*'], enabled: true }],
    ['Analytics', { name: 'Analytics', permissions: ['public'], mount: ['*'], enabled: true }],
  ]),

  registerFeature: (feature) => {
    set((state) => {
      const newFeatures = new Map(state.features);
      newFeatures.set(feature.name, feature);
      return { features: newFeatures };
    });
  },

  enableFeature: (name) => {
    set((state) => {
      const newFeatures = new Map(state.features);
      const feature = newFeatures.get(name);
      if (feature) {
        newFeatures.set(name, { ...feature, enabled: true });
      }
      return { features: newFeatures };
    });
  },

  disableFeature: (name) => {
    set((state) => {
      const newFeatures = new Map(state.features);
      const feature = newFeatures.get(name);
      if (feature) {
        newFeatures.set(name, { ...feature, enabled: false });
      }
      return { features: newFeatures };
    });
  },

  isFeatureEnabled: (name, route) => {
    const features = get().features;
    const feature = features.get(name);
    if (!feature || !feature.enabled) return false;
    if (!route) return true;
    if (feature.mount.includes('*')) return true;
    return feature.mount.includes(route);
  },

  getFeatureConfig: (name) => {
    const features = get().features;
    return features.get(name)?.config;
  },
}));

