import { NextResponse } from 'next/server';
import { validateCommand } from '@/lib/voice-guard';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // Basic intent (can be upgraded later)
    const payload = {
      action: 'edit-page',
      route: 'home',
      code: text,
    };

    validateCommand(payload);

    const gh = await fetch('https://api.github.com/repos/3000Studios/3000studios-next/dispatches', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GH_BOT_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        event_type: 'antigravity-command',
        client_payload: payload,
      }),
    });

    if (!gh.ok) {
      throw new Error(`GitHub dispatch failed: ${gh.status} ${gh.statusText}`);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('VIP dispatch error:', e);
    return NextResponse.json({ error: e.message || 'VIP dispatch failed' }, { status: 500 });
  }
}

