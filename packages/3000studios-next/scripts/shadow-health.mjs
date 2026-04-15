import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mustExist = ['package.json', 'next.config.mjs', 'app', 'public'];

const missing = mustExist.filter((p) => !fs.existsSync(path.join(root, p)));
if (missing.length) {
  console.error('Missing required paths:', missing);
  process.exit(1);
}

const envSchema = path.join(root, '.env.schema');
if (!fs.existsSync(envSchema)) {
  console.error('Missing .env.schema');
  process.exit(1);
}

console.log('shadow-health: OK');
