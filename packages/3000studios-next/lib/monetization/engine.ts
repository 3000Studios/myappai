// 3000 Studios - Monetization Engine (Phase 34-60)
// Autonomous revenue loops: Product injection, Affiliate links, Scarcity triggers.

import { uiRegistry } from '../uiRegistry';

type Product = {
  id: string;
  name: string;
  price: number;
  url: string;
  affiliateId?: string;
  category: 'tool' | 'course' | 'service';
};

const PRODUCT_CATALOG: Product[] = [
  {
    id: 'prod_001',
    name: 'AI Automation Toolkit',
    price: 97,
    url: '/store/ai-toolkit',
    category: 'tool',
  },
  {
    id: 'prod_002',
    name: '3D Web Design Masterclass',
    price: 297,
    url: '/store/3d-masterclass',
    category: 'course',
  },
  {
    id: 'prod_003',
    name: 'Premium Code Review',
    price: 499,
    url: '/store/code-review',
    category: 'service',
  },
];

export const amortizationEngine = {
  // Phase 34: Live Stream Product Sync
  injectLiveProduct: (productId: string) => {
    const product = PRODUCT_CATALOG.find((p) => p.id === productId);
    if (!product) return;

    // Inject into UI Registry directly with type assertion
    (uiRegistry as Record<string, unknown>).liveStream = {
      ...(typeof uiRegistry.liveStream === 'object' ? uiRegistry.liveStream : {}),
      activeProduct: product,
      showCta: true,
    };

    // Trigger update event
    window.dispatchEvent(
      new CustomEvent('monetization-update', {
        detail: { type: 'live-product', product },
      })
    );
  },

  // Phase 35: Continuous Sales Loop (Countdown/Urgency)
  triggerScarcity: (minutes: number) => {
    window.dispatchEvent(
      new CustomEvent('monetization-update', {
        detail: { type: 'scarcity', duration: minutes * 60 },
      })
    );
  },

  // Phase 37: AI Sales Agent Upsell
  getUpsellRecommendation: (currentContext: string): Product | null => {
    // Simple logic for now, can be replaced with AI model call
    if (currentContext.includes('code')) return PRODUCT_CATALOG[2]; // Code Review
    if (currentContext.includes('design')) return PRODUCT_CATALOG[1]; // Design Course
    return PRODUCT_CATALOG[0]; // Default Toolkit
  },
};

