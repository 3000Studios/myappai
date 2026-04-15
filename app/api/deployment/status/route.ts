/**
 * Deployment Status API Route
 * Checks deployment status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDeploymentStatus, getLatestDeployment } from '@/lib/services/vercel';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deploymentId = searchParams.get('deploymentId');

    if (deploymentId) {
      // Validate deploymentId to prevent SSRF and malformed requests
      const isValidDeploymentId =
        typeof deploymentId === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(deploymentId);

      if (!isValidDeploymentId) {
        return NextResponse.json({ error: 'Invalid deploymentId' }, { status: 400 });
      }

      // Get specific deployment status
      const status = await getDeploymentStatus(deploymentId);
      return NextResponse.json({
        success: true,
        deploymentId,
        status,
      });
    } else {
      // Get latest deployment
      const latest = await getLatestDeployment();
      return NextResponse.json({
        success: true,
        deployment: latest,
      });
    }
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Failed to get deployment status' }, { status: 500 });
  }
}

