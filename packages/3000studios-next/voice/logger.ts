/**
 * VOICE COMMAND LOGGER
 * Server-side logging for all voice mutations
 * Persists to database for /admin/voice-log dashboard
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface VoiceLogEntry {
  id: string;
  timestamp: string;
  command: string;
  input: Record<string, unknown>;
  output: {
    status: string;
    message: string;
    mutationId?: string;
  };
  duration: number; // milliseconds
}

const LOG_FILE = path.join(process.cwd(), '.voice-commands.jsonl');

/**
 * Log a voice command execution
 */
export async function logVoiceCommand(
  command: string,
  input: Record<string, unknown>,
  output: {
    status: string;
    message: string;
    mutationId?: string;
  },
  duration: number
): Promise<VoiceLogEntry> {
  const entry: VoiceLogEntry = {
    id: `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    command,
    input,
    output,
    duration,
  };

  try {
    // Log to console (Vercel logs capture this)
    console.log(
      `[VOICE COMMAND] ${entry.id} | ${command} | ${duration}ms | ${output.status}`,
      output.message
    );

    // In production, this would write to database
    // For now, log to file for local development
    if (process.env.NODE_ENV !== 'production') {
      try {
        await fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', 'utf-8');
      } catch (e: unknown) {
        // File write may fail in serverless environment
        console.warn('', e);
      }
    }
  } catch (error: unknown) {
    console.error('', error);
  }

  return entry;
}

/**
 * Get recent voice command logs
 */
export async function getVoiceCommandLogs(limit: number = 50): Promise<VoiceLogEntry[]> {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, would query database
      // For now, return empty array
      return [];
    }

    const content = await fs.readFile(LOG_FILE, 'utf-8');
    const lines = content.split('\n').filter((line) => line.trim());
    const entries = lines.map((line) => JSON.parse(line));
    return entries.slice(-limit);
  } catch (error: unknown) {
    console.error('', error);
    return [];
  }
}

/**
 * Clear old voice command logs
 */
export async function clearVoiceCommandLogs(): Promise<void> {
  try {
    if (process.env.NODE_ENV !== 'production') {
      await fs.unlink(LOG_FILE);
    }
  } catch (error: unknown) {
    console.error('', error);
  }
}

