import fs from 'fs';
import path from 'path';

const cmd = JSON.parse(process.env.ANTIGRAVITY_PAYLOAD || '{}');

if (!cmd.action) {
  console.log('No action payload');
  process.exit(0);
}

const ROOT = process.cwd();

if (cmd.action === 'edit-page') {
  const target = path.join(ROOT, 'app', cmd.route, 'page.tsx');
  fs.writeFileSync(target, cmd.code);
}

if (cmd.action === 'add-component') {
  const target = path.join(ROOT, 'components', `${cmd.name}.tsx`);
  fs.writeFileSync(target, cmd.code);
}

console.log('Applied command:', cmd.action);
