import { getLatestDeployment } from '@/lib/services/vercel';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const expectedToken = process.env.GPT_BRIDGE_TOKEN;
    const authHeader = req.headers.get('authorization');

    if (!expectedToken) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== expectedToken.trim()) {
      return NextResponse.json({ error: 'Forbidden: Token mismatch' }, { status: 403 });
    }

    const latest = await getLatestDeployment();

    return NextResponse.json({
      success: true,
      status: latest ? latest.readyState : 'unknown',
      lastDeployment: latest
        ? {
            id: latest.id,
            url: latest.url,
            createdAt: latest.createdAt,
          }
        : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

