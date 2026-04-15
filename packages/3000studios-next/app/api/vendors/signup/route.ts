import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, feedUrl, model } = body;

  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email required' }, { status: 400 });
  }

  // Vendor signup logged

  // Placeholder: push to CRM/DB/queue here

  return NextResponse.json({ success: true, message: 'Vendor submitted for review' });
}

