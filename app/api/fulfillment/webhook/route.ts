import { NextRequest, NextResponse } from 'next/server';

function verifySignature(req: NextRequest) {
  const secret = process.env.FULFILLMENT_SIGNING_SECRET;
  if (!secret) return true; // dev fallback
  const header = req.headers.get('x-fulfillment-signature');
  return Boolean(header && header.length > 0);
}

export async function POST(req: NextRequest) {
  if (!verifySignature(req)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = await req.json();
  console.log('🚚 Fulfillment webhook', event);

  // TODO: route to vendor, update order status, handle inventory/returns

  return NextResponse.json({ ok: true });
}

