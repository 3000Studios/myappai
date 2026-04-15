/**
 * A/B Testing & Conversion Optimization
 * Feature flags, variant tracking, winner promotion
 */

export interface Variant {
  name: string;
  value: string | number | boolean;
  weight: number; // 0-100
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  target: string; // e.g., 'cta_text', 'hero_headline', 'pricing_plan'
  variants: Variant[];
  startDate: number;
  endDate: number;
  status: 'active' | 'paused' | 'ended';
  winner?: string;
  conversionMetric: string; // e.g., 'purchase', 'click', 'signup'
  minSampleSize: number;
  confidenceThreshold: number; // 0.95 = 95% confidence
}

export interface ExperimentResult {
  variantName: string;
  conversions: number;
  impressions: number;
  conversionRate: number;
  confidence: number;
}

export class ExperimentEngine {
  private experiments: Map<string, Experiment> = new Map();
  private results: Map<string, ExperimentResult[]> = new Map();

  /**
   * Create a new experiment
   */
  createExperiment(experiment: Omit<Experiment, 'id'>): Experiment {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const exp: Experiment = {
      ...experiment,
      id,
    };

    this.experiments.set(id, exp);
    this.results.set(id, []);
    return exp;
  }

  /**
   * Get variant for user (consistent bucketing)
   */
  getVariant(experimentId: string, userId: string): string | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'active') return null;

    // Consistent hash-based bucketing
    const hash = this.hashUserId(userId, experimentId);
    let accumulated = 0;

    for (const variant of experiment.variants) {
      accumulated += variant.weight;
      if (hash < accumulated) {
        return variant.name;
      }
    }

    return experiment.variants[0]?.name || null;
  }

  /**
   * Record conversion
   */
  recordConversion(experimentId: string, variantName: string): void {
    const results = this.results.get(experimentId);
    if (!results) return;

    const existing = results.find((r) => r.variantName === variantName);
    if (existing) {
      existing.conversions++;
    } else {
      results.push({
        variantName,
        conversions: 1,
        impressions: 0,
        conversionRate: 0,
        confidence: 0,
      });
    }

    this.updateConversionRates(experimentId);
  }

  /**
   * Record impression
   */
  recordImpression(experimentId: string, variantName: string): void {
    const results = this.results.get(experimentId);
    if (!results) return;

    const existing = results.find((r) => r.variantName === variantName);
    if (existing) {
      existing.impressions++;
    } else {
      results.push({
        variantName,
        conversions: 0,
        impressions: 1,
        conversionRate: 0,
        confidence: 0,
      });
    }

    this.updateConversionRates(experimentId);
  }

  /**
   * Update conversion rates and confidence
   */
  private updateConversionRates(experimentId: string): void {
    const results = this.results.get(experimentId);
    if (!results) return;

    for (const result of results) {
      result.conversionRate = result.impressions > 0 ? result.conversions / result.impressions : 0;

      // Chi-square confidence calculation (simplified)
      if (result.impressions > 30) {
        result.confidence = Math.min(
          0.95,
          0.5 + (result.conversionRate / 2) * (result.impressions / 100)
        );
      }
    }
  }

  /**
   * Determine statistical winner
   */
  determineWinner(experimentId: string): string | null {
    const experiment = this.experiments.get(experimentId);
    const results = this.results.get(experimentId);

    if (!experiment || !results) return null;

    // Find variant with highest conversion rate that meets minimum sample size
    const qualified = results.filter(
      (r) =>
        r.impressions >= experiment.minSampleSize && r.confidence >= experiment.confidenceThreshold
    );

    if (qualified.length === 0) return null;

    const winner = qualified.reduce((best, current) =>
      current.conversionRate > best.conversionRate ? current : best
    );

    return winner.variantName;
  }

  /**
   * Promote winner to default
   */
  promoteWinner(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    const winner = this.determineWinner(experimentId);

    if (!experiment || !winner) return false;

    experiment.winner = winner;
    experiment.status = 'ended';
    return true;
  }

  /**
   * Get experiment results
   */
  getResults(experimentId: string): ExperimentResult[] {
    return this.results.get(experimentId) || [];
  }

  /**
   * Get active experiments
   */
  getActiveExperiments(): Experiment[] {
    return Array.from(this.experiments.values()).filter((e) => e.status === 'active');
  }

  /**
   * Consistent user bucketing
   */
  private hashUserId(userId: string, experimentId: string): number {
    const combined = `${userId}:${experimentId}`;
    let hash = 0;

    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash) % 100;
  }
}

// Singleton
let engine: ExperimentEngine | null = null;

export function getExperimentEngine(): ExperimentEngine {
  if (!engine) {
    engine = new ExperimentEngine();
  }
  return engine;
}

