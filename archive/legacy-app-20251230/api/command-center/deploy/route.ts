import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import simpleGit from 'simple-git';
import * as Diff from 'diff';
import * as fs from 'fs/promises';
import * as path from 'path';

const git = simpleGit();

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { preview } = await req.json();

    // Parse the preview to extract file changes
    const changes = parsePreviewChanges(preview);

    // Apply changes to files
    for (const change of changes) {
      await applyFileChange(change);
    }

    // Generate commit message
    const commitMessage = `feat(command-center): ${changes.map((c) => c.description).join(', ')}`;

    // Git operations
    await git.add('./*');
    await git.commit(commitMessage);
    await git.push('origin', 'main');

    return NextResponse.json({
      success: true,
      message: 'Changes committed and deployed to production',
      commitMessage,
    });
  } catch (error: unknown) {
    console.error("", error);
    return NextResponse.json(
      { error: 'Failed to deploy changes', details: (error instanceof Error ? (error instanceof Error ? error.message : "Unknown error") : "Unknown error") },
      { status: 500 }
    );
  }
}

interface FileChange {
  filePath: string;
  content: string;
  description: string;
  operation: 'create' | 'update' | 'delete';
}

function parsePreviewChanges(preview: string): FileChange[] {
  // Parse the preview string to extract file changes
  // This is a placeholder - implement proper parsing

  const changes: FileChange[] = [];

  // Example: extract file path and content from preview
  const filePathMatch = preview.match(/\/\/\s*(.+\.tsx?)/);
  if (filePathMatch) {
    changes.push({
      filePath: filePathMatch[1],
      content: preview,
      description: 'Update from command center',
      operation: 'update',
    });
  }

  return changes;
}

async function applyFileChange(change: FileChange) {
  const fullPath = path.join(process.cwd(), change.filePath);

  switch (change.operation) {
    case 'create':
    case 'update':
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, change.content, 'utf-8');
      break;

    case 'delete':
      await fs.unlink(fullPath);
      break;
  }
}

