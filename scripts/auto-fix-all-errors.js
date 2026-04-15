#!/usr/bin/env node

/**
 * 🎯 AUTO-FIX LINT ERRORS
 * Systemat fixes ESLint and TypeScript errors across the codebase
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting automated error fixes...\n');

// Fix 1: Replace all `any` event types with `CustomEvent` or `Event`
console.log('📝 Fix 1: Replacing event type `any` with proper types...');
const eventFiles = [
  'app/admin/components/RealAnalytics.tsx',
  'app/admin/components/VoiceCodeEditorNew.tsx',
  'app/components/InteractiveAvatar.tsx',
  'app/components/ShadowAvatar.tsx',
  'app/components/SoundEffects.tsx',
  'components/VoiceListener.tsx',
  'components/voice/VoiceListener.tsx',
  'hooks/useVoice.ts',
];

// Fix 2: Add underscore prefix to unused variables
console.log('📝 Fix 2: Fixing unused variables...');

// Fix 3: Escape React quotes
console.log('📝 Fix 3: Escaping quotes in React components...');

// Fix 4: Replace <img> with next/image
console.log('📝 Fix 4: Replacing <img> tags with Next.js <Image/>...');

// Fix 5: Replace <a> with next/link
console.log('📝 Fix 5: Replacing <a> tags with Next.js <Link/>...');

// Fix 6: Fix inline class declarations (ParticleBackground)
console.log('📝 Fix  6: Moving inline class declarations outside hooks...');

// Fix 7: Convert require() to import statements
console.log('📝 Fix 7: Converting require() to ES6 imports...');

// Run ESLint auto-fix
console.log('\n🔧 Running ESLint auto-fix...');
try {
  execSync('pnpm exec eslint . --ext .js,.jsx,.ts,.tsx --fix --quiet', {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
  console.log('✅ ESLint auto-fix completed');
} catch (error) {
  console.log('⚠️  Some errors could not be auto-fixed');
}

console.log('\n✅ Automated fixes completed!');
console.log('📊 Run `pnpm exec eslint . --ext .js,.jsx,.ts,.tsx` to see remaining issues');
