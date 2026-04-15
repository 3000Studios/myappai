/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { editFile } from './actions/fileEdit';
import { pushCommit } from './actions/pushCommit';
import { deploySite } from './actions/deploy';

// NATURAL LANGUAGE → COMMAND MAP
const routing = [
  { match: /gold|yellow|font.*gold/i, action: 'setFontGold' },
  { match: /deploy/i, action: 'deploy' },
  { match: /rebuild/i, action: 'rebuild' },
  { match: /status/i, action: 'status' },
  { match: /clear logs/i, action: 'clearLogs' },
];

export async function runShadowCommand(cmd: string) {
  const route = routing.find((r) => r.match.test(cmd));

  if (!route) {
    return `Unknown command: ${cmd}`;
  }

  switch (route.action) {
    case 'setFontGold':
      await editFile('app/globals.css', /color:\s*#fff;/g, 'color: gold;');

      await pushCommit('Set font color to gold');
      return 'Font changed to gold and deployed';

    case 'deploy':
      return await deploySite();

    case 'status':
      return 'Online';

    default:
      return 'Command recognized but not implemented yet';
  }
}

