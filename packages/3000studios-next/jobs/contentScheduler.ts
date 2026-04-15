/**
 * Content Scheduler
 * Generates and publishes content on a schedule
 */

export interface ScheduledContent {
  id: string;
  type: 'blog' | 'product';
  title: string;
  description: string;
  scheduledFor: number; // timestamp
  status: 'scheduled' | 'generated' | 'published' | 'failed';
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: number;
  error?: string;
}

export class ContentScheduler {
  private queue: ScheduledContent[] = [];
  private processInterval: NodeJS.Timer | null = null;

  /**
   * Schedule content generation
   */
  scheduleContent(
    content: Omit<ScheduledContent, 'id' | 'status' | 'approvedBy' | 'approvedAt' | 'error'>
  ) {
    const scheduled: ScheduledContent = {
      ...content,
      id: `scheduled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
    };

    this.queue.push(scheduled);
    return scheduled;
  }

  /**
   * Approve content for publication
   */
  approveContent(contentId: string, approver: string): boolean {
    const content = this.queue.find((c) => c.id === contentId);
    if (!content) return false;

    content.status = 'generated';
    content.approvedBy = approver;
    content.approvedAt = Date.now();
    return true;
  }

  /**
   * Process scheduled content
   */
  async processScheduledContent(): Promise<void> {
    const now = Date.now();

    for (const content of this.queue) {
      if (content.status === 'scheduled' && content.scheduledFor <= now) {
        try {
          await this.generateContent(content);
        } catch (error: unknown) {
          content.status = 'failed';
          content.error =
            error instanceof Error
              ? error instanceof Error
                ? error instanceof Error
                  ? error.message
                  : 'Unknown error'
                : 'Unknown error'
              : 'Unknown error';
        }
      }

      // Auto-publish if not requiring approval
      if (content.status === 'generated' && !content.approvalRequired) {
        await this.publishContent(content);
      }

      // Re-attempt failed content
      if (content.status === 'failed' && now - (content.scheduledFor + 3600000) > 0) {
        try {
          await this.generateContent(content);
        } catch (error: unknown) {
          console.error('[ContentScheduler] Failed to generate content:', content.id, error);
        }
      }
    }
  }

  /**
   * Generate content via API
   */
  private async generateContent(content: ScheduledContent): Promise<void> {
    let endpoint = '/api/content/generate-blog';
    if (content.type === 'product') {
      endpoint = '/api/content/generate-product';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: content.title,
        description: content.description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Content generation failed: ${response.statusText}`);
    }

    content.status = 'generated';
  }

  /**
   * Publish content
   */
  private async publishContent(content: ScheduledContent): Promise<void> {
    // Mark as published (in production, would save to database)
    content.status = 'published';
    console.log(`[ContentScheduler] Published: ${content.type} - ${content.title}`);

    // Trigger sitemap refresh
    await this.refreshSitemap();
  }

  /**
   * Refresh sitemap after new content
   */
  private async refreshSitemap(): Promise<void> {
    try {
      await fetch('/api/cron/sitemap', { method: 'POST' });
    } catch (error: unknown) {
      console.error("", error);
    }
  }

  /**
   * Start processing loop
   */
  start(intervalMs: number = 60000): void {
    if (this.processInterval) return;

    this.processInterval = setInterval(() => {
      this.processScheduledContent().catch((err) => console.error("", err));
    }, intervalMs);
  }

  /**
   * Stop processing loop
   */
  stop(): void {
    if (this.processInterval) {
      clearInterval(this.processInterval as NodeJS.Timeout);
      this.processInterval = null;
    }
  }

  /**
   * Get scheduled content
   */
  getScheduled(): ScheduledContent[] {
    return this.queue;
  }

  /**
   * Get content by status
   */
  getByStatus(status: ScheduledContent['status']): ScheduledContent[] {
    return this.queue.filter((c) => c.status === status);
  }
}

// Singleton
let scheduler: ContentScheduler | null = null;

export function getContentScheduler(): ContentScheduler {
  if (!scheduler) {
    scheduler = new ContentScheduler();
  }
  return scheduler;
}

