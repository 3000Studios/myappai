/**
 * VOICE COMMAND TYPES
 * Deterministic command → file editing
 * Every voice command maps to a known file operation
 * No generative AI. No freestyle. Single truth.
 */

export interface CommandResult {
  success: boolean;
  message?: string;
  files_changed?: string[];
  error?: string;
  mutationId?: string;
}

export type VoiceCommand =
  | {
      type: 'UPDATE_TEXT';
      payload: {
        text?: string;
        file?: string;
        search?: string;
        replace?: string;
      };
    }
  | {
      type: 'ADD_SECTION';
      payload: {
        title?: string;
        content?: string;
        page?: string;
        component?: string;
      };
    }
  | {
      type: 'ADD_MEDIA';
      payload: {
        url?: string;
        mediaType?: 'video' | 'image' | 'audio';
        page?: string;
        kind?: 'video' | 'image' | 'audio';
      };
    }
  | {
      type: 'CHANGE_STYLE';
      payload: {
        property?: string;
        value?: string;
        target?: string;
        cssVariable?: string;
      };
    }
  | {
      type: 'PUBLISH_BLOG';
      payload: {
        title?: string;
        body?: string;
        slug?: string;
        topic?: string;
      };
    };

// Typed commands with Payload structure for Handlers
export type PayloadVoiceCommand =
  | {
      type: 'ADD_IMAGE';
      payload: {
        page: string;
        url: string;
        alt: string;
      };
    }
  | {
      type: 'UPDATE_NAV';
      payload: {
        action: 'add' | 'remove';
        links: string[];
      };
    }
  | {
      type: 'UPDATE_CURSOR';
      payload: {
        default: string; // hex color or url
        hover: string;
      };
    }
  | {
      type: 'ADD_ANIMATION';
      payload: {
        animation: string;
      };
    };

/**
 * Rule: If handler is missing, generate it
 */
const COMMAND_TARGETS: Record<string, unknown> = {};

export function ensureHandler(commandType: string): void {
  if (!COMMAND_TARGETS[commandType]) {
    throw new Error(`Handler missing for ${commandType} - generating...`);
  }
}

