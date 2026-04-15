import { deployUpdate } from '../../api/gitDeploy.js'
import { interpretCommand } from '../../api/aiInterpreter.js'
import { applyPatch } from '../../api/patchEngine.js'
import { routeCommand } from '../../ai/router/commandRouter.js'
import { recordAiActivity } from './analyticsService.js'
import { logOperatorEvent } from './logService.js'
import { searchWeb } from './researchService.js'

const BLOCKED_PATTERNS = [
  /\b(powershell|cmd\.exe|bash|terminal|shell access)\b/i,
  /\b(rm\s+-rf|sudo|format c:|shutdown|restart computer)\b/i,
  /\binstall software on my computer\b/i,
]

const RESEARCH_PATTERNS = [
  /\bresearch\b/i,
  /\bbrowse\b/i,
  /\bfind\b/i,
  /\blook up\b/i,
]
/** Matches prompts that should only trigger a live deploy (no file edit). */
const DEPLOY_ONLY_PATTERN =
  /^(please\s+)?(?:(can|could|would)\s+you\s+)?(deploy|ship live|push live|go live|publish(\s+live)?)\b/i
const DEPLOY_ONLY_STANDALONE_PATTERN =
  /^\s*(deploy|ship\s+it|push\s+it|go\s+live|publish(\s+live)?)\s*\.?\s*$/i

function isBlockedPrompt(command) {
  return BLOCKED_PATTERNS.find((pattern) => pattern.test(command))
}

function needsResearch(command) {
  return RESEARCH_PATTERNS.some((pattern) => pattern.test(command))
}

function isDeployOnlyPrompt(command) {
  const t = String(command ?? '').trim()
  if (!t || needsResearch(t)) {
    return false
  }

  if (DEPLOY_ONLY_STANDALONE_PATTERN.test(t)) {
    return true
  }

  return DEPLOY_ONLY_PATTERN.test(t)
}

/** True when the user asked to ship live at the end of an edit-style prompt. */
function wantsDeployAfterEdit(command) {
  const t = String(command ?? '').trim()
  if (!t) {
    return false
  }

  return /\b(and\s+then\s+)?(deploy|ship\s+live|push\s+live|go\s+live|publish(\s+live)?)\s*\.?\s*$/i.test(
    t
  )
}

function sanitizeDeployCommitMessage(raw, fallback = 'Operator live deploy') {
  const cleaned = String(raw ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/"/g, "'")
    .trim()
    .slice(0, 200)

  return cleaned || fallback
}

function planOperatorPrompt(command) {
  const blockedPattern = isBlockedPrompt(command)
  if (blockedPattern) {
    return {
      intent: 'blocked',
      steps: ['Validate prompt', 'Reject unsupported machine-level request'],
      blockedReason:
        'Machine-level shell or unrestricted computer control is not allowed from the web operator.',
    }
  }

  if (isDeployOnlyPrompt(command) && !needsResearch(command)) {
    return {
      intent: 'deploy_site',
      steps: [
        'Validate deploy intent',
        'Trigger deployment',
        'Return deployment status',
      ],
    }
  }

  if (needsResearch(command)) {
    return {
      intent: 'research_and_apply',
      steps: [
        'Research the web',
        'Plan safe repository action',
        'Apply safe action if needed',
        'Return sources and status',
      ],
    }
  }

  return {
    intent: 'repo_file_edit',
    steps: [
      'Interpret prompt',
      'Generate safe patch instruction',
      'Apply safe action',
      'Return result',
    ],
  }
}

function buildResult({
  mode,
  status = 'success',
  summary,
  affectedPaths = [],
  deployment = null,
  sources = [],
  blockedReason = null,
  nextSteps = [],
  details = null,
}) {
  return {
    mode,
    status,
    summary,
    affectedPaths,
    deployment,
    sources,
    blockedReason,
    nextSteps,
    details,
  }
}

function summarizeStructuredResult(result) {
  if (!result || typeof result !== 'object') {
    return 'Operator action completed.'
  }

  if (result.action === 'deploy_site') {
    return 'Deployment requested through the operator workflow.'
  }

  if (result.action) {
    return `Completed safe action "${result.action}".`
  }

  return 'Operator action completed.'
}

function collectAffectedPaths(result) {
  return [
    result?.page?.filePath,
    result?.post?.filePath,
    result?.theme?.filePath,
    result?.featurePage?.filePath,
    result?.file?.filePath,
  ].filter(Boolean)
}

export async function runOperatorPrompt(command, options = {}) {
  const shipLiveAfterEdit = Boolean(options.shipLiveAfterEdit)
  const trimmed = String(command ?? '').trim()
  if (!trimmed) {
    throw new Error('Operator prompt is required.')
  }

  const plan = planOperatorPrompt(trimmed)

  if (plan.intent === 'blocked') {
    await logOperatorEvent({
      level: 'warn',
      scope: 'operator',
      title: 'Blocked operator prompt',
      message: trimmed,
      details: {
        blockedReason: plan.blockedReason,
      },
    })
    return buildResult({
      mode: 'blocked',
      status: 'blocked',
      summary: 'Request blocked by operator safety policy.',
      blockedReason: plan.blockedReason,
      nextSteps: [
        'Rephrase the task as a repository, research, or deployment request.',
      ],
      details: { plan },
    })
  }

  const sources =
    plan.intent === 'research_and_apply' ? await searchWeb(trimmed) : []

  if (plan.intent === 'deploy_site') {
    const deployment = await deployUpdate({
      commitMessage: sanitizeDeployCommitMessage(
        trimmed,
        'Operator-triggered deploy'
      ),
      paths: [],
    })
    await recordAiActivity('deploy_site', 'deploy_site')
    await logOperatorEvent({
      level: 'info',
      scope: 'operator',
      title: 'Deploy requested',
      message: trimmed,
      details: {
        deployment,
      },
    })
    return buildResult({
      mode: 'deploy_site',
      summary: 'Deployment triggered from the operator workspace.',
      deployment,
      nextSteps: ['Watch deployment status in the inspector panel.'],
      details: { plan },
    })
  }

  const instruction = await interpretCommand(trimmed)
  const patch = await applyPatch(instruction)
  await recordAiActivity(plan.intent, plan.intent)

  const shouldShipLive = shipLiveAfterEdit || wantsDeployAfterEdit(trimmed)
  let deployment = null
  let nextSteps = ['Review the change summary, then deploy when ready.']

  if (shouldShipLive) {
    deployment = await deployUpdate({
      commitMessage: sanitizeDeployCommitMessage(
        trimmed,
        `Live deploy: ${patch.file}`
      ),
      paths: [],
    })
    nextSteps = [
      'Live deploy finished: git sync (if enabled), build, and Cloudflare Pages update.',
      'Confirm git push and deployment status in the panels below.',
    ]
  }

  await logOperatorEvent({
    level: 'info',
    scope: 'operator',
    title: 'Operator prompt executed',
    message: trimmed,
    details: {
      mode: plan.intent,
      file: patch.file,
      deployment,
      shipLiveAfterEdit: shouldShipLive,
    },
  })

  return buildResult({
    mode: plan.intent,
    summary: instruction.summary,
    affectedPaths: [patch.file],
    deployment,
    sources,
    nextSteps,
    details: { plan, instruction, shipLiveAfterEdit: shouldShipLive },
  })
}

export async function runStructuredOperatorAction(payload) {
  const result = await routeCommand(payload)
  await recordAiActivity(
    payload.action ?? 'safe_action',
    payload.action ?? 'safe_action'
  )
  await logOperatorEvent({
    level: 'info',
    scope: 'operator',
    title: 'Structured operator action',
    message: payload.action ?? 'safe_action',
    details: result,
  })

  return buildResult({
    mode: payload.action ?? 'safe_action',
    summary: summarizeStructuredResult(result),
    affectedPaths: collectAffectedPaths(result),
    deployment: result.deployment ?? null,
    details: result,
  })
}
