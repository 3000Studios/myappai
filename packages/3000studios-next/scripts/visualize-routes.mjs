#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function walk(dir, route = '') {
  const items = [];
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const isGroup = d.name.startsWith('(');
    const next = isGroup ? route : `${route}/${d.name}`;
    const full = path.join(dir, d.name);

    if (fs.existsSync(path.join(full, 'page.tsx'))) {
      items.push(next || '/');
    }
    items.push(...walk(full, next));
  }
  return items;
}

const appDir = path.resolve(__dirname, '../app');
const routes = walk(appDir).sort();

console.log('\n🧭 ROUTE MAP\n');
routes.forEach((r) => console.log('•', r));
console.log('\nTotal routes:', routes.length, '\n');
