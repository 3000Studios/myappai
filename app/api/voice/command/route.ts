export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

/**
 * REQUIRED ENV VARS (set in Vercel for 3000studios-next):
 *
 * GITHUB_TOKEN        -> GitHub PAT with repo scope
 * VIP_SHARED_SECRET  -> Shared secret used by VIP voice app
 */

const OWNER = '3000Studios';
const REPO = '3000studios-next';
const BRANCH = 'main';

type VoiceRequest = {
  intent: string;
  payload: Record<string, any>;
};

export async function POST(req: Request) {
  try {
    // --- AUTH ---
    const auth = req.headers.get('authorization');
    if (!auth || auth !== `Bearer ${process.env.VIP_SHARED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: VoiceRequest = await req.json();

    if (!body.intent) {
      return NextResponse.json({ error: 'Missing intent' }, { status: 400 });
    }

    // --- INTENT HANDLER ---
    let filePath = '';
    let fileContent = '';

    if (body.intent === 'edit-page') {
      if (!body.payload?.route || !body.payload?.code) {
        return NextResponse.json({ error: 'Invalid payload for edit-page' }, { status: 400 });
      }

      filePath = `app/${body.payload.route}/page.tsx`;
      fileContent = body.payload.code;
    } else if (body.intent === 'add-component') {
      if (!body.payload?.name || !body.payload?.code) {
        return NextResponse.json({ error: 'Invalid payload for add-component' }, { status: 400 });
      }

      filePath = `app/components/${body.payload.name}.tsx`;
      fileContent = body.payload.code;
    } else {
      return NextResponse.json({ error: `Unknown intent: ${body.intent}` }, { status: 400 });
    }

    // --- GITHUB CONTENTS API ---
    const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };

    // Check if file already exists (to get SHA)
    const existing = await fetch(apiUrl, { headers });
    const existingJson = existing.ok ? await existing.json() : null;

    const githubResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Voice update: ${body.intent}`,
        content: Buffer.from(fileContent).toString('base64'),
        sha: existingJson?.sha,
        branch: BRANCH,
      }),
    });

    if (!githubResponse.ok) {
      const errText = await githubResponse.text();
      throw new Error(`GitHub write failed: ${errText}`);
    }

    return NextResponse.json({
      ok: true,
      committed: true,
      path: filePath,
      intent: body.intent,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Voice command failed' }, { status: 500 });
  }
}

