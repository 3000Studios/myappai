export const VENDORS = {
  CJ: {
    id: 'cj',
    name: 'Commission Junction',
    commission: 0.1,
    feedUrlEnv: 'VENDOR_FEED_URL_CJ',
  },
  SHAREASALE: {
    id: 'shareasale',
    name: 'ShareASale',
    commission: 0.12,
    feedUrlEnv: 'VENDOR_FEED_URL_SHAREASALE',
  },
  AMAZON: {
    id: 'amazon',
    name: 'Amazon Associates',
    commission: 0.04,
    feedUrlEnv: 'VENDOR_FEED_URL_AMAZON',
  },
  SHOPIFY: {
    id: 'shopify',
    name: 'Shopify',
    commission: 0.08,
    feedUrlEnv: 'VENDOR_FEED_URL_SHOPIFY',
  },
  CUSTOM: {
    id: 'custom',
    name: 'Direct Vendor',
    commission: 0.2,
    feedUrlEnv: 'VENDOR_FEED_URL',
  },
} as const;

export type VendorKey = keyof typeof VENDORS;

