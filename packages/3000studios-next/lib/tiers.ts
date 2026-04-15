/**
 * Subscription & Tiered Access System
 * Free, Pro, God Mode tiers with feature gating
 */

export interface Tier {
  id: string;
  name: string;
  displayName: string;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limits: {
    projects?: number;
    storage?: string;
    apiCalls?: number;
    voiceCommands?: number;
    deployments?: number;
  };
  badge?: string;
  color: string;
}

export const tiers: Record<string, Tier> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free',
    price: {
      monthly: 0,
      annual: 0,
    },
    features: [
      'Access to public projects',
      'Basic analytics',
      'Community support',
      '1 project limit',
      'Standard hosting',
    ],
    limits: {
      projects: 1,
      storage: '1GB',
      apiCalls: 1000,
      voiceCommands: 0,
      deployments: 10,
    },
    color: '#808090',
  },

  pro: {
    id: 'pro',
    name: 'pro',
    displayName: 'Pro',
    price: {
      monthly: 49,
      annual: 470, // 2 months free
    },
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      'Voice commands (50/month)',
      'AI-powered insights',
      'Advanced deployment hooks',
    ],
    limits: {
      projects: 999,
      storage: '50GB',
      apiCalls: 100000,
      voiceCommands: 50,
      deployments: 999,
    },
    badge: 'POPULAR',
    color: '#00ffff',
  },

  godMode: {
    id: 'godMode',
    name: 'godMode',
    displayName: 'God Mode',
    price: {
      monthly: 199,
      annual: 1910, // 2 months free
    },
    features: [
      'Everything in Pro',
      'Unlimited voice commands',
      'White-label solutions',
      'Dedicated account manager',
      'Custom integrations',
      'Instant deployment',
      'Revenue optimization AI',
      'Live voice control dashboard',
      'Audit logs & compliance',
      'Rollback safety net',
    ],
    limits: {
      projects: 9999,
      storage: 'Unlimited',
      apiCalls: 9999999,
      voiceCommands: 9999,
      deployments: 9999,
    },
    badge: 'ELITE',
    color: '#00ff88',
  },
};

export function getTier(tierId: string): Tier {
  return tiers[tierId] || tiers.free;
}

export function canAccessFeature(userTier: string, requiredTier: string): boolean {
  const tierOrder = ['free', 'pro', 'godMode'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  return userTierIndex >= requiredTierIndex;
}

export function getTierUpgradeUrl(currentTier: string): string {
  if (currentTier === 'free') return '/store?upgrade=pro';
  if (currentTier === 'pro') return '/store?upgrade=godMode';
  return '/store';
}

