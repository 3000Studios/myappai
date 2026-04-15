/**
 * GitHub Service
 * Handles repository operations and auto-commits
 */

import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_PAT,
});

const REPO_OWNER = '3000Studios'; // Update with actual owner
const REPO_NAME = '3000studios-next'; // Update with actual repo name

export interface CommitFileChange {
  path: string;
  content: string;
  message: string;
}

export async function createCommit(changes: CommitFileChange[]): Promise<string> {
  try {
    const owner = REPO_OWNER;
    const repo = REPO_NAME;
    const branch = 'main';

    // Get the current commit SHA
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const currentCommitSha = refData.object.sha;

    // Get the tree for the current commit
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: currentCommitSha,
    });
    const currentTreeSha = commitData.tree.sha;

    // Create blobs for each file
    const blobs = await Promise.all(
      changes.map(async (change) => {
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(change.content).toString('base64'),
          encoding: 'base64',
        });
        return {
          path: change.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );

    // Create a new tree
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: currentTreeSha,
      tree: blobs,
    });

    // Create a new commit
    const commitMessage =
      changes.length === 1
        ? changes[0].message
        : `Update ${changes.length} files via voice command`;

    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [currentCommitSha],
    });

    // Update the reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return newCommit.sha;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to create GitHub commit');
  }
}

export async function getFileContent(path: string): Promise<string> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    if ('content' in data) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    throw new Error('File not found');
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to get file content');
  }
}

export async function createBranch(branchName: string): Promise<void> {
  try {
    const { data: refData } = await octokit.git.getRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: 'heads/main',
    });

    await octokit.git.createRef({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: `refs/heads/${branchName}`,
      sha: refData.object.sha,
    });
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to create branch');
  }
}

export async function createPullRequest(
  title: string,
  body: string,
  headBranch: string
): Promise<number> {
  try {
    const { data } = await octokit.pulls.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title,
      body,
      head: headBranch,
      base: 'main',
    });

    return data.number;
  } catch (error: unknown) {
    console.error("", error);
    throw new Error('Failed to create pull request');
  }
}

