/**
 * Dynamic Pricing Engine
 * Auto-adjust prices based on demand, velocity, and experiments
 */

export interface PricingRule {
  id: string;
  productId: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  rules: {
    velocity?: { salesPerDay: number; multiplier: number }[];
    timeOfDay?: { hours: number[]; multiplier: number }[];
    inventory?: { threshold: number; multiplier: number }[];
    seasonality?: { month: number[]; multiplier: number }[];
  };
  active: boolean;
}

export interface ProductMetrics {
  productId: string;
  salesPerDay: number;
  lastSaleTime: number;
  inventoryLevel: number;
  weekTrend: number; // -1 to 1
  conversionRate: number;
}

export class PricingEngine {
  private rules: Map<string, PricingRule> = new Map();
  private metrics: Map<string, ProductMetrics> = new Map();
  private priceHistory: Map<string, Array<{ price: number; timestamp: number }>> = new Map();

  /**
   * Create pricing rule for product
   */
  createRule(rule: Omit<PricingRule, 'id'>): PricingRule {
    const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullRule: PricingRule = { ...rule, id };

    this.rules.set(rule.productId, fullRule);
    this.priceHistory.set(rule.productId, [{ price: rule.basePrice, timestamp: Date.now() }]);

    return fullRule;
  }

  /**
   * Update product metrics
   */
  updateMetrics(metrics: ProductMetrics): void {
    this.metrics.set(metrics.productId, metrics);
  }

  /**
   * Calculate dynamic price
   */
  calculatePrice(productId: string): number {
    const rule = this.rules.get(productId);
    const metrics = this.metrics.get(productId);

    if (!rule || !metrics || !rule.active) {
      return rule?.basePrice || 0;
    }

    let multiplier = 1;
    const now = new Date();

    // Velocity-based pricing
    if (rule.rules.velocity) {
      for (const velocity of rule.rules.velocity) {
        if (metrics.salesPerDay >= velocity.salesPerDay) {
          multiplier *= velocity.multiplier;
        }
      }
    }

    // Time-of-day pricing
    if (rule.rules.timeOfDay) {
      const hour = now.getHours();
      for (const timeRule of rule.rules.timeOfDay) {
        if (timeRule.hours.includes(hour)) {
          multiplier *= timeRule.multiplier;
        }
      }
    }

    // Inventory-based pricing
    if (rule.rules.inventory) {
      for (const invRule of rule.rules.inventory) {
        if (metrics.inventoryLevel <= invRule.threshold) {
          multiplier *= invRule.multiplier;
        }
      }
    }

    // Seasonal pricing
    if (rule.rules.seasonality) {
      const month = now.getMonth();
      for (const seasonRule of rule.rules.seasonality) {
        if (seasonRule.month.includes(month)) {
          multiplier *= seasonRule.multiplier;
        }
      }
    }

    // Apply multiplier with min/max bounds
    let finalPrice = rule.basePrice * multiplier;
    finalPrice = Math.max(rule.minPrice, Math.min(rule.maxPrice, finalPrice));

    // Round to nearest cent
    finalPrice = Math.round(finalPrice * 100) / 100;

    // Record in history
    const history = this.priceHistory.get(productId) || [];
    if (history[history.length - 1]?.price !== finalPrice) {
      history.push({ price: finalPrice, timestamp: Date.now() });
      this.priceHistory.set(productId, history);
    }

    return finalPrice;
  }

  /**
   * Get price history
   */
  getPriceHistory(
    productId: string,
    hoursBack: number = 24
  ): Array<{ price: number; timestamp: number }> {
    const history = this.priceHistory.get(productId) || [];
    const cutoff = Date.now() - hoursBack * 60 * 60 * 1000;

    return history.filter((h) => h.timestamp >= cutoff);
  }

  /**
   * Recommend price based on metrics
   */
  recommendPrice(productId: string): { current: number; recommended: number; reason: string } {
    const metrics = this.metrics.get(productId);
    const rule = this.rules.get(productId);

    if (!metrics || !rule) {
      return {
        current: rule?.basePrice || 0,
        recommended: rule?.basePrice || 0,
        reason: 'No data available',
      };
    }

    const current = this.calculatePrice(productId);
    let recommended = rule.basePrice;
    let reason = 'Baseline pricing';

    // High velocity → increase price
    if (metrics.salesPerDay > 10) {
      recommended = rule.basePrice * 1.15;
      reason = 'High demand detected';
    }

    // Low conversion → decrease price
    if (metrics.conversionRate < 0.02) {
      recommended = rule.basePrice * 0.85;
      reason = 'Low conversion, reduce friction';
    }

    // Positive trend → increase price
    if (metrics.weekTrend > 0.5) {
      recommended = Math.min(rule.maxPrice, recommended * 1.1);
      reason = 'Positive momentum, increase price';
    }

    // Apply bounds
    recommended = Math.max(rule.minPrice, Math.min(rule.maxPrice, recommended));

    return {
      current,
      recommended: Math.round(recommended * 100) / 100,
      reason,
    };
  }

  /**
   * Auto-disable low performers
   */
  identifyLowPerformers(minConversionRate: number = 0.01): string[] {
    const lowPerformers: string[] = [];

    for (const [productId, metrics] of this.metrics) {
      if (metrics.conversionRate < minConversionRate && metrics.salesPerDay < 1) {
        lowPerformers.push(productId);
      }
    }

    return lowPerformers;
  }

  /**
   * Get top products
   */
  getTopProducts(limit: number = 5): Array<{ productId: string; salesPerDay: number }> {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.salesPerDay - a.salesPerDay)
      .slice(0, limit)
      .map((m) => ({ productId: m.productId, salesPerDay: m.salesPerDay }));
  }
}

// Singleton
let engine: PricingEngine | null = null;

export function getPricingEngine(): PricingEngine {
  if (!engine) {
    engine = new PricingEngine();
  }
  return engine;
}

