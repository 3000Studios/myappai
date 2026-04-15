const DEFAULT_OPENAI_MODEL = 'gpt-4o'
const DEFAULT_GITHUB_REPO = '3000Studios/myappai'
const GITHUB_API_ORIGIN = 'https://api.github.com'
const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions'
const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
}
const BLOCKED_OPERATOR_PATTERNS = [
  /\b(powershell|cmd\.exe|bash|terminal|shell access)\b/i,
  /\b(rm\s+-rf|sudo|format c:|shutdown|restart computer)\b/i,
  /\binstall software on my computer\b/i,
]
const GITHUB_ALLOWED_EDIT_PREFIXES = [
  'frontend/src',
  'frontend/pages',
  'frontend/styles',
  'content/pages',
  'content/system',
]
const GITHUB_PATCH_ALLOWED_PREFIXES = [
  'frontend',
  'content/pages',
  'content/products',
  'content/blog',
  'content/system',
]
const DISALLOWED_PATCH_SEGMENTS = new Set([
  '.git',
  '.github',
  'node_modules',
  'server',
  'api',
])
const TEXT_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.ts',
  '.tsx',
  '.jsx',
  '.md',
  '.txt',
  '.json',
])
const REMOTE_PATCH_ACTIONS = new Set([
  'replace_text',
  'insert_before',
  'insert_after',
  'append_text',
])
const MAX_FILE_CONTEXT_CHARS = 12000
const MAX_TOTAL_CONTEXT_CHARS = 40000
const MAX_REPAIR_FILE_CONTEXT_CHARS = 18000

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      ...JSON_HEADERS,
      ...headers,
    },
  })
}

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()

  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getConfiguredEnvironmentValue(env, ...names) {
  for (const name of names) {
    const value = String(env[name] ?? '').trim()

    if (isConfiguredValue(value)) {
      return value
    }
  }

  return ''
}

function getOpenAiApiKey(env) {
  return getConfiguredEnvironmentValue(env, 'OPENAI_API_KEY')
}

function getOpenAiModel(env) {
  return (
    getConfiguredEnvironmentValue(env, 'OPENAI_MODEL') || DEFAULT_OPENAI_MODEL
  )
}

function getGitHubToken(env) {
  return getConfiguredEnvironmentValue(
    env,
    'GH_TOKEN',
    'GH_PAT',
    'GH_BOT_TOKEN'
  )
}

function normalizeGitHubRepo(value) {
  const normalized = String(value ?? '').trim()

  if (!normalized) {
    return DEFAULT_GITHUB_REPO
  }

  if (/^https?:\/\/github\.com\//iu.test(normalized)) {
    return normalized
      .replace(/^https?:\/\/github\.com\//iu, '')
      .replace(/\.git$/iu, '')
      .replace(/^\/+|\/+$/gu, '')
  }

  return normalized.replace(/\.git$/iu, '').replace(/^\/+|\/+$/gu, '')
}

function getGitHubRepo(env) {
  return normalizeGitHubRepo(
    getConfiguredEnvironmentValue(env, 'GH_REPO', 'GITHUB_REPOSITORY') ||
      DEFAULT_GITHUB_REPO
  )
}

function getGitHubBranch(env) {
  return (
    getConfiguredEnvironmentValue(env, 'GH_BASE_BRANCH') ||
    String(env.CLOUDFLARE_PAGES_BRANCH ?? '').trim() ||
    'main'
  )
}

export function canHandleRemoteOperator(env) {
  return Boolean(getOpenAiApiKey(env) && getGitHubToken(env))
}

export function getRemoteCommandUnavailableReason(env) {
  if (!getOpenAiApiKey(env)) {
    return 'Set OPENAI_API_KEY for remote natural-language UI edits.'
  }

  if (!getGitHubToken(env)) {
    return 'Set GH_TOKEN, GH_PAT, or GH_BOT_TOKEN for remote GitHub-backed edits.'
  }

  return ''
}

function normalizeRemotePath(filePath) {
  return String(filePath ?? '')
    .replaceAll('\\', '/')
    .replace(/^\/+/u, '')
}

function isAllowedRemoteEditablePath(filePath) {
  return GITHUB_ALLOWED_EDIT_PREFIXES.some(
    (prefix) => filePath === prefix || filePath.startsWith(`${prefix}/`)
  )
}

function assertRemotePatchFile(filePath) {
  const normalizedPath = normalizeRemotePath(filePath)
  const segments = normalizedPath.split('/')

  if (
    !GITHUB_PATCH_ALLOWED_PREFIXES.some(
      (prefix) =>
        normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
    )
  ) {
    throw new Error(
      `Remote edits are limited to: ${GITHUB_PATCH_ALLOWED_PREFIXES.join(', ')}.`
    )
  }

  if (segments.some((segment) => DISALLOWED_PATCH_SEGMENTS.has(segment))) {
    throw new Error('The requested remote file path is not editable.')
  }

  if (
    normalizedPath.includes('..') ||
    normalizedPath.endsWith('.env') ||
    normalizedPath.includes('/.env')
  ) {
    throw new Error('Editing environment files is not allowed.')
  }

  return normalizedPath
}

function countOccurrences(content, target) {
  return String(content).split(String(target)).length - 1
}

function applyTextOperation(content, action, target, value) {
  if (action === 'append_text') {
    return `${content}${value}`
  }

  const occurrences = countOccurrences(content, target)

  if (occurrences === 0) {
    throw new Error('Target text was not found in the requested file.')
  }

  if (occurrences > 1) {
    throw new Error('Target text is ambiguous. Provide a more specific target.')
  }

  switch (action) {
    case 'replace_text':
      return content.replace(target, value)
    case 'insert_before':
      return content.replace(target, `${value}${target}`)
    case 'insert_after':
      return content.replace(target, `${target}${value}`)
    default:
      throw new Error(`Unsupported remote patch action "${action}".`)
  }
}

function encodeBase64Utf8(value) {
  return btoa(unescape(encodeURIComponent(String(value ?? ''))))
}

function decodeBase64Utf8(value) {
  return decodeURIComponent(escape(atob(String(value ?? ''))))
}

async function githubRequest(env, pathname, init = {}) {
  const token = getGitHubToken(env)

  if (!token) {
    throw new Error('GitHub token is required for remote repository edits.')
  }

  const response = await fetch(`${GITHUB_API_ORIGIN}${pathname}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'myappai-pages-worker',
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      `GitHub request failed with ${response.status}: ${message.slice(0, 240)}`
    )
  }

  return response
}

async function listGitHubDirectory(env, directoryPath) {
  const repo = getGitHubRepo(env)
  const branch = getGitHubBranch(env)
  const encodedPath = encodeURIComponent(directoryPath).replace(/%2F/gu, '/')
  const response = await githubRequest(
    env,
    `/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`
  )

  return response.json()
}

async function getGitHubFile(env, filePath) {
  const repo = getGitHubRepo(env)
  const branch = getGitHubBranch(env)
  const encodedPath = encodeURIComponent(filePath).replace(/%2F/gu, '/')
  const response = await githubRequest(
    env,
    `/repos/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`
  )
  const payload = await response.json()

  if (payload.type !== 'file') {
    throw new Error(`Expected "${filePath}" to be a file in GitHub.`)
  }

  return {
    path: payload.path,
    sha: payload.sha,
    content: decodeBase64Utf8(
      String(payload.content ?? '').replace(/\s+/gu, '')
    ),
  }
}

async function updateGitHubFile(env, filePath, nextContent, message) {
  const repo = getGitHubRepo(env)
  const branch = getGitHubBranch(env)
  const current = await getGitHubFile(env, filePath)
  const encodedPath = encodeURIComponent(filePath).replace(/%2F/gu, '/')
  const response = await githubRequest(
    env,
    `/repos/${repo}/contents/${encodedPath}`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: encodeBase64Utf8(nextContent),
        sha: current.sha,
        branch,
      }),
    }
  )
  const payload = await response.json()
  const commit = payload.commit ?? {}

  return {
    branch,
    commitSha: commit.sha ?? null,
    commitUrl: commit.html_url ?? null,
  }
}

function isTextFilePath(filePath) {
  const match = /\.([a-z0-9]+)$/iu.exec(filePath)
  return match ? TEXT_EXTENSIONS.has(`.${match[1].toLowerCase()}`) : false
}

async function collectRemoteFileContexts(env) {
  const files = []
  let totalChars = 0
  const queue = [...GITHUB_ALLOWED_EDIT_PREFIXES]

  while (queue.length > 0 && totalChars < MAX_TOTAL_CONTEXT_CHARS) {
    const currentPath = queue.shift()
    const entries = await listGitHubDirectory(env, currentPath)

    if (!Array.isArray(entries)) {
      continue
    }

    for (const entry of entries) {
      if (totalChars >= MAX_TOTAL_CONTEXT_CHARS) {
        break
      }

      if (
        !entry?.path ||
        String(entry.path)
          .split('/')
          .some((segment) => segment.startsWith('.'))
      ) {
        continue
      }

      if (entry.type === 'dir') {
        queue.push(entry.path)
        continue
      }

      if (entry.type !== 'file' || !isTextFilePath(entry.path)) {
        continue
      }

      const file = await getGitHubFile(env, entry.path)
      const truncated = file.content.slice(0, MAX_FILE_CONTEXT_CHARS)
      files.push({
        file: entry.path,
        contents: truncated,
      })
      totalChars += truncated.length
    }
  }

  return files
}

function validateRemoteInstruction(instruction) {
  if (
    !instruction ||
    typeof instruction !== 'object' ||
    Array.isArray(instruction)
  ) {
    throw new Error(
      'Remote AI interpreter returned an invalid instruction payload.'
    )
  }

  if (instruction.action === 'reject') {
    throw new Error(
      instruction.reason ||
        'Command rejected because it could not be converted into a safe single-file patch.'
    )
  }

  const requiredFields = ['file', 'action', 'target', 'value']

  for (const field of requiredFields) {
    if (typeof instruction[field] !== 'string' || !instruction[field].trim()) {
      throw new Error(`Remote AI interpreter response is missing "${field}".`)
    }
  }

  const normalizedFile = normalizeRemotePath(instruction.file)

  if (!isAllowedRemoteEditablePath(normalizedFile)) {
    throw new Error(
      `Remote AI interpreter can only edit: ${GITHUB_ALLOWED_EDIT_PREFIXES.join(', ')}.`
    )
  }

  return {
    file: normalizedFile,
    action: String(instruction.action).trim(),
    target: instruction.target,
    value: instruction.value,
    commitMessage:
      typeof instruction.commitMessage === 'string' &&
      instruction.commitMessage.trim()
        ? instruction.commitMessage.trim().slice(0, 72)
        : 'Remote UI update',
    summary:
      typeof instruction.summary === 'string' && instruction.summary.trim()
        ? instruction.summary.trim()
        : 'Remote repository update',
  }
}

async function requestOpenAiInstruction(env, messages) {
  const response = await fetch(OPENAI_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${getOpenAiApiKey(env)}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: getOpenAiModel(env),
      temperature: 0,
      response_format: { type: 'json_object' },
      messages,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      `OpenAI remote interpreter failed with ${response.status}: ${message.slice(0, 240)}`
    )
  }

  const payload = await response.json()
  const text = payload?.choices?.[0]?.message?.content

  if (!text) {
    throw new Error('OpenAI returned an empty remote interpreter response.')
  }

  return validateRemoteInstruction(JSON.parse(text))
}

function getInstructionTargetIssue(instruction, fileContents) {
  if (instruction.action === 'append_text') {
    return null
  }

  const occurrences = countOccurrences(fileContents, instruction.target)

  if (occurrences === 1) {
    return null
  }

  return occurrences === 0
    ? 'Target text was not found in the selected file.'
    : 'Target text matched more than one location in the selected file.'
}

function buildInitialRemoteMessages(command, editableFiles) {
  return [
    {
      role: 'system',
      content: `You control a website repository.

Return JSON only.

Allowed editable areas: ${GITHUB_ALLOWED_EDIT_PREFIXES.join(', ')}.
Allowed actions: replace_text, insert_before, insert_after, append_text.
Forbidden targets: .env files, secrets, GitHub workflows, deployment credentials, server code, API code, shell commands, machine-control code, checkout/payment flows.
Only produce a single-file edit.
Use exact target text copied from the supplied file snapshots.

Respond with:
{
  "file": "frontend/pages/HomePage.jsx",
  "action": "replace_text",
  "target": "exact existing text",
  "value": "replacement text",
  "commitMessage": "short git commit message",
  "summary": "what changed"
}

If the request cannot be completed safely as one allowed file edit, respond with:
{
  "action": "reject",
  "reason": "short reason"
}`,
    },
    {
      role: 'user',
      content: `User command: ${String(command).trim()}

Editable file snapshots:
${JSON.stringify(editableFiles, null, 2)}`,
    },
  ]
}

function buildRepairRemoteMessages(
  command,
  instruction,
  targetIssue,
  fileContents
) {
  return [
    {
      role: 'system',
      content: `You are repairing a previously invalid repository edit instruction.

Return JSON only.

Keep the file path as "${instruction.file}" unless the request must be rejected.
Allowed actions: replace_text, insert_before, insert_after, append_text.
If you use replace_text, insert_before, or insert_after, the target must appear exactly once in the provided file contents.
If the request cannot be completed safely as one allowed file edit, respond with:
{
  "action": "reject",
  "reason": "short reason"
}`,
    },
    {
      role: 'user',
      content: `Original user command: ${String(command).trim()}

Previous invalid instruction:
${JSON.stringify(instruction, null, 2)}

Validation issue: ${targetIssue}

Current file contents for ${instruction.file}:
${String(fileContents).slice(0, MAX_REPAIR_FILE_CONTEXT_CHARS)}`,
    },
  ]
}

async function ensureUsableRemoteInstruction(env, command, instruction) {
  const file = await getGitHubFile(env, instruction.file)
  const targetIssue = getInstructionTargetIssue(instruction, file.content)

  if (!targetIssue) {
    return instruction
  }

  const repairedInstruction = await requestOpenAiInstruction(
    env,
    buildRepairRemoteMessages(command, instruction, targetIssue, file.content)
  )
  const repairedFile = await getGitHubFile(env, repairedInstruction.file)
  const repairedIssue = getInstructionTargetIssue(
    repairedInstruction,
    repairedFile.content
  )

  if (repairedIssue) {
    throw new Error(
      `Operator could not map the request to a unique remote file edit. ${repairedIssue}`
    )
  }

  return repairedInstruction
}

async function interpretRemoteCommand(env, command) {
  const editableFiles = await collectRemoteFileContexts(env)
  const instruction = await requestOpenAiInstruction(
    env,
    buildInitialRemoteMessages(command, editableFiles)
  )
  return ensureUsableRemoteInstruction(env, command, instruction)
}

function buildRemoteOperatorResult({
  mode,
  status = 'success',
  summary,
  affectedPaths = [],
  deployment = null,
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
    blockedReason,
    nextSteps,
    details,
    sources: [],
  }
}

async function commitRemoteInstruction(env, instruction) {
  const filePath = assertRemotePatchFile(instruction.file)
  const current = await getGitHubFile(env, filePath)
  const nextContent = applyTextOperation(
    current.content,
    instruction.action,
    instruction.target,
    instruction.value
  )

  if (nextContent === current.content) {
    throw new Error('Remote patch produced no file changes.')
  }

  const commit = await updateGitHubFile(
    env,
    filePath,
    nextContent,
    instruction.commitMessage
  )

  return {
    filePath,
    deployment: {
      status: 'queued',
      strategy: 'github-main-push',
      branch: commit.branch,
      commitSha: commit.commitSha,
      commitUrl: commit.commitUrl,
      message:
        'Committed to GitHub. Cloudflare Pages should deploy the connected branch automatically.',
    },
  }
}

async function handleRemotePromptCommand(env, payload) {
  const command = String(payload?.command ?? '').trim()

  if (!command) {
    throw new Error('Operator prompt is required.')
  }

  const blockedPattern = BLOCKED_OPERATOR_PATTERNS.find((pattern) =>
    pattern.test(command)
  )

  if (blockedPattern) {
    return buildRemoteOperatorResult({
      mode: 'blocked',
      status: 'blocked',
      summary: 'Request blocked by operator safety policy.',
      blockedReason:
        'Machine-level shell or unrestricted computer control is not allowed from the web operator.',
      nextSteps: [
        'Rephrase the task as a UI, content, or deployment request for the website repository.',
      ],
    })
  }

  const instruction = await interpretRemoteCommand(env, command)
  const committed = await commitRemoteInstruction(env, instruction)

  return buildRemoteOperatorResult({
    mode: 'repo_file_edit',
    summary: instruction.summary,
    affectedPaths: [committed.filePath],
    deployment: committed.deployment,
    nextSteps: [
      'Wait for the connected Pages deployment to finish.',
      'Refresh the site after the new production deployment completes.',
    ],
    details: {
      plan: {
        intent: 'repo_file_edit',
        steps: [
          'Interpret prompt',
          'Generate safe single-file patch',
          'Commit to GitHub',
          'Let the connected production branch deploy',
        ],
      },
      instruction: {
        file: instruction.file,
        action: instruction.action,
        commitMessage: instruction.commitMessage,
      },
    },
  })
}

function validateRemoteEditWorkspacePayload(payload) {
  const targetPath = assertRemotePatchFile(
    typeof payload?.targetPath === 'string' ? payload.targetPath : ''
  )
  const contents = String(payload?.contents ?? '')

  if (!contents.trim()) {
    throw new Error('contents must be a non-empty string.')
  }

  return {
    targetPath,
    contents,
    commitMessage:
      typeof payload?.message === 'string' && payload.message.trim()
        ? payload.message.trim().slice(0, 72)
        : `Update ${targetPath}`,
  }
}

async function handleRemoteStructuredCommand(env, payload) {
  if (payload?.action === 'edit_workspace_file') {
    const command = validateRemoteEditWorkspacePayload(payload)
    const commit = await updateGitHubFile(
      env,
      command.targetPath,
      command.contents,
      command.commitMessage
    )

    return buildRemoteOperatorResult({
      mode: payload.action,
      summary: `Updated ${command.targetPath} remotely.`,
      affectedPaths: [command.targetPath],
      deployment: {
        status: 'queued',
        strategy: 'github-main-push',
        branch: commit.branch,
        commitSha: commit.commitSha,
        commitUrl: commit.commitUrl,
        message:
          'Committed to GitHub. Cloudflare Pages should deploy the connected branch automatically.',
      },
      nextSteps: [
        'Wait for the connected Pages deployment to finish.',
        'Refresh the site after production deploy completes.',
      ],
      details: {
        remote: true,
      },
    })
  }

  if (payload?.action === 'deploy_site') {
    return buildRemoteOperatorResult({
      mode: 'deploy_site',
      status: 'unavailable',
      summary:
        'Deploy-only commands are not available in edge mode without a repo-backed runtime.',
      nextSteps: [
        'Run a UI or content change prompt; Git-backed commits will deploy through the connected branch.',
        'Or configure ADMIN_API_ORIGIN for the full repo-backed deploy pipeline.',
      ],
    })
  }

  throw new Error(
    'This remote worker currently supports natural-language UI edits and edit_workspace_file actions.'
  )
}

export async function handleRemoteOperatorCommand(request, env) {
  if (!canHandleRemoteOperator(env)) {
    return jsonResponse(
      buildRemoteOperatorResult({
        mode: 'edge-fallback',
        status: 'unavailable',
        summary:
          'Remote operator support is not configured for this Pages deployment.',
        nextSteps: [getRemoteCommandUnavailableReason(env)],
      }),
      503
    )
  }

  const payload = await request.json().catch(() => ({}))

  try {
    const result =
      typeof payload?.command === 'string' && payload.command.trim()
        ? await handleRemotePromptCommand(env, payload)
        : await handleRemoteStructuredCommand(env, payload)

    return jsonResponse(result)
  } catch (error) {
    return jsonResponse(
      buildRemoteOperatorResult({
        mode:
          typeof payload?.action === 'string'
            ? payload.action
            : typeof payload?.command === 'string'
              ? 'repo_file_edit'
              : 'operator_error',
        status: 'error',
        summary:
          'Remote operator action failed before it could commit a safe site change.',
        nextSteps: [
          'Make the request more specific about the page or section to change.',
          'Use edit_workspace_file JSON when you already know the exact target file.',
        ],
        details: {
          error: error instanceof Error ? error.message : String(error),
        },
      }),
      400
    )
  }
}
