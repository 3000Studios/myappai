import { getLatestDeployment } from '@/lib/services/vercel';
import { NextResponse } from 'next/server';

/**
 * DEPLOYMENT PREVIEW ENDPOINT
 * Returns the latest deployment URL and status from Vercel.
 * Used by 3KAI to provide live preview links to the user.
 */

export async function GET(req: Request) {
  try {
    // Verify auth (using the same GPT_BRIDGE_TOKEN for simplicity)
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.GPT_BRIDGE_TOKEN;

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const latest = await getLatestDeployment();

    if (!latest) {
      return NextResponse.json({
        success: false,
        message: 'No deployments found for this project.',
      });
    }

    return NextResponse.json({
      success: true,
      deployment: {
        id: latest.id,
        url: `https://${latest.url}`,
        status: latest.readyState,
        createdAt: new Date(latest.createdAt).toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("", error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

