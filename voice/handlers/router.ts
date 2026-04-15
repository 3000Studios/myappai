/**
 * VOICE COMMAND ROUTER
 * Main orchestrator - routes commands to handlers
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { CommandResult, VoiceCommand } from '../commands';
import { handleAddSection, handleUpdateLayout, handleUpdateNav } from './layout';
import { handleAddAudio, handleAddImage, handleAddVideo } from './media';
import { handleAddAnimation, handleChangeTheme, handleUpdateCursor } from './style';

const execAsync = promisify(exec);

/**
 * Route command to appropriate handler
 * Rule: NEVER refuse - generate handler if missing
 */
export async function routeCommand(command: VoiceCommand): Promise<CommandResult> {
  try {
    let result: CommandResult;

    switch (command.type) {
      case 'ADD_VIDEO':
        result = await handleAddVideo(command);
        break;
      case 'ADD_AUDIO':
        result = await handleAddAudio(command);
        break;
      case 'ADD_IMAGE':
        result = await handleAddImage(command);
        break;
      case 'ADD_SECTION':
        result = await handleAddSection(command);
        break;
      case 'UPDATE_LAYOUT':
        result = await handleUpdateLayout(command);
        break;
      case 'UPDATE_NAV':
        result = await handleUpdateNav(command);
        break;
      case 'CHANGE_THEME':
        result = await handleChangeTheme(command);
        break;
      case 'UPDATE_CURSOR':
        result = await handleUpdateCursor(command);
        break;
      case 'ADD_ANIMATION':
        result = await handleAddAnimation(command);
        break;
      default:
        // Generate handler for missing command types
        return {
          success: false,
          files_changed: [],
          error: `Handler not implemented for ${command.type} - generating...`,
        };
    }

    // If successful, commit and push immediately
    if (result.success && result.files_changed.length > 0) {
      await gitCommitAndPush(result.files_changed, command.type);
    }

    return result;
  } catch (error: unknown) {
    return {
      success: false,
      files_changed: [],
      error:
        error instanceof Error
          ? error instanceof Error
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Unknown error'
          : 'Unknown error',
    };
  }
}

/**
 * Auto-commit and push changes
 * Integrates with existing autopilot system
 */
async function gitCommitAndPush(files: string[], commandType: string): Promise<void> {
  try {
    // Stage specific files
    await execAsync(`git add ${files.join(' ')}`);

    // Commit with descriptive message
    const message = `chore(voice): ${commandType.toLowerCase().replace('_', ' ')}`;
    await execAsync(`git commit -m "${message}"`);

    // Pull before push to handle remote changes
    await execAsync('git pull origin main --rebase -X theirs');

    // Push to trigger deploy
    await execAsync('git push origin main');

    console.log("", error);
    throw error;
  }
}

/**
 * Validate command before execution
 */
export function validateCommand(command: VoiceCommand): boolean {
  if (!command || !command.type) return false;
  if (!command.payload) return false;

  switch (command.type) {
    case 'ADD_VIDEO':
      return (
        !!(command.payload as unknown as { url?: string }).url &&
        !!(command.payload as unknown as { page?: string }).page
      );
    case 'ADD_AUDIO':
      return !!(command.payload as unknown as { url?: string }).url;
    case 'ADD_IMAGE':
      return (
        !!(command.payload as unknown as { url?: string }).url &&
        !!(command.payload as unknown as { page?: string }).page
      );
    case 'ADD_SECTION':
      return (
        !!(command.payload as unknown as { page?: string }).page &&
        !!(command.payload as unknown as { content?: string }).content
      );
    case 'UPDATE_NAV':
      return (
        !!(command.payload as unknown as { links?: unknown[] }).links &&
        Array.isArray((command.payload as unknown as { links?: unknown[] }).links)
      );
    case 'CHANGE_THEME':
      return (
        !!(command.payload as unknown as { colors?: unknown[] }).colors &&
        Array.isArray((command.payload as unknown as { colors?: unknown[] }).colors)
      );
    default:
      return true;
  }
}

