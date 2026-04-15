import { NextResponse } from 'next/server';

interface BlogPost {
  id: number;
  title: string;
  body: string;
  date: string;
}

const posts: BlogPost[] = [];

export async function POST(req: Request) {
  const body = (await req.json()) as { title: string; body: string };
  const post: BlogPost = { ...body, date: new Date().toISOString(), id: Date.now() };
  posts.push(post);

  // In production, this should trigger a GitHub Action to commit the file
  // via /api/command
  console.log('Mock blog post created:', post);

  return NextResponse.json({ ok: true, post });
}

export async function GET() {
  return NextResponse.json(posts);
}

