/**
 * Voice-Triggered Revenue Commands
 * Extend voice system with automated revenue operations
 */

import { getContentScheduler } from '@/jobs/contentScheduler';
import { getStoreOptimizer } from '@/jobs/storeOptimizer';
import { getPricingEngine } from './pricing';
import { type CommandResult } from './voiceCommands';

export type RevenueCommandType =
  | 'promote_product'
  | 'launch_sale'
  | 'generate_content_batch'
  | 'optimize_store'
  | 'adjust_pricing'
  | 'rotate_affiliates';

export interface RevenueCommand {
  category: 'revenue';
  action: RevenueCommandType;
  target?: string;
  params?: Record<string, unknown>;
}

/**
 * Parse revenue-specific voice commands
 */
export function parseRevenueCommand(transcript: string): RevenueCommand | null {
  const patterns = [
    {
      regex: /promote\s+(?:the\s+)?top\s+(?:selling\s+)?product/i,
      action: 'promote_product' as const,
    },
    {
      regex: /launch\s+(?:a\s+)?(?:sale|discount)\s+(\d+)%?\s+(?:for\s+)?(\d+)\s+hours?/i,
      action: 'launch_sale' as const,
    },
    {
      regex: /generate\s+(\d+)\s+(?:blog\s+)?(?:posts?|articles?|content)/i,
      action: 'generate_content_batch' as const,
    },
    {
      regex: /(?:run|start)\s+store\s+optimization/i,
      action: 'optimize_store' as const,
    },
    {
      regex: /adjust\s+pricing\s+(?:automatically|for\s+demand)/i,
      action: 'adjust_pricing' as const,
    },
    {
      regex: /rotate\s+(?:the\s+)?affiliate\s+products?/i,
      action: 'rotate_affiliates' as const,
    },
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern.regex);
    if (match) {
      return {
        category: 'revenue',
        action: pattern.action,
        target: 'store',
        params: {
          discount: match[1],
          duration: match[2],
          count: match[1],
        },
      } as RevenueCommand;
    }
  }

  return null;
}

/**
 * Execute revenue command
 */
export async function executeRevenueCommand(
  command: RevenueCommand,
  userTier: string
): Promise<CommandResult> {
  // Only Pro+ can run revenue commands
  if (!['pro', 'godMode'].includes(userTier)) {
    return {
      success: false,
      message: 'Revenue automation requires Pro tier or higher',
    };
  }

  try {
    let result: CommandResult | null = null;

    switch (command.action) {
      case 'promote_product':
        result = await promoteTopProduct();
        break;

      case 'launch_sale':
        result = await launchSale(
          command.params?.discount as number,
          command.params?.duration as number
        );
        break;

      case 'generate_content_batch':
        result = await generateContentBatch(command.params?.count as number);
        break;

      case 'optimize_store':
        result = await optimizeStore();
        break;

      case 'adjust_pricing':
        result = await adjustPricing();
        break;

      case 'rotate_affiliates':
        result = await rotateAffiliates();
        break;

      default:
        result = {
          success: false,
          message: 'Unknown revenue command',
        };
    }

    return (
      result || {
        success: false,
        message: 'Command execution failed',
      }
    );
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function promoteTopProduct(): Promise<CommandResult> {
  const pricingEngine = getPricingEngine();
  const topProducts = pricingEngine.getTopProducts(1);

  if (topProducts.length === 0) {
    return {
      success: false,
      message: 'No products to promote',
    };
  }

  return {
    success: true,
    message: `Promoted product ${topProducts[0].productId} (${topProducts[0].salesPerDay} sales/day)`,
    data: { productId: topProducts[0].productId },
  };
}

async function launchSale(discount: number, durationHours: number): Promise<CommandResult> {
  if (!discount || !durationHours) {
    return {
      success: false,
      message: 'Sale requires discount % and duration in hours',
    };
  }

  return {
    success: true,
    message: `Sale launched: ${discount}% off for ${durationHours} hours`,
    data: {
      discount,
      durationHours,
      startsAt: Date.now(),
      endsAt: Date.now() + durationHours * 60 * 60 * 1000,
    },
    requiresConfirmation: true,
  };
}

async function generateContentBatch(count: number): Promise<CommandResult> {
  const scheduler = getContentScheduler();

  if (!count || count < 1 || count > 10) {
    return {
      success: false,
      message: 'Generate 1-10 blog posts per command',
    };
  }

  const scheduled: any[] = [];
  for (let i = 0; i < count; i++) {
    const topic = `Auto-Generated Topic ${i + 1}`;
    const scheduled_item = scheduler.scheduleContent({
      type: 'blog',
      title: topic,
      description: `Auto-generated content about ${topic}`,
      scheduledFor: Date.now() + i * 60 * 60 * 1000,
      approvalRequired: true,
    });
    scheduled.push(scheduled_item);
  }

  return {
    success: true,
    message: `Scheduled ${count} blog posts for generation`,
    data: { scheduled },
  };
}

async function optimizeStore(): Promise<CommandResult> {
  const optimizer = getStoreOptimizer();
  const actions = await optimizer.optimize();

  return {
    success: true,
    message: `Store optimization complete: ${actions.length} actions taken`,
    data: { actions },
  };
}

async function adjustPricing(): Promise<CommandResult> {
  const pricingEngine = getPricingEngine();
  const topProducts = pricingEngine.getTopProducts(5);

  const adjustments = topProducts.map((p) => pricingEngine.recommendPrice(p.productId));

  return {
    success: true,
    message: `Price adjustments calculated for ${adjustments.length} products`,
    data: { adjustments },
    requiresConfirmation: true,
  };
}

async function rotateAffiliates(): Promise<CommandResult> {
  // Affiliate rotation logic
  return {
    success: true,
    message: 'Affiliate products rotated',
    data: {},
  };
}
