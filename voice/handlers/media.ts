/**
 * MEDIA HANDLERS
 * Handle: UPDATE_TEXT, ADD_MEDIA
 */

import { promises as fs } from 'fs';
import path from 'path';
import { CommandResult, PayloadVoiceCommand, VoiceCommand } from '../commands';

/**
 * UPDATE_TEXT: Search and replace in a file
 * Deterministic: file path, search string, replacement string
 */
export async function handleUpdateText(cmd: VoiceCommand): Promise<void> {
  if (cmd.type !== 'UPDATE_TEXT') return;
  const { file, search, replace } = cmd.payload;
  if (!file || !search || replace === undefined) {
    throw new Error('File, search, and replace are required for updating text');
  }
  const filePath = path.join(process.cwd(), file);

  try {
    let content = await fs.readFile(filePath, 'utf-8');

    if (!content.includes(search)) {
      throw new Error(`Search string not found in ${file}`);
    }

    content = content.replace(search, replace);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error: unknown) {
    throw error;
  }
}

/**
 * ADD_MEDIA: Add video, image, or audio to a page
 * Deterministic: page, URL, kind (video|image|audio)
 */
export async function handleAddMedia(cmd: VoiceCommand): Promise<void> {
  if (cmd.type !== 'ADD_MEDIA') return;
  const { page, url, kind } = cmd.payload;
  if (!page || !url || !kind) {
    throw new Error('Page, URL, and kind are required for adding media');
  }
  const filePath = path.join(process.cwd(), `app/${page}/page.tsx`);

  try {
    let content = await fs.readFile(filePath, 'utf-8');

    let mediaElement = '';

    if (kind === 'video') {
      mediaElement = `
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-auto"
>
  <source src="${url}" type="video/mp4" />
</video>`;
    } else if (kind === 'image') {
      mediaElement = `<img src="${url}" alt="Added media" className="w-full h-auto" />`;
    } else if (kind === 'audio') {
      mediaElement = `<audio autoPlay loop className="w-full"><source src="${url}" type="audio/mpeg" /></audio>`;
    }

    // Insert before the last closing tag
    content = content.replace(/([\s\S]*?)<\/main>/, `$1${mediaElement}\n</main>`);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error: unknown) {
    throw error;
  }
}

export async function handleAddImage(
  command: Extract<PayloadVoiceCommand, { type: 'ADD_IMAGE' }>
): Promise<CommandResult> {
  const { page, url, alt } = command.payload;
  const targetFile = `src/app/${page}/page.tsx`;

  try {
    let content = await fs.readFile(targetFile, 'utf-8');

    const imageComponent = `
      <Image
        src="${url}"
        alt="${alt}"
        width={1920}
        height={1080}
        className="w-full h-auto"
        priority
      />
    `;

    content = content.replace(/(<section[^>]*>)/, `$1\n${imageComponent}`);

    await fs.writeFile(targetFile, content, 'utf-8');

    return {
      success: true,
      files_changed: [targetFile],
    };
  } catch (error: unknown) {
    return {
      success: false,
      files_changed: [],
      error:
        error instanceof Error
          ? error instanceof Error
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Unknown error'
          : 'Unknown error',
    };
  }
}

