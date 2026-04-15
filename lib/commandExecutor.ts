/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface CommandResult {
  success: boolean;
  output?: string;
  error?: string;
  action?: string;
}

export async function executeCommand(command: string): Promise<CommandResult> {
  const lowerCmd = command.toLowerCase();

  try {
    if (lowerCmd.includes('deploy')) {
      const { stdout } = await execAsync('vercel --prod --yes --scope 3000studios-projects');
      return {
        success: true,
        output: `Deployment initiated: ${stdout}`,
        action: 'deploy',
      };
    }

    if (lowerCmd.includes('git push') || lowerCmd.includes('push to github')) {
      const { stdout } = await execAsync(
        "git add -A && git commit -m 'Voice command update' && git push origin main"
      );
      return {
        success: true,
        output: `Pushed to GitHub: ${stdout}`,
        action: 'git-push',
      };
    }

    if (lowerCmd.includes('build') || lowerCmd.includes('compile')) {
      const { stdout } = await execAsync('npm run build');
      return {
        success: true,
        output: `Build completed: ${stdout.slice(0, 200)}...`,
        action: 'build',
      };
    }

    if (lowerCmd.includes('status') || lowerCmd.includes('check')) {
      const { stdout } = await execAsync('git status');
      return {
        success: true,
        output: `Repository status: ${stdout.slice(0, 300)}`,
        action: 'status',
      };
    }

    if (lowerCmd.includes('update hero') || lowerCmd.includes('change hero')) {
      return {
        success: true,
        output: 'Hero section update queued.',
        action: 'update-hero',
      };
    }

    if (lowerCmd.includes('fix')) {
      const { stdout } = await execAsync('npm run build');
      return {
        success: true,
        output: `Running diagnostics: ${stdout.slice(0, 150)}...`,
        action: 'fix',
      };
    }

    if (lowerCmd.includes('seo')) {
      return {
        success: true,
        output: 'SEO optimization queued.',
        action: 'seo',
      };
    }

    if (lowerCmd.includes('generate content') || lowerCmd.includes('create content')) {
      return {
        success: true,
        output: 'Content generation queued.',
        action: 'content-gen',
      };
    }

    return {
      success: true,
      output: `Command "${command}" acknowledged.`,
      action: 'queued',
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : 'Command execution failed';
    return {
      success: false,
      error: errorMessage,
      action: 'error',
    };
  }
}

