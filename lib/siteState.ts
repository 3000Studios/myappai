/**
 * Global Site State
 * Single source of truth for all site features
 */

export const siteState = {
  mode: 'production' as 'production' | 'development',

  monetization: {
    ads: true,
    affiliates: true,
    subscriptions: true,
  },

  voice: {
    enabled: true,
    permissions: 'admin-only' as 'public' | 'admin-only',
  },

  live: {
    stream: true,
    chat: true,
  },

  avatars: {
    enabled: true,
    provider: 'readyplayerme' as 'readyplayerme' | 'custom',
  },

  features: {
    blog: true,
    store: true,
    portfolio: true,
    analytics: true,
  },
};

export function updateSiteState(updates: Partial<typeof siteState>) {
  Object.assign(siteState, updates);
}

