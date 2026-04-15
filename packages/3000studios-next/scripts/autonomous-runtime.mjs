import fs from 'fs';
import { execSync } from 'child_process';

const CONFIG_PATH = './autonomous.system.json';
const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

const run = (cmd) => {
  try {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Command failed: ${cmd}`, e.message);
    // never block autonomy
  }
};

export function autoFix() {
  run('pnpm lint --fix || true');
  run('pnpm prettier --write . || true');
}

export function autoCommit() {
  run('git add -A');
  run(`git commit -m "${cfg.gitAutomation.commitMessage}" || true`);
}

export function autoPush() {
  run('git push origin main');
}

export function autoDeploy() {
  run('vercel deploy --prod --yes');
}

export function autoArchive() {
  if (!cfg.maintenance.autoArchiveUnusedFiles) return;
  run('node scripts/archive-unused.mjs');
}

export function autoContent() {
  if (!cfg.contentEngine.autoBlog) return;
  run('node scripts/generate-content.mjs');
}

export function autoSEO() {
  run('node scripts/seo-optimize.mjs');
}

export function dispatch(actions = []) {
  actions.forEach((a) => {
    if (a === 'autoFix') autoFix();
    if (a === 'autoCommit') autoCommit();
    if (a === 'autoPush') autoPush();
    if (a === 'deploy') autoDeploy();
    if (a === 'archive') autoArchive();
    if (a === 'content') autoContent();
    if (a === 'seo') autoSEO();
  });
}

if (process.argv[2]) {
  const cmd = process.argv.slice(2).join(' ');
  const actions = cfg.commandRouter.commands[cmd];
  if (actions) {
    dispatch(actions);
  } else {
    // Allow running individual functions directly if they match the export name
    if (cmd === 'autoFix') autoFix();
    else if (cmd === 'autoCommit') autoCommit();
    else if (cmd === 'autoPush') autoPush();
    else if (cmd === 'deploy') autoDeploy();
    else if (cmd === 'archive') autoArchive();
    else if (cmd === 'content') autoContent();
    else if (cmd === 'seo') autoSEO();
  }
}
