import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { action, payload } = await req.json();

  const res = await fetch(
    `https://api.github.com/repos/3000Studios/3000studios-next/actions/workflows/voice-commit.yml/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          action,
          payload: JSON.stringify(payload),
        },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Dispatch failed' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: 'cloud',
    timestamp: new Date().toISOString(),
  });
}

