import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { repoRoot } from './platformPaths.js'

const execFileAsync = promisify(execFile)
const DEFAULT_BASE_BRANCH = process.env.GH_BASE_BRANCH?.trim() || 'main'

export function isGitSyncEnabled() {
  const v = String(process.env.OPERATOR_GIT_SYNC ?? '1')
    .trim()
    .toLowerCase()
  return v !== '0' && v !== 'false' && v !== 'off'
}

function requireMainBranchEnabled() {
  const v = String(process.env.OPERATOR_REQUIRE_MAIN_BRANCH ?? '1')
    .trim()
    .toLowerCase()
  return v !== '0' && v !== 'false' && v !== 'off'
}

function normalizePathSpec(targetPath) {
  return String(targetPath ?? '')
    .replaceAll('\\', '/')
    .trim()
}

async function runGit(args, { allowFailure = false } = {}) {
  try {
    return await execFileAsync('git', args, {
      cwd: repoRoot,
      windowsHide: true,
    })
  } catch (error) {
    if (allowFailure) {
      return {
        stdout: error.stdout ?? '',
        stderr: error.stderr ?? error.message,
        failed: true,
      }
    }

    throw error
  }
}

export async function getGitStatus() {
  const { stdout } = await runGit(['status', '--short'])
  return stdout.trim()
}

export async function getCurrentBranch() {
  const { stdout } = await runGit(['branch', '--show-current'])
  return stdout.trim() || DEFAULT_BASE_BRANCH
}

export async function getRecentCommits(limit = 5) {
  const { stdout } = await runGit([
    'log',
    `--max-count=${limit}`,
    '--pretty=format:%H|%h|%an|%ad|%s',
    '--date=iso',
  ])

  if (!stdout.trim()) {
    return []
  }

  return stdout
    .trim()
    .split('\n')
    .map((line) => {
      const [sha, shortSha, author, committedAt, subject] = line.split('|')
      return { sha, shortSha, author, committedAt, subject }
    })
}

async function hasStagedChanges() {
  try {
    await execFileAsync('git', ['diff', '--cached', '--quiet'], {
      cwd: repoRoot,
      windowsHide: true,
    })
    return false
  } catch (error) {
    if (error && error.code === 1) {
      return true
    }

    throw error
  }
}

export async function prepareBranchForDeploy() {
  if (!isGitSyncEnabled()) {
    return { status: 'disabled' }
  }

  const targetBranch = DEFAULT_BASE_BRANCH
  const currentBranch = await getCurrentBranch()

  if (requireMainBranchEnabled() && currentBranch !== targetBranch) {
    throw new Error(
      `Git sync requires branch "${targetBranch}" (current: "${currentBranch}"). Checkout ${targetBranch} before shipping live.`
    )
  }

  if (process.env.OPERATOR_GIT_PULL_BEFORE_SYNC === '1') {
    const pullResult = await runGit(
      ['pull', '--rebase', 'origin', targetBranch],
      { allowFailure: true }
    )

    if (pullResult.failed) {
      throw new Error(
        `git pull --rebase failed before deploy: ${pullResult.stderr || pullResult.stdout || 'unknown error'}`
      )
    }
  }

  return { status: 'ok', branch: targetBranch, currentBranch }
}

/**
 * Stage all tracked changes, commit if needed, push to origin target branch.
 * Call after `npm run build` so generated assets (e.g. sitemap) are included.
 */
export async function commitAndPush(commitMessage, paths = []) {
  const normalizedPaths = [
    ...new Set(paths.map(normalizePathSpec).filter(Boolean)),
  ]
  const targetBranch = DEFAULT_BASE_BRANCH
  const currentBranch = await getCurrentBranch()

  if (requireMainBranchEnabled() && currentBranch !== targetBranch) {
    throw new Error(
      `Git sync requires branch "${targetBranch}" (current: "${currentBranch}"). Checkout ${targetBranch} before shipping live.`
    )
  }

  if (normalizedPaths.length) {
    await runGit(['add', '--', ...normalizedPaths])
  } else {
    await runGit(['add', '-A'])
  }

  const staged = await hasStagedChanges()
  let commitOutput = ''

  if (staged) {
    const commitArgs = normalizedPaths.length
      ? ['commit', '--only', '-m', commitMessage, '--', ...normalizedPaths]
      : ['commit', '-m', commitMessage]
    const commitResult = await runGit(commitArgs, { allowFailure: true })
    commitOutput =
      `${commitResult.stdout || ''}${commitResult.stderr || ''}`.trim()

    if (commitResult.failed && !/nothing to commit/i.test(commitOutput)) {
      throw new Error(`git commit failed: ${commitOutput || 'unknown error'}`)
    }
  }

  const pushResult = await runGit(['push', 'origin', `HEAD:${targetBranch}`], {
    allowFailure: true,
  })
  const pushOutput =
    `${pushResult.stdout || ''}${pushResult.stderr || ''}`.trim()

  if (pushResult.failed) {
    throw new Error(`git push failed: ${pushOutput || 'unknown error'}`)
  }

  return {
    status: staged ? 'pushed' : 'pushed_no_commit',
    branch: targetBranch,
    currentBranch,
    commitOutput,
    pushOutput,
    message: staged
      ? 'Committed and pushed to origin.'
      : 'No new commit; push completed (branch already up to date).',
  }
}
