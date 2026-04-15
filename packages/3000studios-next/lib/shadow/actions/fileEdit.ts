/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import fs from 'fs';
import path from 'path';

export async function editFile(filePath: string, find: string | RegExp, replace: string) {
  const full = path.join(process.cwd(), filePath);

  const data = fs.readFileSync(full, 'utf8');
  const updated = data.replace(find, replace);

  fs.writeFileSync(full, updated, 'utf8');

  return true;
}

