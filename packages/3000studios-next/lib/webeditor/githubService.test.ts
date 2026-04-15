import { beforeEach, describe, expect, it, vi } from 'vitest';
import { executeGitHubCommand } from './githubService';

// Mock Octokit with shared state
const mockRepos = {
  getContent: vi.fn(),
  createOrUpdateFileContents: vi.fn(),
  deleteFile: vi.fn(),
};
const mockActions = {
  createWorkflowDispatch: vi.fn(),
};

vi.mock('@octokit/rest', () => {
  return {
    Octokit: vi.fn().mockImplementation(function () {
      return {
        repos: mockRepos,
        actions: mockActions,
      };
    }),
  };
});

describe('githubService', () => {
  const mockConfig = { pat: 'test-pat', owner: 'test-owner', repo: 'test-repo', openaiKey: 'key' };
  const octokitMock = { repos: mockRepos, actions: mockActions };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create_file should call createOrUpdateFileContents with correct params', async () => {
    const intent = {
      action: 'create_file' as const,
      path: 'test.txt',
      content: 'hello',
      commit_message: 'init',
    };

    // Mock getContent to throw (file not found) so it creates new
    octokitMock.repos.getContent.mockRejectedValue({ status: 404 });

    const result = await executeGitHubCommand(mockConfig, intent);

    expect(octokitMock.repos.createOrUpdateFileContents).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: 'test-owner',
        repo: 'test-repo',
        path: 'test.txt',
        content: btoa('hello'),
        message: 'init',
      })
    );
    expect(result.success).toBe(true);
  });

  it('update_file should pass existing SHA', async () => {
    const intent = {
      action: 'update_file' as const,
      path: 'test.txt',
      content: 'update',
      commit_message: 'update',
    };

    // Mock getContent to return existing file
    octokitMock.repos.getContent.mockResolvedValue({ data: { sha: 'existing-sha', content: '' } });

    await executeGitHubCommand(mockConfig, intent);

    expect(octokitMock.repos.createOrUpdateFileContents).toHaveBeenCalledWith(
      expect.objectContaining({
        sha: 'existing-sha',
      })
    );
  });

  it('delete_file should delete existing file', async () => {
    const intent = { action: 'delete_file' as const, path: 'delete.txt', commit_message: 'del' };

    octokitMock.repos.getContent.mockResolvedValue({ data: { sha: 'sha-to-del' } });

    const result = await executeGitHubCommand(mockConfig, intent);

    expect(octokitMock.repos.deleteFile).toHaveBeenCalledWith(
      expect.objectContaining({
        sha: 'sha-to-del',
      })
    );
    expect(result.success).toBe(true);
  });

  it('get_file should decode content', async () => {
    const intent = { action: 'get_file' as const, path: 'read.txt' };
    const encoded = btoa('file content');

    octokitMock.repos.getContent.mockResolvedValue({ data: { content: encoded } });

    const result = await executeGitHubCommand(mockConfig, intent);

    expect(result.success).toBe(true);
    expect(result.data).toBe('file content');
  });

  it('should handle API errors gracefully', async () => {
    const intent = { action: 'create_file' as const, path: 'error.txt', content: '' };
    octokitMock.repos.getContent.mockRejectedValue({ status: 401, message: 'Bad creds' });

    const result = await executeGitHubCommand(mockConfig, intent);

    expect(result.success).toBe(false);
    expect(result.message).toContain('Authentication failed');
  });
});

