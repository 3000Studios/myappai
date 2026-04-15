/**
 * Anthropic Claude Service
 * Alternative AI provider for content generation
 */

import Anthropic from '@anthropic-ai/sdk';

let anthropic: Anthropic | null = null;

// Initialize Anthropic only if API key is available
if (process.env.CLAUDE_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });
}

export async function generateWithClaude(prompt: string, system?: string): Promise<string> {
  if (!anthropic) {
    throw new Error('Claude API key not configured');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: system || 'You are a helpful AI assistant for 3000 Studios.',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to generate with Claude');
  }
}

export async function generateCodeReview(code: string): Promise<string> {
  const prompt = `Review this code and provide constructive feedback:\n\n${code}`;
  const system =
    'You are an expert code reviewer. Provide specific, actionable feedback on code quality, security, and best practices.';

  return generateWithClaude(prompt, system);
}

