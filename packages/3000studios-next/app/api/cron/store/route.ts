import { getStoreOptimizer } from '@/jobs/storeOptimizer';
import { getPricingEngine } from '@/lib/pricing';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Verify Vercel cron secret
    const secret = req.headers.get('x-vercel-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const optimizer = getStoreOptimizer();
    const actions = await optimizer.optimize();

    // Get top products after optimization
    const pricingEngine = getPricingEngine();
    const topProducts = pricingEngine.getTopProducts(3);

    return NextResponse.json({
      success: true,
      actionsApplied: actions.length,
      topProducts,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Optimization failed' }, { status: 500 });
  }
}

export const preferredRegion = 'auto';

