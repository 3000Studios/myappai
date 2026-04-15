/**
 * Voice Command Router
 * Parse voice intent and route to appropriate handlers
 */

export type CommandCategory = 'content' | 'store' | 'system' | 'admin';

export interface VoiceCommand {
  category: CommandCategory;
  action: string;
  target?: string;
  value?: string;
  params?: Record<string, unknown>;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: unknown;
  requiresConfirmation?: boolean;
  previewUrl?: string;
}

export interface CommandHandler {
  pattern: RegExp;
  category: CommandCategory;
  action: string;
  handler: (match: RegExpMatchArray) => VoiceCommand;
}

// Vendor-specific voice intents (Matrix control)
export const VENDOR_COMMANDS = [
  {
    pattern: /add vendor (.*)/i,
    action: 'ADD_VENDOR',
  },
  {
    pattern: /sync vendor products/i,
    action: 'SYNC_VENDORS',
  },
  {
    pattern: /show top selling products/i,
    action: 'SHOW_TOP_PRODUCTS',
  },
];

const commandPatterns: CommandHandler[] = [
  // Content Commands
  {
    pattern: /(?:update|change)\s+(?:the\s+)?homepage\s+(?:hero|headline)\s+(?:to\s+)?(.+)/i,
    category: 'content',
    action: 'update_homepage_hero',
    handler: (match) => ({
      category: 'content',
      action: 'update_homepage_hero',
      value: match[1],
    }),
  },
  {
    pattern: /publish\s+(?:a\s+)?blog\s+(?:post\s+)?(?:about\s+)?(.+)/i,
    category: 'content',
    action: 'publish_blog',
    handler: (match) => ({
      category: 'content',
      action: 'publish_blog',
      target: 'blog',
      value: match[1],
    }),
  },
  {
    pattern: /change\s+(?:the\s+)?hero\s+image\s+(?:to\s+)?(.+)/i,
    category: 'content',
    action: 'change_hero_image',
    handler: (match) => ({
      category: 'content',
      action: 'change_hero_image',
      value: match[1],
    }),
  },

  // Store Commands
  {
    pattern: /change\s+(?:the\s+)?price\s+(?:of\s+)?(.+?)\s+to\s+\$?(\d+(?:\.\d{2})?)/i,
    category: 'store',
    action: 'update_product_price',
    handler: (match) => ({
      category: 'store',
      action: 'update_product_price',
      target: match[1],
      value: match[2],
    }),
  },
  {
    pattern:
      /add\s+(?:a\s+)?(?:new\s+)?product\s+called\s+(.+?)\s+(?:for|at)\s+\$?(\d+(?:\.\d{2})?)/i,
    category: 'store',
    action: 'add_product',
    handler: (match) => ({
      category: 'store',
      action: 'add_product',
      target: match[1],
      value: match[2],
    }),
  },
  {
    pattern: /(?:disable|remove|delete)\s+(?:the\s+)?product\s+(.+)/i,
    category: 'store',
    action: 'disable_product',
    handler: (match) => ({
      category: 'store',
      action: 'disable_product',
      target: match[1],
    }),
  },
  {
    pattern: /sync\s+vendor\s+products/i,
    category: 'store',
    action: 'sync_vendors',
    handler: () => ({
      category: 'store',
      action: 'sync_vendors',
    }),
  },
  {
    pattern: /add\s+vendor\s+(.*)/i,
    category: 'store',
    action: 'add_vendor',
    handler: (match) => ({
      category: 'store',
      action: 'add_vendor',
      target: match[1],
    }),
  },
  {
    pattern: /show\s+(?:top\s+)?selling\s+products/i,
    category: 'store',
    action: 'show_top_products',
    handler: () => ({
      category: 'store',
      action: 'show_top_products',
    }),
  },
  {
    pattern: /auto[- ]price\s+(.+)/i,
    category: 'store',
    action: 'auto_price_product',
    handler: (match) => ({
      category: 'store',
      action: 'auto_price_product',
      target: match[1],
    }),
  },
  {
    pattern: /generate\s+product\s+page\s+(?:for\s+)?(.+)/i,
    category: 'store',
    action: 'generate_product_page',
    handler: (match) => ({
      category: 'store',
      action: 'generate_product_page',
      target: match[1],
    }),
  },

  // System Commands
  {
    pattern: /deploy\s+(?:the\s+)?site|deploy\s+now/i,
    category: 'system',
    action: 'deploy_site',
    handler: () => ({
      category: 'system',
      action: 'deploy_site',
    }),
  },
  {
    pattern: /rollback\s+(?:the\s+)?(?:last\s+)?deploy(?:ment)?/i,
    category: 'system',
    action: 'rollback_deployment',
    handler: () => ({
      category: 'system',
      action: 'rollback_deployment',
    }),
  },
  {
    pattern: /show\s+(?:me\s+)?(?:the\s+)?revenue\s+(?:for\s+)?(?:today|this\s+month|this\s+week)/i,
    category: 'system',
    action: 'show_revenue',
    handler: (match) => ({
      category: 'system',
      action: 'show_revenue',
      params: { period: match[1] || 'today' },
    }),
  },
  {
    pattern: /enable\s+voice\s+only\s+mode|matrix\s+os\s+mode/i,
    category: 'system',
    action: 'enable_voice_only',
    handler: () => ({
      category: 'system',
      action: 'enable_voice_only',
    }),
  },

  // Admin Commands
  {
    pattern: /grant\s+access\s+(?:to\s+)?(.+)/i,
    category: 'admin',
    action: 'grant_access',
    handler: (match) => ({
      category: 'admin',
      action: 'grant_access',
      target: match[1],
    }),
  },
  {
    pattern: /revoke\s+access\s+(?:from\s+)?(.+)/i,
    category: 'admin',
    action: 'revoke_access',
    handler: (match) => ({
      category: 'admin',
      action: 'revoke_access',
      target: match[1],
    }),
  },
  {
    pattern: /show\s+(?:me\s+)?(?:the\s+)?audit\s+logs?/i,
    category: 'admin',
    action: 'show_audit_logs',
    handler: () => ({
      category: 'admin',
      action: 'show_audit_logs',
    }),
  },
];

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  const normalizedTranscript = transcript.trim();

  for (const pattern of commandPatterns) {
    const match = normalizedTranscript.match(pattern.pattern);
    if (match) {
      return pattern.handler(match);
    }
  }

  return null;
}

export function validateCommand(
  command: VoiceCommand,
  userRole: string
): { valid: boolean; reason?: string } {
  // Admin commands require admin role
  if (command.category === 'admin' && userRole !== 'admin') {
    return { valid: false, reason: 'Admin access required' };
  }

  // System commands require at least pro tier
  if (command.category === 'system' && !['admin', 'pro', 'godMode'].includes(userRole)) {
    return { valid: false, reason: 'Pro tier or higher required' };
  }

  return { valid: true };
}

export async function executeCommand(
  command: VoiceCommand,
  userRole: string
): Promise<CommandResult> {
  // Validate command authorization
  const validation = validateCommand(command, userRole);
  if (!validation.valid) {
    return {
      success: false,
      message: validation.reason || 'Unauthorized',
    };
  }

  // Execute command based on category and action
  try {
    const response = await fetch('/api/voice-to-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        command: command.action,
        category: command.category,
        target: command.target,
        value: command.value,
        params: command.params,
      }),
    });

    const result = await response.json();
    return {
      success: result.success,
      message: result.message || 'Command executed successfully',
      data: result.data,
      requiresConfirmation: result.requiresConfirmation,
      previewUrl: result.previewUrl,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error instanceof Error
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Unknown error'
          : 'Failed to execute command',
    };
  }
}

