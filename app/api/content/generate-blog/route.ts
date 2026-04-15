/**
 * Content Generation - Blog Posts API Route
 * AI-powered blog post generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/services/openai';
import { createPost } from '@/lib/services/wordpress';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, keywords, publishToWordPress } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic required' }, { status: 400 });
    }

    // Generate blog post using AI
    const content = await generateBlogPost(topic, keywords || []);

    // Extract title from content (assume first line is title)
    const lines = content.split('\n');
    const title = lines[0].replace(/^#\s*/, '');
    const bodyContent = lines.slice(1).join('\n');

    // Publish to WordPress if requested
    let wordpressId: number | null = null;
    if (publishToWordPress) {
      try {
        wordpressId = await createPost({
          title,
          content: bodyContent,
          status: 'draft', // Save as draft for review
          excerpt: bodyContent.substring(0, 200),
        });
      } catch (wpError: unknown) {
        console.error('WordPress publish error:', wpError);
        // Continue even if WordPress fails
      }
    }

    return NextResponse.json({
      success: true,
      title,
      content: bodyContent,
      fullContent: content,
      wordpressId,
      message: wordpressId
        ? 'Blog post generated and saved to WordPress as draft'
        : 'Blog post generated successfully',
    });
  } catch (error: unknown) {
    console.error('', error);
    return NextResponse.json({ error: 'Failed to generate blog post' }, { status: 500 });
  }
}
