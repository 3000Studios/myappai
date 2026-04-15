import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Cloudinary upload (replace with your credentials)
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/auto/upload`;
    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', 'public');

    const res = await fetch(cloudinaryUrl, { method: 'POST', body });
    const json = await res.json();

    return NextResponse.json(json);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

