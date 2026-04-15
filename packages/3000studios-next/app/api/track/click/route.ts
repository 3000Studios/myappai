import { trackCommission } from '@/lib/commissions';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  await trackCommission(body);
  return NextResponse.json({ ok: true });
}

