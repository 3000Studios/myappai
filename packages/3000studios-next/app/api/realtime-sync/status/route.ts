/**
 * Deployment Status API Route
 * Get current deployment status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLatestDeployment } from '@/lib/services/vercel';

export async function GET(_request: NextRequest) {
  try {
    const deployment = await getLatestDeployment();

    if (!deployment) {
      return NextResponse.json({
        status: 'no_deployments',
        message: 'No deployments found',
      });
    }

    return NextResponse.json({
      status: 'success',
      deployment: {
        id: deployment.id,
        url: `https://${deployment.url}`,
        state: deployment.readyState,
        createdAt: deployment.createdAt,
      },
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to get deployment status' }, { status: 500 });
  }
}

