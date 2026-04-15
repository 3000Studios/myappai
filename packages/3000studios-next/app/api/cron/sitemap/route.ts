import { generateSitemapXml } from '@/lib/seo';
import { getSitemapEntries } from '@/lib/sitemap';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const entries = await getSitemapEntries();
    const xml = generateSitemapXml(entries);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400',
      },
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify Vercel cron secret
    const secret = req.headers.get('x-vercel-cron-secret');
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await getSitemapEntries();

    return NextResponse.json({
      success: true,
      entriesGenerated: entries.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

