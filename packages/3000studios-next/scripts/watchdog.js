#!/usr/bin/env node

/**
 * Self-healing watchdog script
 * Monitors build health and auto-repairs on failure
 */

const { exec } = require('child_process');

function checkBuild() {
  console.log(`[${new Date().toISOString()}] Running build check...`);

  exec('pnpm build', (error, stdout, stderr) => {
    if (error) {
      console.error(`[${new Date().toISOString()}] Build failed. Initiating self-heal...`);
      selfHeal();
    } else {
      console.log(`[${new Date().toISOString()}] Build successful.`);
    }
  });
}

function selfHeal() {
  console.log('Resetting to last known good state...');
  exec('git reset --hard HEAD && pnpm install && pnpm build', (error) => {
    if (error) {
      console.error('Self-heal failed:', error);
    } else {
      console.log('Self-heal complete. System restored.');
    }
  });
}

// Run check every 60 seconds
console.log('Watchdog started. Monitoring build health...');
setInterval(checkBuild, 60000);

// Initial check
checkBuild();
