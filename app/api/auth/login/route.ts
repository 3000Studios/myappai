import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function getUsersFromJson() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8') || '[]');
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};
    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    const users = getUsersFromJson();
    const user = users.find((u: any) => u.email === email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role || 'admin' }, secret, { expiresIn: '7d' });

    const res = NextResponse.json({ success: true });
    res.cookies.set('app_session', token, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' });
    return res;
  } catch (err) {
    console.error('Login error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}