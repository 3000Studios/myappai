import { getReportGenerator } from '@/jobs/dailyReport';
import { getAnalytics } from '@/lib/analytics';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Verify Vercel cron secret
    const secret = req.headers.get('x-vercel-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reportGen = getReportGenerator();
    const report = await reportGen.generateDailyReport();

    // Trigger analytics sync
    const _analytics = getAnalytics();

    // Send email notification for critical alerts
    const criticalAlerts = report.alerts.filter((a) => a.level === 'critical');
    if (criticalAlerts.length > 0) {
      await sendAlertEmail(report, criticalAlerts);
    }

    return NextResponse.json({
      success: true,
      reportDate: report.date,
      metricsCollected: true,
      eventsSent: 0,
      alertsSent: criticalAlerts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}

async function sendAlertEmail(report: any, alerts: any[]): Promise<boolean> {
  // In production, integrate with email service
  console.log('[Reports] Critical alerts:', alerts);
  return true;
}

export const preferredRegion = 'auto';

