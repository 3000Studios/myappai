/**
 * Subscription & Entitlements System
 * Enforces tier-gated features and subscription logic
 */

export interface UserEntitlements {
  userId: string;
  tier: string;
  subscriptionActive: boolean;
  subscriptionExpiresAt?: number;
  gracePeriodExpiresAt?: number;
  features: Set<string>;
}

export const tierFeatures: Record<string, string[]> = {
  free: ['view_projects', 'read_blog', 'public_gallery'],
  pro: [
    ...['view_projects', 'read_blog', 'public_gallery'],
    'voice_commands_50',
    'advanced_analytics',
    'priority_support',
  ],
  godMode: [
    ...[
      'view_projects',
      'read_blog',
      'public_gallery',
      'voice_commands_50',
      'advanced_analytics',
      'priority_support',
    ],
    'unlimited_voice_commands',
    'white_label',
    'custom_integrations',
    'instant_deploy',
    'revenue_ai',
    'live_voice_dashboard',
    'audit_logs',
  ],
};

export class EntitlementManager {
  private entitlements: Map<string, UserEntitlements> = new Map();

  /**
   * Create entitlements for user
   */
  createEntitlements(userId: string, tier: string = 'free'): UserEntitlements {
    const features = new Set(tierFeatures[tier] || tierFeatures.free);

    const entitlements: UserEntitlements = {
      userId,
      tier,
      subscriptionActive: tier !== 'free',
      subscriptionExpiresAt: tier !== 'free' ? Date.now() + 30 * 24 * 60 * 60 * 1000 : undefined,
      features,
    };

    this.entitlements.set(userId, entitlements);
    return entitlements;
  }

  /**
   * Get user entitlements
   */
  getEntitlements(userId: string): UserEntitlements | null {
    return this.entitlements.get(userId) || null;
  }

  /**
   * Check if user has feature
   */
  hasFeature(userId: string, feature: string): boolean {
    const entitlements = this.getEntitlements(userId);
    if (!entitlements) return false;

    // Check subscription status
    if (entitlements.subscriptionExpiresAt && entitlements.subscriptionExpiresAt < Date.now()) {
      if (!entitlements.gracePeriodExpiresAt || entitlements.gracePeriodExpiresAt < Date.now()) {
        // Subscription expired, downgrade to free
        this.downgradeTier(userId, 'free');
        return tierFeatures.free.includes(feature);
      }
    }

    return entitlements.features.has(feature);
  }

  /**
   * Upgrade tier
   */
  upgradeTier(userId: string, newTier: string): boolean {
    const entitlements = this.getEntitlements(userId);
    if (!entitlements) return false;

    entitlements.tier = newTier;
    entitlements.subscriptionActive = newTier !== 'free';
    entitlements.subscriptionExpiresAt =
      newTier !== 'free' ? Date.now() + 30 * 24 * 60 * 60 * 1000 : undefined;
    entitlements.features = new Set(tierFeatures[newTier] || tierFeatures.free);

    return true;
  }

  /**
   * Downgrade tier (e.g., on subscription expiry)
   */
  downgradeTier(userId: string, newTier: string = 'free'): boolean {
    const entitlements = this.getEntitlements(userId);
    if (!entitlements) return false;

    entitlements.tier = newTier;
    entitlements.subscriptionActive = false;
    entitlements.subscriptionExpiresAt = undefined;
    entitlements.features = new Set(tierFeatures[newTier] || tierFeatures.free);

    return true;
  }

  /**
   * Start grace period for expiring subscriptions
   */
  startGracePeriod(userId: string, durationMs: number = 7 * 24 * 60 * 60 * 1000): void {
    const entitlements = this.getEntitlements(userId);
    if (entitlements) {
      entitlements.gracePeriodExpiresAt = Date.now() + durationMs;
    }
  }

  /**
   * Check if subscription is expiring soon
   */
  isExpiringSoon(userId: string, thresholdMs: number = 7 * 24 * 60 * 60 * 1000): boolean {
    const entitlements = this.getEntitlements(userId);
    if (!entitlements?.subscriptionExpiresAt) return false;

    const timeUntilExpiry = entitlements.subscriptionExpiresAt - Date.now();
    return timeUntilExpiry > 0 && timeUntilExpiry < thresholdMs;
  }

  /**
   * Get upsell recommendation
   */
  getUpsellOption(userId: string): string | null {
    const entitlements = this.getEntitlements(userId);
    if (!entitlements) return null;

    // Free → Pro recommendation
    if (entitlements.tier === 'free' && !entitlements.subscriptionActive) {
      return 'pro';
    }

    // Pro → God Mode recommendation
    if (entitlements.tier === 'pro' && entitlements.subscriptionActive) {
      return 'godMode';
    }

    return null;
  }

  /**
   * Enforce access (throw error if not entitled)
   */
  enforceFeature(userId: string, feature: string): void {
    if (!this.hasFeature(userId, feature)) {
      const tier = this.getEntitlements(userId)?.tier || 'free';
      const upsell = this.getUpsellOption(userId);
      throw new Error(
        `Feature "${feature}" requires ${tier === 'free' ? 'a Pro subscription or higher' : 'God Mode'}.${upsell ? ` Upgrade to ${upsell}` : ''}`
      );
    }
  }
}

// Singleton
let manager: EntitlementManager | null = null;

export function getEntitlementManager(): EntitlementManager {
  if (!manager) {
    manager = new EntitlementManager();
  }
  return manager;
}

