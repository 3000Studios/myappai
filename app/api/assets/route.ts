import { media as registry } from '@/lib/mediaRegistry';
import { NextResponse } from 'next/server';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dj92eb97f';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

async function searchPexels(query: string) {
  if (!PEXELS_API_KEY) return [];
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: { Authorization: PEXELS_API_KEY },
      }
    );
    const data = await res.json();
    return (data.photos || []).map((p: any) => ({
      name: `Pexels: ${p.alt || p.id}`,
      url: p.src.large2x,
      type: 'image',
      source: 'pexels',
    }));
  } catch (e) {
    console.error('Pexels search error:', e);
    return [];
  }
}

export const runtime = 'nodejs';

export async function POST(req: Request) {
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

    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const lowerQuery = query.toLowerCase();
    let allAssets: any[] = [];

    // 1. Search Cloudinary if configured
    if (API_KEY && API_SECRET) {
      try {
        const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search?expression=${encodeURIComponent(query)}&max_results=10`,
          { headers: { Authorization: `Basic ${auth}` } }
        );

        if (response.ok) {
          const data = await response.json();
          const cloudAssets = data.resources.map((r: any) => ({
            name: r.public_id,
            url: r.secure_url,
            type: r.resource_type,
            source: 'cloudinary',
          }));
          allAssets = [...allAssets, ...cloudAssets];
        }
      } catch (err) {
        console.error('Cloudinary search error:', err);
      }
    }

    // 2. Search Pexels
    const pexelsAssets = await searchPexels(query);
    allAssets = [...allAssets, ...pexelsAssets];

    // 3. Search local registry fallback
    if (registry.introVideo.includes(lowerQuery)) {
      allAssets.push({
        name: 'Registry: Intro Video',
        url: registry.introVideo,
        type: 'video',
        source: 'local',
      });
    }

    return NextResponse.json({
      success: true,
      count: allAssets.length,
      assets: allAssets,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json(
      { error: 'Failed to fetch assets', details: message },
      { status: 500 }
    );
  }
}
