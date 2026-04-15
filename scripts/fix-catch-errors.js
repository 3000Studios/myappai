#!/usr/bin/env node

/**
 * Fix all TypeScript errors where catch parameter is prefixed with _
 * but referenced without the underscore
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern: } catch (_varname) { ... varname (without underscore)
  // Replace _varname with varname in the catch clause
  const catchPattern = /} catch \(_([a-zA-Z][a-zA-Z0-9]*)\) \{/g;

  if (catchPattern.test(content)) {
    content = content.replace(/} catch \(_([a-zA-Z][a-zA-Z0-9]*)\) \{/g, '} catch ($1) {');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  let fixed = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        fixed += walkDir(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixFile(filePath)) {
        fixed++;
      }
    }
  }

  return fixed;
}

const appDir = path.join(__dirname, '..', 'app');
console.log('🔧 Fixing TypeScript catch parameter errors...\n');

const fixed = walkDir(appDir);

console.log(`\n✨ Fixed ${fixed} files`);
