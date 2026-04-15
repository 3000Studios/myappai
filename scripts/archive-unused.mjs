import fs from 'fs';
import path from 'path';

const ARCHIVE = 'archive';
if (!fs.existsSync(ARCHIVE)) fs.mkdirSync(ARCHIVE);

['backup', 'old', 'unused', 'tmp'].forEach((d) => {
  if (fs.existsSync(d)) {
    const dest = path.join(ARCHIVE, d);
    // If dest exists, we might need to rename or merge. For simplicity, we'll just move.
    // If it's a directory, we move it.
    try {
      fs.renameSync(d, dest);
      console.log(`Archived ${d}`);
    } catch (e) {
      console.error(`Failed to archive ${d}:`, e.message);
    }
  }
});
