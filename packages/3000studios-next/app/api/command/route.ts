import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // 1. Auth Check
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin')?.value === 'true';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Request
    const { intent, payload } = await req.json();
    if (!intent || !payload) {
      return NextResponse.json({ error: 'Missing intent or payload' }, { status: 400 });
    }

    // 3. Prepare Command File
    const timestamp = Date.now();
    const filename = `commands/pending/${timestamp}-${intent}.json`;
    const content = JSON.stringify(
      {
        intent,
        payload,
        timestamp,
        author: 'admin',
      },
      null,
      2
    );

    // 4. Commit to GitHub
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = '3000Studios';
    const repo = '3000studios-next';

    // Get current main ref to branch off (technically we just create a file)
    // We can just create the file directly on main
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filename,
      message: `command: ${intent}`, // Trigger CI for the command executor
      content: Buffer.from(content).toString('base64'),
      branch: 'main',
    });

    return NextResponse.json({ success: true, id: timestamp });
  } catch (error) {
    console.error('Command Error:', error);
    return NextResponse.json({ error: 'Command dispatch failed' }, { status: 500 });
  }
}

