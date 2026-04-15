import { execSync } from 'child_process';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const expectedToken = process.env.GPT_BRIDGE_TOKEN;
    const authHeader = req.headers.get('authorization');

    if (!expectedToken) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Bearer token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (token !== expectedToken.trim()) {
      return NextResponse.json({ error: 'Forbidden: Token mismatch' }, { status: 403 });
    }

    console.warn('⚠️ 3KAI triggering emergency rollback...');

    try {
      // Revert the last commit without opening an editor
      execSync('git revert HEAD --no-edit');
      // Push the revert to origin
      execSync('git push origin main');

      console.log('✅ Rollback successful. Revert commit pushed to main.');

      return NextResponse.json({
        success: true,
        message: 'Emergency rollback executed successfully. Last commit reverted and pushed.',
        timestamp: new Date().toISOString(),
      });
    } catch (gitError: unknown) {
      const msg = gitError instanceof Error ? gitError.message : String(gitError);
      console.error('Git rollback internal error:', msg);
      return NextResponse.json(
        {
          success: false,
          error: 'Git command failed',
          details: msg,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Rollback handler error:', message);
    return NextResponse.json({ error: 'Rollback failed', details: message }, { status: 500 });
  }
}

