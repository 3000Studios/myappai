import bcrypt from 'bcryptjs';
import { kv } from '@vercel/kv';

const SHADOW_EMAIL = process.env.SHADOW_ADMIN_EMAIL || 'admin@3000studios.com';
const SHADOW_PASSWORD = process.env.SHADOW_ADMIN_PASSWORD || 'ShadowPrime2025!';

export async function initShadowPassword() {
  try {
    const stored = await kv.get('shadow-password');

    if (!stored) {
      const hash = await bcrypt.hash(SHADOW_PASSWORD, 12);
      await kv.set('shadow-password', hash);
      await kv.set('shadow-email', SHADOW_EMAIL);
    }
  } catch (error: unknown) {
    console.error("", error);
  }
}

export async function validateShadowLogin(email: string, pass: string): Promise<boolean> {
  try {
    const storedEmail = await kv.get('shadow-email');
    const storedHash = await kv.get('shadow-password');

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

export async function createShadowSession(email: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  await kv.set(`shadow-session:${sessionId}`, email, { ex: 86400 }); // 24h expiry
  return sessionId;
}

export async function validateShadowSession(sessionId: string): Promise<string | null> {
  try {
    const email = await kv.get(`shadow-session:${sessionId}`);
    return email as string | null;
  } catch (error: unknown) {
    console.error("", error);
    return null;
  }
}

export async function destroyShadowSession(sessionId: string) {
  try {
    await kv.del(`shadow-session:${sessionId}`);
  } catch (error: unknown) {
    console.error("", error);
  }
}

