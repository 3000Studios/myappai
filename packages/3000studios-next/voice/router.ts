/**
 * VOICE COMMAND ROUTER
 * Maps VoiceCommand → Mutation queue → Auto-commit sync
 * Serverless-safe: queues changes for next sync cycle
 */

import { VoiceCommand } from './commands';
import {
  handleAddMedia,
  handleAddSection,
  handleChangeStyle,
  handlePublishBlog,
  handleUpdateText,
} from './handlers/mutations';

export async function routeVoiceCommand(
  cmd: VoiceCommand
): Promise<{ success: boolean; message: string; mutationId?: string }> {
  try {
    // Route to appropriate handler based on command type
    switch (cmd.type) {
      case 'UPDATE_TEXT':
        return await handleUpdateText(cmd.payload.text || 'New Headline');

      case 'ADD_SECTION':
        return await handleAddSection(
          cmd.payload.title || 'New Section',
          cmd.payload.content || 'Section content here'
        );

      case 'ADD_MEDIA':
        return await handleAddMedia(
          cmd.payload.url || '/media/sample.mp4',
          cmd.payload.mediaType as 'video' | 'image'
        );

      case 'CHANGE_STYLE':
        return await handleChangeStyle(
          cmd.payload.property || 'primary-color',
          cmd.payload.value || '#00ffff'
        );

      case 'PUBLISH_BLOG':
        return await handlePublishBlog(
          cmd.payload.title || 'New Blog Post',
          cmd.payload.body || 'Blog content here',
          cmd.payload.slug
        );

      default:
        return {
          success: false,
          message: `No handler for command type: ${(cmd as { type: string }).type}`,
        };
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error instanceof Error
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Unknown error'
        : String(error);
    return {
      success: false,
      message,
    };
  }
}

