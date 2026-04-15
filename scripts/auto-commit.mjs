import { execSync } from 'child_process';
import chokidar from 'chokidar';

console.log('🚀 3000 STUDIOS: EXTREME AUTO-SYNC ENGINE ACTIVATED');

const watcher = chokidar.watch('.', {
  ignored: [/node_modules/, /.next/, /.git/],
  persistent: true,
});

let isSyncing = false;

function sync() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    console.log('🔄 Nexus Sync in progress...');
    execSync('git add .');
    const status = execSync('git status --porcelain').toString();
    if (status.trim()) {
      execSync(`git commit -m "auto: Nexus sync ${new Date().toISOString()}"`);
      execSync('git pull origin main --rebase');
      execSync('git push origin main');
      console.log('✅ Nexus State Synchronized.');
    } else {
      console.log('💎 Nexus State stable.');
    }
  } catch (err) {
    console.error('⚠️ Sync issue:', err.message);
  } finally {
    isSyncing = false;
  }
}

watcher.on('change', (path) => {
  console.log(`📝 Mutation in: ${path}`);
  sync();
});

setInterval(sync, 120000);
sync();
