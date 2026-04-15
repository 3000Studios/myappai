#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const rules = [
  ['app/admin', 'app/(admin)/admin'],
  ['app/home', 'app/(public)/home'],
  ['app/projects', 'app/(public)/projects'],
  ['app/store', 'app/(public)/store'],
];

for (const [bad, good] of rules) {
  const badPath = path.join(root, bad);
  const goodPath = path.join(root, good);

  if (fs.existsSync(badPath)) {
    fs.mkdirSync(path.dirname(goodPath), { recursive: true });
    fs.renameSync(badPath, goodPath);
    console.log(`✔ Moved ${bad} → ${good}`);
  }
}

console.log('✅ Routes fixed');
