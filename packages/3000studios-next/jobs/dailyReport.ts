/**
 * Daily Revenue & Performance Report
 * Generates digest and alerts
 */

export interface DailyReport {
  date: string;
  metrics: {
    revenue: number;
    revenueChange: number;
    conversions: number;
    conversionRate: number;
    visitors: number;
    topProduct: string;
    topProductRevenue: number;
  };
  alerts: Alert[];
  recommendations: string[];
}

export interface Alert {
  level: 'info' | 'warning' | 'critical';
  message: string;
  metric: string;
  threshold: number;
  current: number;
}

export class ReportGenerator {
  private reports: Map<string, DailyReport> = new Map();

  /**
   * Generate daily report
   */
  async generateDailyReport(): Promise<DailyReport> {
    const today = new Date().toISOString().split('T')[0];

    // Fetch metrics from analytics
    const metrics = await this.aggregateMetrics();
    const alerts = this.detectAnomalies(metrics);
    const recommendations = this.generateRecommendations(metrics, alerts);

    const report: DailyReport = {
      date: today,
      metrics,
      alerts,
      recommendations,
    };

    this.reports.set(today, report);
    return report;
  }

  /**
   * Aggregate daily metrics
   */
  private async aggregateMetrics(): Promise<DailyReport['metrics']> {
    // In production, fetch from analytics backend
    return {
      revenue: Math.random() * 5000,
      revenueChange: (Math.random() - 0.5) * 100,
      conversions: Math.floor(Math.random() * 50),
      conversionRate: Math.random() * 0.1,
      visitors: Math.floor(Math.random() * 10000),
      topProduct: 'Premium Package',
      topProductRevenue: Math.random() * 2000,
    };
  }

  /**
   * Detect anomalies and threshold violations
   */
  private detectAnomalies(metrics: DailyReport['metrics']): Alert[] {
    const alerts: Alert[] = [];

    if (metrics.revenue < 100) {
      alerts.push({
        level: 'warning',
        message: 'Revenue below expected daily minimum',
        metric: 'revenue',
        threshold: 100,
        current: metrics.revenue,
      });
    }

    if (metrics.conversionRate < 0.01) {
      alerts.push({
        level: 'critical',
        message: 'Conversion rate critically low',
        metric: 'conversionRate',
        threshold: 0.01,
        current: metrics.conversionRate,
      });
    }

    if (metrics.visitors < 100) {
      alerts.push({
        level: 'info',
        message: 'Low traffic day',
        metric: 'visitors',
        threshold: 100,
        current: metrics.visitors,
      });
    }

    return alerts;
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(metrics: DailyReport['metrics'], alerts: Alert[]): string[] {
    const recommendations: string[] = [];

    if (metrics.conversionRate < 0.02) {
      recommendations.push('A/B test your homepage CTA - conversion rate is below target');
    }

    if (metrics.topProductRevenue > metrics.revenue * 0.4) {
      recommendations.push('Promote alternative products - over-reliance on single product');
    }

    if (alerts.some((a) => a.level === 'critical')) {
      recommendations.push('Review marketing channels - critical metrics need attention');
    }

    if (metrics.revenue > metrics.visitors * 0.5) {
      recommendations.push('Increase marketing spend - strong revenue per visitor');
    }

    return recommendations;
  }

  /**
   * Get report for date
   */
  getReport(date: string): DailyReport | null {
    return this.reports.get(date) || null;
  }

  /**
   * Get reports for date range
   */
  getReports(startDate: string, endDate: string): DailyReport[] {
    const reports: DailyReport[] = [];

    for (const [date, report] of this.reports) {
      if (date >= startDate && date <= endDate) {
        reports.push(report);
      }
    }

    return reports.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Format report for email/display
   */
  formatReport(report: DailyReport): string {
    return `
📊 Daily Report - ${report.date}

💰 Revenue: $${report.metrics.revenue.toFixed(2)} (${report.metrics.revenueChange > 0 ? '+' : ''}${report.metrics.revenueChange.toFixed(2)}%)
📈 Conversions: ${report.metrics.conversions} (${(report.metrics.conversionRate * 100).toFixed(2)}%)
👥 Visitors: ${report.metrics.visitors}
🏆 Top Product: ${report.metrics.topProduct} ($${report.metrics.topProductRevenue.toFixed(2)})

${report.alerts.length > 0 ? `⚠️ Alerts:\n${report.alerts.map((a) => `  • [${a.level.toUpperCase()}] ${a.message}`).join('\n')}\n` : ''}

💡 Recommendations:
${report.recommendations.map((r) => `  • ${r}`).join('\n')}
    `;
  }
}

// Singleton
let generator: ReportGenerator | null = null;

export function getReportGenerator(): ReportGenerator {
  if (!generator) {
    generator = new ReportGenerator();
  }
  return generator;
}

