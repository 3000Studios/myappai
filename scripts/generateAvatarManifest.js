// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.

// scripts/generateAvatarManifest.js
import fs from 'fs';
import path from 'path';

try {
  const dir = path.join(process.cwd(), 'public/sfx/avatar');
  if (!fs.existsSync(dir)) {
    console.log('No avatar sfx directory found, skipping manifest generation.');
    process.exit(0);
  }
  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.wav'));

  const manifestPath = path.join(dir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2));
  console.log(`Avatar sound manifest generated (${files.length} files).`);
} catch {
  console.log('Avatar sound manifest generation failed, continuing without manifest.');
}
