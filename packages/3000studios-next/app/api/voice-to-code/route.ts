/**
 * Voice-to-Code API Route
 * Converts natural language commands into actionable code changes
 * Uses OpenAI to parse intent and generate code patches
 * SUPPORTS: File System Writes (fs/promises), File Creation, and Git Push
 */

import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import simpleGit from 'simple-git';

// Lazy-load OpenAI dynamically
let openaiInstance: any = null;

async function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiInstance) {
    try {
      const { default: OpenAI } = await import('openai');
      openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch {
      return null;
    }
  }
  return openaiInstance;
}

interface VoiceInput {
  transcript?: string;
  audio?: string;
  prompt?: string;
  currentContext?: string;
  action?: 'preview' | 'commit' | 'deploy';
  patches?: CodePatch[]; // For commit/deploy action
}

interface CodePatch {
  file: string;
  description: string;
  oldCode: string; // empty for new files
  newCode: string;
  isNewFile?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VoiceInput;
    const { transcript, audio, prompt, currentContext, action, patches } = body;

    // --- CASE 1: COMMIT or DEPLOY (Apply patches + Git push) ---
    if ((action === 'commit' || action === 'deploy') && patches && patches.length > 0) {
      const patchResults = await applyPatches(patches);

      if (action === 'deploy') {
        try {
          const git = simpleGit();
          await git.add('.');
          const commitMsg = `voice(update): ${patches.map((p) => p.description).join(', ')}`;
          await git.commit(commitMsg);
          await git.push('origin', 'main');
          return NextResponse.json({
            success: true,
            message: 'Changes applied and pushed to GitHub. Deployment triggered.',
            results: patchResults.results,
          });
        } catch (gitErr: any) {
          return NextResponse.json({
            success: true,
            warning: 'Patches applied but Git push failed: ' + gitErr.message,
            results: patchResults.results,
          });
        }
      }

      return NextResponse.json(patchResults);
    }

    // --- CASE 2: PREVIEW (Generate patches) ---
    const userInput = transcript || prompt;
    let finalTranscript = userInput || '';

    // Transcribe if Audio
    if (audio && process.env.OPENAI_API_KEY) {
      try {
        const audioBuffer = Buffer.from(audio, 'base64');
        const audioFile = new File([audioBuffer], 'audio.webm', {
          type: 'audio/webm',
        });
        const openai = await getOpenAI();
        if (openai) {
          const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
          });
          finalTranscript = transcription.text;
        }
      } catch (err: unknown) {
        console.error('', err);
      }
    }

    if (!finalTranscript) {
      return NextResponse.json({ error: 'No input detected' }, { status: 400 });
    }

    // OpenAI Generation
    const openai = await getOpenAI();
    if (!openai) {
      return NextResponse.json({
        success: true,
        intent: 'Demo Mode (No API Key)',
        description: 'Add OPENAI_API_KEY to .env for real AI code generation.',
        patches: [
          {
            file: 'app/page.tsx',
            description: 'Mock change: Update homepage title',
            oldCode: 'const title = "Welcome";',
            newCode: 'const title = "Welcome to the Future";',
          },
        ],
        action: 'preview',
      });
    }

    const systemPrompt = `You are an expert Next.js developer.
    Convert requests into file patches.
    - TARGET folders: 'app/', 'components/', 'lib/', 'voice/', 'public/', 'scripts/'.
    - If a file doesn't exist, set 'isNewFile': true and 'oldCode': "".
    - RESPOND AS JSON:
    {
      "intent": "summary of user request",
      "description": "technical breakdown",
      "patches": [{ "file": "path/relative/to/root.tsx", "description": "...", "oldCode": "exact string to replace", "newCode": "replacement content", "isNewFile": boolean }]
    }`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Request: ${finalTranscript}\nContext: Next.js App Router, Tailwind CSS, TypeScript.`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({
      success: true,
      ...parsed,
      action: 'preview',
    });
  } catch (error: unknown) {
    console.error('', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}

async function applyPatches(patches: CodePatch[]) {
  const results: any[] = [];

  for (const patch of patches) {
    try {
      // Safety Check: Avoid path traversal
      const cleanPath = path.normalize(patch.file).replace(/^(\.\.(\/|\\|$))+/, '');

      const allowedDirs = ['app', 'components', 'lib', 'voice', 'public', 'scripts', 'styles'];
      const targetDir = cleanPath.split(path.sep)[0];

      if (!allowedDirs.includes(targetDir) && !cleanPath.endsWith('.md')) {
        throw new Error(
          `Invalid file path: ${cleanPath}. Only ${allowedDirs.join(', ')} or root markdown files allowed.`
        );
      }

      const activePath = path.join(process.cwd(), cleanPath);

      // Handle New File Creation
      if (patch.isNewFile) {
        await fs.mkdir(path.dirname(activePath), { recursive: true });
        await fs.writeFile(activePath, patch.newCode, 'utf8');
        results.push({ file: cleanPath, status: 'created' });
        continue;
      }

      // Check if file exists for update
      try {
        await fs.access(activePath);
      } catch {
        throw new Error(`File not found: ${cleanPath}. Use isNewFile for new files.`);
      }

      const currentContent = await fs.readFile(activePath, 'utf8');

      if (patch.oldCode && !currentContent.includes(patch.oldCode)) {
        throw new Error(`Target code not found in ${cleanPath}. Content matching failed.`);
      }

      const newContent = patch.oldCode
        ? currentContent.replace(patch.oldCode, patch.newCode)
        : patch.newCode; // If no oldCode provided but not isNewFile, just overwrite or append?
      // Better to treat as append if not provided? No, let's stick to replace.

      await fs.writeFile(activePath, newContent, 'utf8');
      results.push({ file: cleanPath, status: 'success' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Patch application failed';
      results.push({ file: patch.file, status: 'error', error: message });
    }
  }

  return {
    success: true,
    action: 'commit',
    results,
  };
}
