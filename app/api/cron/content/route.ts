import { getContentScheduler } from '@/jobs/contentScheduler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Verify Vercel cron secret
    const secret = req.headers.get('x-vercel-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const scheduler = getContentScheduler();
    await scheduler.processScheduledContent();

    const scheduled = scheduler.getScheduled();
    const published = scheduler.getByStatus('published');

    return NextResponse.json({
      success: true,
      processed: scheduled.length,
      published: published.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

export const preferredRegion = 'auto';

