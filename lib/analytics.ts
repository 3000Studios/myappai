/**
 * Conversion Analytics System
 * Track funnel events, conversions, and revenue optimization
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface ConversionEvent {
  event:
    | 'page_view'
    | 'cta_click'
    | 'add_to_cart'
    | 'checkout_start'
    | 'purchase'
    | 'signup'
    | 'upgrade';
  page?: string;
  value?: number;
  currency?: string;
  productId?: string;
  tier?: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  track(event: string, properties?: Record<string, unknown>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      },
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);

    // Send to backend analytics API
    this.sendToBackend(analyticsEvent);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', analyticsEvent);
    }
  }

  trackConversion(conversion: ConversionEvent): void {
    this.track(conversion.event, {
      page: conversion.page,
      value: conversion.value,
      currency: conversion.currency || 'USD',
      productId: conversion.productId,
      tier: conversion.tier,
      isConversion: true,
    });
  }

  trackPageView(page: string): void {
    this.track('page_view', { page });
  }

  trackCTAClick(ctaLabel: string, destination: string): void {
    this.track('cta_click', { ctaLabel, destination });
  }

  trackPurchase(productId: string, value: number, currency = 'USD'): void {
    this.trackConversion({
      event: 'purchase',
      productId,
      value,
      currency,
    });
  }

  trackUpgrade(fromTier: string, toTier: string, value: number): void {
    this.trackConversion({
      event: 'upgrade',
      tier: `${fromTier}_to_${toTier}`,
      value,
    });
  }

  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error: unknown) {
      console.error("", error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }
}

// Singleton instance
let analyticsInstance: AnalyticsService | null = null;

export function getAnalytics(): AnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService();
  }
  return analyticsInstance;
}

// Convenience hooks
export function useAnalytics() {
  return getAnalytics();
}

