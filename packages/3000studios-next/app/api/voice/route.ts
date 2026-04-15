import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Missing body' }, { status: 400 });

    if (body.transcript) {
      const transcript: string = String(body.transcript);
      const actions: string[] = [];
      if (transcript.toLowerCase().includes('dark')) actions.push('setTheme:dark');
      if (transcript.toLowerCase().includes('light')) actions.push('setTheme:light');
      return NextResponse.json({ success: true, summary: `Parsed ${actions.length} actions.`, actions });
    }

    if (body.type && body.payload) {
      return NextResponse.json({ success: true, message: 'Structured command received; handler not yet wired.' });
    }

    return NextResponse.json({ error: 'Unsupported command format' }, { status: 400 });
  } catch (err) {
    console.error('voice route error', err);
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}