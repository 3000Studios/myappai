import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { slug, title, content } = await req.json();
    const dir = path.join(process.cwd(), 'app', slug);
    fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(
      path.join(dir, 'page.tsx'),
      `export default function Page() {
  return (
    <section className="p-10 min-h-screen">
      <h1 className="text-5xl font-bold gradient-text mb-6">${title}</h1>
      <p className="mt-6 text-gray-400 text-lg">${content}</p>
    </section>
  );
}
`
    );

    return NextResponse.json({ ok: true, slug, created: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Page generation failed';
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

