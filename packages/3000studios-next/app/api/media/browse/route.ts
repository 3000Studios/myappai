import { media as registry } from '@/lib/mediaRegistry';
import { NextResponse } from 'next/server';

/**
 * MEDIA BROWSE ENDPOINT
 * Allows 3KAI to list and search for videos, images, and music.
 * Fetches from Cloudinary if configured, else falls back to local registry.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dj92eb97f';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function GET(req: Request) {
  try {
    // 1. Auth check
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.GPT_BRIDGE_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // video, image, audio
    const query = searchParams.get('query') || '';

    // 2. If Cloudinary keys are present, fetch from Cloudinary
    if (API_KEY && API_SECRET) {
      const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

      // Map general types to Cloudinary resource types
      const resourceType = type === 'video' ? 'video' : type === 'audio' ? 'video' : 'image';

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}?max_results=50`;

      const response = await fetch(cloudinaryUrl, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const items = data.resources.map((r: any) => ({
          name: r.public_id,
          url: r.secure_url,
          type: r.resource_type,
          format: r.format,
          createdAt: r.created_at,
        }));

        return NextResponse.json({
          success: true,
          source: 'cloud',
          items: query ? items.filter((i: any) => i.name.includes(query)) : items,
        });
      }
    }

    // 3. Fallback to lib/mediaRegistry.ts
    // This is useful if the user hasn't set up API keys yet
    const fallbackItems: any[] = [];

    if (registry.introVideo)
      fallbackItems.push({ name: 'Intro Video', url: registry.introVideo, type: 'video' });
    if (registry.heroVideo)
      fallbackItems.push({ name: 'Hero Video', url: registry.heroVideo, type: 'video' });
    if (registry.backgroundMusic)
      fallbackItems.push({
        name: 'Background Music',
        url: registry.backgroundMusic,
        type: 'audio',
      });

    // Add dummy avatars for browsing
    registry.avatars.forEach((a: any, i: number) => {
      fallbackItems.push({ name: `Avatar ${i + 1}`, url: a.url || a, type: 'image' });
    });

    return NextResponse.json({
      success: true,
      source: 'registry',
      items: query
        ? fallbackItems.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
        : fallbackItems,
      note: !(API_KEY && API_SECRET)
        ? 'Cloudinary API keys missing. Showing registry fallback.'
        : null,
    });
  } catch (error: unknown) {
    console.error('', error);
    return NextResponse.json({ error: 'Failed to browse media' }, { status: 500 });
  }
}
