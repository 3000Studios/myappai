/**
 * Affiliate System
 * Inject affiliate links and track commissions
 */

export interface AffiliateProduct {
  id: string;
  name: string;
  affiliateLink: string;
  commission: number;
  commissionType: 'percentage' | 'fixed';
  platform: 'amazon' | 'clickbank' | 'gumroad' | 'custom';
  category: string;
}

export const affiliateProducts: AffiliateProduct[] = [
  {
    id: 'hosting_1',
    name: 'Hostinger Premium',
    affiliateLink: 'https://hostinger.com?REFERRALCODE=JWSWAIN',
    commission: 20,
    commissionType: 'percentage',
    platform: 'custom',
    category: 'Hosting',
  },
  {
    id: 'ai_tool_1',
    name: 'Jasper AI',
    affiliateLink: 'https://jasper.ai?ref=jwswain',
    commission: 30,
    commissionType: 'percentage',
    platform: 'custom',
    category: 'AI Tools',
  },
  {
    id: 'design_tool_1',
    name: 'Canva Pro',
    affiliateLink: 'https://canva.com/pro?ref=3000studios',
    commission: 15,
    commissionType: 'percentage',
    platform: 'custom',
    category: 'Design',
  },
];

// Affiliate link generators for revenue pages
export const AFFILIATES = {
  general: (url: string) => `${url}?ref=jwswain`,
  amazon: (asin: string) => `https://www.amazon.com/dp/${asin}?tag=jwswain-20`,
  clickbank: (product: string) => `https://hop.clickbank.net/?affiliate=jwswain&vendor=${product}`,
  gumroad: (product: string) => `https://gumroad.com/l/${product}?wanted=true&referrer=jwswain`,
};

export function getAffiliateProduct(id: string): AffiliateProduct | undefined {
  return affiliateProducts.find((p) => p.id === id);
}

export function getAffiliateProductsByCategory(category: string): AffiliateProduct[] {
  return affiliateProducts.filter((p) => p.category === category);
}

export function injectAffiliateLink(
  content: string,
  keywords: string[],
  affiliateLink: string
): string {
  let result = content;
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    result = result.replace(
      regex,
      `<a href="${affiliateLink}" target="_blank" rel="noopener noreferrer sponsored">${keyword}</a>`
    );
  });
  return result;
}

export function trackAffiliateClick(affiliateId: string): void {
  // Track affiliate click for commission attribution
  if (typeof window !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'affiliate_click',
        properties: {
          affiliateId,
          timestamp: Date.now(),
        },
      }),
    }).catch((err) => console.error('', err));
  }
}
