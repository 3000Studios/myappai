/**
 * Dynamic Pricing System
 * Adaptive pricing based on demand, traffic, and user behavior
 */

'use client';

import { create } from 'zustand';

export interface PricingRule {
  productId: string;
  basePrice: number;
  currentPrice: number;
  rules: {
    demandMultiplier: number;
    trafficThreshold: number;
    timeBasedDiscount?: {
      start: Date;
      end: Date;
      percentage: number;
    };
    behaviorBonus?: {
      returning: number;
      referred: number;
    };
  };
}

interface PricingState {
  rules: Map<string, PricingRule>;
  calculatePrice: (productId: string, context?: any) => number;
  updateRule: (productId: string, updates: Partial<PricingRule>) => void;
  getOptimalPrice: (productId: string) => number;
}

export const usePricingEngine = create<PricingState>((set, get) => ({
  rules: new Map([
    [
      'monthly',
      {
        productId: 'monthly',
        basePrice: 29,
        currentPrice: 29,
        rules: {
          demandMultiplier: 1.0,
          trafficThreshold: 1000,
          behaviorBonus: { returning: 0.9, referred: 0.85 },
        },
      },
    ],
    [
      'yearly',
      {
        productId: 'yearly',
        basePrice: 299,
        currentPrice: 299,
        rules: {
          demandMultiplier: 1.0,
          trafficThreshold: 1000,
          behaviorBonus: { returning: 0.85, referred: 0.8 },
        },
      },
    ],
    [
      'lifetime',
      {
        productId: 'lifetime',
        basePrice: 999,
        currentPrice: 999,
        rules: {
          demandMultiplier: 1.0,
          trafficThreshold: 500,
        },
      },
    ],
  ]),

  calculatePrice: (productId, context = {}) => {
    const rule = get().rules.get(productId);
    if (!rule) return 0;

    let price = rule.basePrice;

    // Apply demand multiplier
    price *= rule.rules.demandMultiplier;

    // Apply time-based discount
    if (rule.rules.timeBasedDiscount) {
      const now = new Date();
      const { start, end, percentage } = rule.rules.timeBasedDiscount;
      if (now >= start && now <= end) {
        price *= 1 - percentage / 100;
      }
    }

    // Apply behavior bonus
    if (context.returning && rule.rules.behaviorBonus) {
      price *= rule.rules.behaviorBonus.returning;
    }
    if (context.referred && rule.rules.behaviorBonus) {
      price *= rule.rules.behaviorBonus.referred;
    }

    return Math.round(price);
  },

  updateRule: (productId, updates) => {
    set((state) => {
      const newRules = new Map(state.rules);
      const existing = newRules.get(productId);
      if (existing) {
        newRules.set(productId, { ...existing, ...updates });
      }
      return { rules: newRules };
    });
  },

  getOptimalPrice: (productId) => {
    return get().calculatePrice(productId);
  },
}));

