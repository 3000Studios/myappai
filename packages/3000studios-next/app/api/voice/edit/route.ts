import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { route, jsx } = await req.json();

    const target = path.join(process.cwd(), 'app', route, 'page.tsx');
    if (!fs.existsSync(target)) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    fs.writeFileSync(target, jsx);
    return NextResponse.json({ ok: true, updated: route });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Unknown error occurred';
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

