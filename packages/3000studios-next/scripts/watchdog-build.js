/**
 * Self-Healing Build Watchdog
 * Monitors build health and auto-repairs failures
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../build-watchdog.log');

function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(LOG_FILE, entry);
  console.log(entry);
}

function checkBuild() {
  try {
    log('Running build check...');
    execSync('pnpm build', { stdio: 'pipe' });
    log('✅ Build successful');
    return true;
  } catch (error) {
    log('❌ Build failed: ' + error.message);
    return false;
  }
}

function rollbackAndFix() {
  try {
    log('Initiating rollback...');
    execSync('git reset --hard HEAD~1');
    execSync('pnpm install');

    if (checkBuild()) {
      log('✅ Rollback successful - system restored');
      return true;
    } else {
      log('❌ Rollback failed - manual intervention required');
      return false;
    }
  } catch (error) {
    log('❌ Rollback error: ' + error.message);
    return false;
  }
}

function watchdog() {
  log('🔍 Watchdog started');

  setInterval(() => {
    if (!checkBuild()) {
      log('⚠️ Build failure detected - initiating self-heal');
      rollbackAndFix();
    }
  }, 300000); // Check every 5 minutes
}

if (require.main === module) {
  watchdog();
}

module.exports = { checkBuild, rollbackAndFix };
