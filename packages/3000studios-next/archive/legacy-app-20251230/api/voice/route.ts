/**
 * VOICE API ENDPOINT
 * Receives voice commands → routes → commits → deploys
 */

import type { VoiceCommand } from '@/voice/commands';
import { routeCommand, validateCommand } from '@/voice/handlers/router';
import { NextRequest, NextResponse } from 'next/server';

// Legacy transcript parsing (for backward compatibility)
const colorMap: Record<string, string> = {
  blue: '#2563eb',
  purple: '#8b5cf6',
  pink: '#ec4899',
  green: '#22c55e',
  orange: '#f97316',
  red: '#ef4444',
};

type VoiceAction =
  | { type: 'setTheme'; value: 'dark' | 'light' }
  | { type: 'setAccent'; value: string }
  | { type: 'message'; value: string };

type VoiceResponse = {
  summary: string;
  actions: VoiceAction[];
};

function parseActions(transcript: string): VoiceResponse {
  const normalized = transcript.toLowerCase();
  const actions: VoiceAction[] = [];

  if (normalized.includes('dark mode') || normalized.includes('dark theme')) {
    actions.push({ type: 'setTheme', value: 'dark' });
  }
  if (normalized.includes('light mode') || normalized.includes('light theme')) {
    actions.push({ type: 'setTheme', value: 'light' });
  }

  const colorMatch = normalized.match(/(blue|purple|pink|green|orange|red)(?![a-z])/);
  if (colorMatch) {
    const color = colorMatch[1];
    actions.push({ type: 'setAccent', value: colorMap[color] ?? color });
  }

  if (actions.length === 0) {
    actions.push({ type: 'message', value: 'No actionable change found' });
  }

  const summaryParts = actions.map((action) => {
    if (action.type === 'setTheme') return `Theme → ${action.value}`;
    if (action.type === 'setAccent') return `Accent → ${action.value}`;
    return action.value;
  });

  return {
    summary: summaryParts.join('; ') || 'No change',
    actions,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    // NEW: Structured command API
    if (body && 'type' in body && 'payload' in body) {
      const command = body as VoiceCommand;

      // Validate command
      if (!validateCommand(command)) {
        return NextResponse.json({ error: 'Invalid command structure' }, { status: 400 });
      }

      // Route and execute
      const result = await routeCommand(command);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error, files_changed: result.files_changed },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        files_changed: result.files_changed,
        commit_sha: result.commit_sha,
        message: `Command executed: ${command.type}`,
      });
    }

    // LEGACY: Transcript parsing (backward compatibility)
    const transcript = typeof body?.transcript === 'string' ? body.transcript : '';

    if (!transcript.trim()) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    if (transcript.length > 800) {
      return NextResponse.json({ error: 'Transcript too long' }, { status: 413 });
    }

    const response = parseActions(transcript);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") : 'Unknown error' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({
    status: 'operational',
    endpoints: {
      POST: '/api/voice',
    },
    commands: [
      'ADD_SECTION',
      'UPDATE_TEXT',
      'ADD_VIDEO',
      'ADD_IMAGE',
      'ADD_AUDIO',
      'CHANGE_THEME',
      'UPDATE_NAV',
      'PUBLISH_BLOG',
      'UPDATE_LAYOUT',
      'ADD_CTA',
      'UPDATE_CURSOR',
      'ADD_ANIMATION',
      'TOGGLE_FEATURE',
    ],
  });
}

