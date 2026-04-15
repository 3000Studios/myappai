#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, '../.error-memory.json');
const msg = process.argv.slice(2).join(' ');

const mem = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];

if (mem.includes(msg)) {
  console.error('🚫 REPEATED ERROR DETECTED — FIX WAS IGNORED');
  console.error(`Error: "${msg}"`);
  process.exit(1);
}

if (msg) {
  mem.push(msg);
  fs.writeFileSync(FILE, JSON.stringify(mem, null, 2));
  console.log(`🧠 Error recorded in memory: "${msg}"`);
}
