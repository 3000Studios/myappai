/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import fs from 'fs/promises';
import path from 'path';

interface CommandPayload {
  [key: string]: unknown;
}

export class ShadowEngine {
  async process(text: string) {
    return this.execute(text, {});
  }
  async execute(command: string, payload: CommandPayload = {}) {
    command = command.toLowerCase().trim();

    if (command.includes('update wordpress file')) {
      return await this.updateWP(payload as { file: string; content: string });
    }

    if (command.includes('edit file')) {
      return await this.editFile(payload as { file: string; content: string });
    }

    if (command.includes('say')) {
      return { ok: true, message: payload.text };
    }

    return { ok: false, error: 'Unknown command' };
  }

  async updateWP({ file, content }: { file: string; content: string }) {
    // WordPress update will be handled via wp.ts
    const { runWordPressUpdate } = await import('../auth/wp');
    const result = await runWordPressUpdate(file, content);
    return {
      ok: true,
      action: 'wordpress_file_update',
      result,
    };
  }

  async editFile({ file, content }: { file: string; content: string }) {
    const target = path.join(process.cwd(), file);
    await fs.writeFile(target, content, 'utf8');

    return {
      ok: true,
      action: 'local_file_edit',
      file,
      length: content.length,
    };
  }
}

export const shadowEngine = new ShadowEngine();

