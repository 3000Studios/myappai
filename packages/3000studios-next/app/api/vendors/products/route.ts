import { ingestVendorFeed } from '@/lib/vendors/ingest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const vendor = req.nextUrl.searchParams.get('vendor') || 'custom';
  const feedUrl = req.nextUrl.searchParams.get('feedUrl') || undefined;

  try {
    const products = await ingestVendorFeed(vendor, feedUrl);
    return NextResponse.json(products);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error instanceof Error
              ? error instanceof Error
                ? error.message
                : 'Unknown error'
              : 'Unknown error'
            : 'Failed to ingest vendor feed',
      },
      { status: 400 }
    );
  }
}

