#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fixClient(file) {
  const src = fs.readFileSync(file, 'utf8');
  if (
    (src.includes('window') || src.includes('document') || src.includes('navigator')) &&
    !src.startsWith('"use client"') &&
    !src.startsWith("'use client'")
  ) {
    fs.writeFileSync(file, `"use client";\n\n${src}`);
    console.log(`✔ Added "use client" → ${file}`);
  }
}

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      walk(full);
      continue;
    }

    if (item.name.endsWith('.tsx')) {
      fixClient(full);
    }
  }
}

const componentsDir = path.resolve(__dirname, '../components');
const appDir = path.resolve(__dirname, '../app');

if (fs.existsSync(componentsDir)) walk(componentsDir);
if (fs.existsSync(appDir)) walk(appDir);

console.log('✅ Auto-fix complete');
