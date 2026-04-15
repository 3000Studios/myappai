/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { execSync } from 'child_process';

export async function pushCommit(msg: string) {
  execSync('git add .');
  execSync(`git commit -m "${msg}"`);
  execSync('git push origin main');

  return 'Pushed to GitHub';
}

