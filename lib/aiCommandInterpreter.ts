/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface InterpretedCommand {
  action: string;
  parameters?: Record<string, unknown>;
  description: string;
}

export async function interpretCommand(humanCommand: string): Promise<InterpretedCommand> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a technical command interpreter. Convert natural language into technical actions.
          
Available actions:
- deploy: Deploy the site to production
- build: Build the Next.js project
- git-push: Commit and push to GitHub
- status: Check repository status
- update-hero: Update the hero section
- update-navbar: Update navigation
- update-colors: Change site colors
- add-feature: Add new feature
- fix-errors: Fix compilation errors
- seo-optimize: Optimize SEO
- generate-content: Generate new content
- install-package: Install npm package
- create-file: Create new file
- update-file: Update existing file

Respond ONLY with a JSON object in this format:
{
  "action": "action-name",
  "parameters": { "key": "value" },
  "description": "what this will do"
}

Examples:
Input: "deploy my site to production"
Output: {"action": "deploy", "parameters": {}, "description": "Deploy site to Vercel production"}

Input: "change the hero text to Welcome to 3000 Studios"
Output: {"action": "update-hero", "parameters": {"text": "Welcome to 3000 Studios"}, "description": "Update hero section text"}

Input: "install three.js package"
Output: {"action": "install-package", "parameters": {"package": "three"}, "description": "Install three.js package"}`,
        },
        {
          role: 'user',
          content: humanCommand,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      action: parsed.action || 'unknown',
      parameters: parsed.parameters || {},
      description: parsed.description || 'No description available',
    };
  } catch (error: unknown) {
    console.error("", error);
    // Fallback to simple keyword matching
    return fallbackInterpretation(humanCommand);
  }
}

function fallbackInterpretation(command: string): InterpretedCommand {
  const lower = command.toLowerCase();

  if (lower.includes('deploy')) {
    return {
      action: 'deploy',
      parameters: {},
      description: 'Deploy to production',
    };
  }
  if (lower.includes('push') || lower.includes('github')) {
    return {
      action: 'git-push',
      parameters: {},
      description: 'Push to GitHub',
    };
  }
  if (lower.includes('build')) {
    return { action: 'build', parameters: {}, description: 'Build project' };
  }
  if (lower.includes('fix')) {
    return { action: 'fix-errors', parameters: {}, description: 'Fix errors' };
  }
  if (lower.includes('hero')) {
    return {
      action: 'update-hero',
      parameters: {},
      description: 'Update hero section',
    };
  }

  return {
    action: 'unknown',
    parameters: {},
    description: 'Command not recognized',
  };
}

