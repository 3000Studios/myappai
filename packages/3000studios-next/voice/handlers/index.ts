/**
 * HANDLER REGISTRY
 * Maps command types to implementation functions
 */

import type { VoiceCommand } from '../commands';

// Import all handlers
import { handleUpdateText } from './media';
import { handleAddSection } from './layout';
import { handleAddMedia } from './media';
import { handleChangeStyle } from './style';
import { handlePublishBlog } from './layout';

// Handler function signature
type CommandHandler = (cmd: VoiceCommand) => Promise<void>;

/**
 * Handler Registry
 * Maps each VoiceCommand type to its implementation
 */
export const handlers: Record<VoiceCommand['type'], CommandHandler> = {
  UPDATE_TEXT: handleUpdateText,
  ADD_SECTION: handleAddSection,
  ADD_MEDIA: handleAddMedia,
  CHANGE_STYLE: handleChangeStyle,
  PUBLISH_BLOG: handlePublishBlog,
};

