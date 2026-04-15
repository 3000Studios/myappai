import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

const MASTER_EMAIL = 'mr.jwswain@gmail.com';
const MASTER_PASSWORD = 'Bossman3000!!!';

export async function initMasterPassword() {
  try {
    const stored = await kv.get('matrix-password');

    if (!stored) {
      const hash = await bcrypt.hash(MASTER_PASSWORD, 12);
      await kv.set('matrix-password', hash);
      await kv.set('matrix-email', MASTER_EMAIL);
    }
  } catch (error: unknown) {
    console.error("", error);
  }
}

export async function validateLogin(email: string, pass: string): Promise<boolean> {
  try {
    const storedEmail = await kv.get('matrix-email');
    const storedHash = await kv.get('matrix-password');

    if (email !== storedEmail) {
      return false;
    }

    if (!storedHash || typeof storedHash !== 'string') {
      return false;
    }

    return await bcrypt.compare(pass, storedHash);
  } catch (error: unknown) {
    console.error("", error);
    return false;
  }
}

export async function createSession(email: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  await kv.set(`session:${sessionId}`, email, { ex: 86400 }); // 24h expiry
  return sessionId;
}

export async function validateSession(sessionId: string): Promise<string | null> {
  try {
    const email = await kv.get(`session:${sessionId}`);
    return email as string | null;
  } catch {
    return null;
  }
}

export async function destroySession(sessionId: string): Promise<void> {
  await kv.del(`session:${sessionId}`);
}

