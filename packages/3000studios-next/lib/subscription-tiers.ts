/**
 * Subscription Tiers Configuration
 * REVENUE LOCK — DO NOT MODIFY
 * Defines monetization structure for the platform
 */

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      'Ads shown',
      'Limited tools (10/day)',
      'Email capture',
      'Basic templates',
      'Community support',
    ],
    limits: {
      api_calls: 10,
      storage_gb: 1,
      projects: 3,
    },
  },
  PRO: {
    name: 'Pro',
    price: 19,
    priceYearly: 190, // ~2 months free
    interval: 'month',
    features: [
      'No ads',
      'Premium content',
      'Unlimited tools',
      'Advanced dashboards',
      'Priority support',
      'Custom branding',
      'API access (1000 calls/mo)',
    ],
    limits: {
      api_calls: 1000,
      storage_gb: 50,
      projects: 25,
    },
    stripe_price_id: process.env.STRIPE_PRO_PRICE_ID,
  },
  BUSINESS: {
    name: 'Business',
    price: 49,
    priceYearly: 490,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration (up to 10 users)',
      'Advanced analytics',
      'White-label options',
      'API access (10,000 calls/mo)',
      'Dedicated support',
      'Custom integrations',
    ],
    limits: {
      api_calls: 10000,
      storage_gb: 250,
      projects: 100,
      team_members: 10,
    },
    stripe_price_id: process.env.STRIPE_BUSINESS_PRICE_ID,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 'Custom',
    interval: 'custom',
    features: [
      'Everything in Business',
      'Unlimited team members',
      'Unlimited API access',
      'Custom automation',
      'Priority compute',
      'SLA guarantee',
      'Dedicated account manager',
      'Custom development',
    ],
    limits: {
      api_calls: 'unlimited',
      storage_gb: 'unlimited',
      projects: 'unlimited',
      team_members: 'unlimited',
    },
    contact_sales: true,
  },
} as const;

export type TierName = keyof typeof SUBSCRIPTION_TIERS;
export type Tier = (typeof SUBSCRIPTION_TIERS)[TierName];

/**
 * Kill-switch protection
 * If Stripe fails, site continues with ads
 * If ads fail, subscriptions continue
 */
export const REVENUE_FAILSAFE = {
  stripe_fallback: 'show_ads',
  adsense_fallback: 'highlight_subscriptions',
  both_fail: 'basic_access_maintained',
} as const;

