import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { recordDeployment } from '../../server/services/deploymentService.js'
import { recordDeploymentActivity } from '../../server/services/analyticsService.js'
import {
  commitAndPush,
  isGitSyncEnabled,
  prepareBranchForDeploy,
} from '../../server/services/gitService.js'
import { repoRoot } from '../../server/services/platformPaths.js'

const execFileAsync = promisify(execFile)

function resolveExecutable(command) {
  if (process.platform !== 'win32') {
    return command
  }

  if (command === 'npm') {
    return 'npm.cmd'
  }

  if (command === 'npx') {
    return 'npx.cmd'
  }

  return command
}

async function runProcess(command, args) {
  const executable = resolveExecutable(command)
  return execFileAsync(executable, args, {
    cwd: repoRoot,
    windowsHide: true,
    env: process.env,
  })
}

function getPagesProjectName() {
  return (
    process.env.CLOUDFLARE_PAGES_PROJECT_NAME?.trim() ||
    process.env.APP_NAME?.trim() ||
    'myappai'
  )
}

function getProductionBranch() {
  return (
    process.env.CLOUDFLARE_PAGES_BRANCH?.trim() ||
    process.env.GH_BASE_BRANCH?.trim() ||
    'main'
  )
}

export async function deploySite({ message = 'Manual operator deploy' } = {}) {
  const startedAt = new Date().toISOString()
  const projectName = getPagesProjectName()
  const branch = getProductionBranch()

  try {
    let gitSync = { status: 'disabled', message: 'OPERATOR_GIT_SYNC is off.' }

    if (isGitSyncEnabled()) {
      await prepareBranchForDeploy()
    }

    const buildResult = await runProcess('npm', ['run', 'build'])

    if (isGitSyncEnabled()) {
      const safeMessage = String(message ?? 'Manual operator deploy')
        .replace(/\r?\n/g, ' ')
        .trim()
        .slice(0, 200)
      gitSync = await commitAndPush(safeMessage || 'Manual operator deploy', [])
    }

    const deployResult = await runProcess('npx', [
      'wrangler',
      'pages',
      'deploy',
      'dist',
      '--project-name',
      projectName,
      '--branch',
      branch,
    ])

    const deployment = {
      id: `deploy-${Date.now()}`,
      status: 'deployed',
      message,
      branch,
      commitSha: null,
      startedAt,
      finishedAt: new Date().toISOString(),
      strategy: 'manual-wrangler',
      buildOutput: buildResult.stdout || buildResult.stderr || '',
      deployOutput: deployResult.stdout || deployResult.stderr || '',
      gitSync,
    }

    await recordDeployment(deployment)
    await recordDeploymentActivity()
    return deployment
  } catch (error) {
    const deployment = {
      id: `deploy-${Date.now()}`,
      status: 'deploy_failed',
      message,
      branch,
      commitSha: null,
      startedAt,
      finishedAt: new Date().toISOString(),
      strategy: 'manual-wrangler',
      buildOutput: error.stdout || '',
      deployOutput: error.stderr || error.message,
      gitSync: error.gitSync ?? null,
    }

    await recordDeployment(deployment)
    return deployment
  }
}
