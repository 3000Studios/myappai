/**
 * Pricing Optimizer (AI-Driven)
 * Adjusts base price by demand signals
 */

export function dynamicPricing(basePrice: number, demandScore: number): number {
  // demandScore: 0.0 to 1.0 (0 = low traffic/conversion, 1 = viral)

  if (demandScore > 0.8) {
    // High demand: +25% premium (Psychological "Scarce/Premium" signal)
    return Math.ceil(basePrice * 1.25);
  }

  if (demandScore < 0.3) {
    // Low demand: -15% discount (Acquisition mode)
    // Ensure we don't drop below margin floor (simplified here)
    return Math.floor(basePrice * 0.85);
  }

  // Stable demand
  return basePrice;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

