import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Minimal admin voice-logs API.
 *
 * - GET: returns last N logs (default 100)
 * - POST: { action: 'clear' } to remove logs
 *         { action: 'append', entry: {...} } to append a log (dev)
 *
 * Persisted to .data/voice-logs.json in project root for simplicity.
 * Replace with DB-backed storage (Prisma/Mongo) for production.
 */

const DATA_DIR = path.join(process.cwd(), '.data');
const LOG_FILE = path.join(DATA_DIR, 'voice-logs.json');

async function ensureStore() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(LOG_FILE);
    } catch {
      await fs.writeFile(LOG_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    // ignore; read/write will fail later if needed
    console.warn('ensureStore warning', err);
  }
}

async function readLogs(): Promise<any[]> {
  await ensureStore();
  try {
    const raw = await fs.readFile(LOG_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('readLogs error', err);
    return [];
  }
}

async function writeLogs(logs: any[]) {
  await ensureStore();
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || '100');
    const logs = await readLogs();
    return NextResponse.json({ logs: logs.slice(0, limit) });
  } catch (err) {
    console.error('GET /api/admin/voice-logs failed', err);
    return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.action) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (body.action === 'clear') {
      await writeLogs([]);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'append' && body.entry) {
      const logs = await readLogs();
      logs.unshift(body.entry);
      await writeLogs(logs);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/admin/voice-logs failed', err);
    return NextResponse.json({ error: 'Failed to write logs' }, { status: 500 });
  }
}
