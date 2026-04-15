/**
 * Deployment Trigger API Route
 * Triggers Vercel deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { triggerDeployment, getDeploymentStatus } from '@/lib/services/vercel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branch } = body;

    // Trigger deployment
    const deployment = await triggerDeployment(branch || 'main');

    return NextResponse.json({
      success: true,
      deploymentId: deployment.id,
      deploymentUrl: `https://${deployment.url}`,
      status: deployment.readyState,
      message: 'Deployment triggered successfully',
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to trigger deployment' }, { status: 500 });
  }
}

