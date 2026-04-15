/**
 * lib/env.ts
 *
 * Simple environment validation helper used in CI and at runtime to fail fast
 * when required environment variables are missing.
 */

export function validateEnv(required: string[] = []) {
  const missing: string[] = [];
  for (const k of required) {
    const v = process.env[k];
    if (!v || String(v).trim() === '') missing.push(k);
  }

  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      // In dev warn rather than throwing
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  }

  return missing;
}
