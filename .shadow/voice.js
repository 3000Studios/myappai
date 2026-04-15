import { exec } from 'child_process';

console.log(' Shadow Matrix Listening...');

process.stdin.on('data', (d) => {
  const t = d.toString().toLowerCase();

  if (t.includes('deploy')) exec('powershell .shadow/deploy.ps1');
  if (t.includes('repair')) exec('powershell .shadow/repair.ps1');
  if (t.includes('rollback')) exec('vercel rollback --yes');
});
