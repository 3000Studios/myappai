#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Validates that the deployment is safe and ready
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const checks = [
  {
    name: 'Package manager lockfile',
    check: () => existsSync('pnpm-lock.yaml'),
    error: 'pnpm-lock.yaml not found. Run: pnpm install',
  },
  {
    name: 'Node modules',
    check: () => existsSync('node_modules'),
    error: 'node_modules not found. Run: pnpm install',
  },
  {
    name: 'Environment variables',
    check: () => {
      const required = ['DATABASE_URL'];
      const missing = required.filter((key) => !process.env[key]);
      if (missing.length > 0) {
        throw new Error(`Missing env vars: ${missing.join(', ')}`);
      }
      return true;
    },
    error: 'Required environment variables missing',
  },
  {
    name: 'TypeScript compilation',
    check: () => {
      try {
        execSync('pnpm run type-check', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    error: 'TypeScript compilation failed',
  },
  {
    name: 'Lint check',
    check: () => {
      try {
        execSync('pnpm run lint', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    error: 'Lint check failed',
  },
  {
    name: 'Build',
    check: () => {
      try {
        execSync('pnpm run build', { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    },
    error: 'Build failed',
  },
];

console.log('🔍 Verifying deployment safety...\n');

let failed = false;

for (const { name, check, error } of checks) {
  process.stdout.write(`Checking ${name}... `);
  try {
    if (check()) {
      console.log('✅');
    } else {
      console.log('❌');
      console.error(`  Error: ${error}`);
      failed = true;
    }
  } catch (err) {
    console.log('❌');
    console.error(`  Error: ${error}`);
    console.error(`  Details: ${err.message}`);
    failed = true;
  }
}

if (failed) {
  console.error('\n❌ Deployment verification failed');
  process.exit(1);
} else {
  console.log('\n✅ Deployment verification passed');
  console.log('Safe to deploy to production');
}
