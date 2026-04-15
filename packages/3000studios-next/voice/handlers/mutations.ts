/**
 * VOICE COMMAND HANDLERS
 * Executes mutations immediately - makes real file changes
 */

import { queueMutation } from '@/voice/mutation-queue';
import {
  executeAddMedia,
  executeAddSection,
  executeChangeStyle,
  executePublishBlog,
  executeUpdateText,
} from './executors';

interface MutationResult {
  success: boolean;
  message: string;
  mutationId?: string;
  filesChanged?: string[];
}

export async function handleUpdateText(newText: string): Promise<MutationResult> {
  try {
    // Execute the mutation immediately
    const result = await executeUpdateText(newText);

    // Also queue for audit log
    const mutation = await queueMutation({
      type: 'UPDATE_TEXT',
      payload: { newText },
    });

    return {
      ...result,
      mutationId: mutation.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Failed to update text: ${error}`,
    };
  }
}

export async function handleAddSection(
  sectionTitle: string,
  sectionContent: string
): Promise<MutationResult> {
  try {
    const result = await executeAddSection(sectionTitle, sectionContent);
    const mutation = await queueMutation({
      type: 'ADD_SECTION',
      payload: { sectionTitle, sectionContent },
    });

    return {
      ...result,
      mutationId: mutation.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Failed to add section: ${error}`,
    };
  }
}

export async function handleAddMedia(
  mediaUrl: string,
  type: 'video' | 'image' = 'image'
): Promise<MutationResult> {
  try {
    const result = await executeAddMedia(mediaUrl, type);
    const mutation = await queueMutation({
      type: 'ADD_MEDIA',
      payload: { mediaUrl, type },
    });

    return {
      ...result,
      mutationId: mutation.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Failed to add media: ${error}`,
    };
  }
}

export async function handleChangeStyle(
  cssVariable: string,
  value: string
): Promise<MutationResult> {
  try {
    const result = await executeChangeStyle(cssVariable, value);
    const mutation = await queueMutation({
      type: 'CHANGE_STYLE',
      payload: { cssVariable, value },
    });

    return {
      ...result,
      mutationId: mutation.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Failed to change style: ${error}`,
    };
  }
}

export async function handlePublishBlog(
  title: string,
  body: string,
  slug?: string
): Promise<MutationResult> {
  try {
    const result = await executePublishBlog(title, body, slug);
    const mutation = await queueMutation({
      type: 'PUBLISH_BLOG',
      payload: { title, body, slug },
    });

    return {
      ...result,
      mutationId: mutation.id,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Failed to publish blog: ${error}`,
    };
  }
}

