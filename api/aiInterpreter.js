import fs from 'node:fs/promises'
import path from 'node:path'
import OpenAI from 'openai'
import { repoRoot } from '../server/services/platformPaths.js'

const ALLOWED_EDIT_PREFIXES = [
  'frontend/src',
  'frontend/pages',
  'frontend/styles',
  'content/pages',
  'content/system',
]
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
const MAX_FILE_CONTEXT_CHARS = 12000
const MAX_TOTAL_CONTEXT_CHARS = 40000
const MAX_REPAIR_FILE_CONTEXT_CHARS = 18000

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is required for natural-language repository commands.'
    )
  }

  return new OpenAI({ apiKey })
}

function getModelName() {
  return process.env.OPENAI_MODEL ?? 'gpt-4o'
}

async function collectFileContexts(relativeDir, bucket) {
  const absoluteDir = path.join(repoRoot, relativeDir)
  let entries = []

  try {
    entries = await fs.readdir(absoluteDir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (bucket.totalChars >= MAX_TOTAL_CONTEXT_CHARS) {
      return
    }

    if (entry.name.startsWith('.')) {
      continue
    }

    const childRelativePath = path.posix.join(
      relativeDir.replaceAll('\\', '/'),
      entry.name
    )

    if (entry.isDirectory()) {
      await collectFileContexts(childRelativePath, bucket)
      continue
    }

    const extension = path.extname(entry.name).toLowerCase()

    if (!TEXT_EXTENSIONS.has(extension)) {
      continue
    }

    const absoluteFilePath = path.join(repoRoot, childRelativePath)
    const contents = await fs.readFile(absoluteFilePath, 'utf8')
    const truncated = contents.slice(0, MAX_FILE_CONTEXT_CHARS)

    bucket.files.push({
      file: childRelativePath,
      contents: truncated,
    })
    bucket.totalChars += truncated.length
  }
}

async function getEditableFileContext() {
  const bucket = {
    files: [],
    totalChars: 0,
  }

  for (const prefix of ALLOWED_EDIT_PREFIXES) {
    await collectFileContexts(prefix, bucket)
  }

  return bucket.files
}

function isAllowedEditablePath(filePath) {
  return ALLOWED_EDIT_PREFIXES.some(
    (prefix) => filePath === prefix || filePath.startsWith(`${prefix}/`)
  )
}

function countOccurrences(content, target) {
  return content.split(target).length - 1
}

function validateInstruction(instruction) {
  if (
    !instruction ||
    typeof instruction !== 'object' ||
    Array.isArray(instruction)
  ) {
    throw new Error('AI interpreter returned an invalid instruction payload.')
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
      throw new Error(`AI interpreter response is missing "${field}".`)
    }
  }

  const normalizedFile = instruction.file
    .trim()
    .replaceAll('\\', '/')
    .replace(/^\/+/, '')
  if (!isAllowedEditablePath(normalizedFile)) {
    throw new Error(
      `AI interpreter can only edit: ${ALLOWED_EDIT_PREFIXES.join(', ')}.`
    )
  }

  return {
    file: normalizedFile,
    action: instruction.action.trim(),
    target: instruction.target,
    value: instruction.value,
    commitMessage:
      typeof instruction.commitMessage === 'string' &&
      instruction.commitMessage.trim()
        ? instruction.commitMessage.trim().slice(0, 72)
        : 'AI voice update',
    summary:
      typeof instruction.summary === 'string' && instruction.summary.trim()
        ? instruction.summary.trim()
        : 'Natural-language repository update',
  }
}

async function readEditableFileContents(filePath) {
  try {
    return await fs.readFile(path.join(repoRoot, filePath), 'utf8')
  } catch {
    throw new Error(
      `Editable file "${filePath}" was not found in the workspace.`
    )
  }
}

export function getInstructionTargetIssue(instruction, fileContents) {
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

async function requestInstruction(messages) {
  const completion = await getClient().chat.completions.create({
    model: getModelName(),
    temperature: 0,
    response_format: { type: 'json_object' },
    messages,
  })

  const text = completion.choices[0]?.message?.content

  if (!text) {
    throw new Error('OpenAI returned an empty interpreter response.')
  }

  return validateInstruction(JSON.parse(text))
}

function buildInitialMessages(command, editableFiles) {
  return [
    {
      role: 'system',
      content: `You control a website repository.

Return JSON only.

Allowed editable areas: ${ALLOWED_EDIT_PREFIXES.join(', ')}.
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
      content: `User command: ${command.trim()}

Editable file snapshots:
${JSON.stringify(editableFiles, null, 2)}`,
    },
  ]
}

function buildRepairMessages(command, instruction, targetIssue, fileContents) {
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
      content: `Original user command: ${command.trim()}

Previous invalid instruction:
${JSON.stringify(instruction, null, 2)}

Validation issue: ${targetIssue}

Current file contents for ${instruction.file}:
${fileContents.slice(0, MAX_REPAIR_FILE_CONTEXT_CHARS)}`,
    },
  ]
}

async function ensureUsableInstruction(command, instruction) {
  const fileContents = await readEditableFileContents(instruction.file)
  const targetIssue = getInstructionTargetIssue(instruction, fileContents)

  if (!targetIssue) {
    return instruction
  }

  const repairedInstruction = await requestInstruction(
    buildRepairMessages(command, instruction, targetIssue, fileContents)
  )
  const repairedFileContents = await readEditableFileContents(
    repairedInstruction.file
  )
  const repairedIssue = getInstructionTargetIssue(
    repairedInstruction,
    repairedFileContents
  )

  if (repairedIssue) {
    throw new Error(
      `Operator could not map the request to a unique file edit. ${repairedIssue}`
    )
  }

  return repairedInstruction
}

export async function interpretCommand(command) {
  if (typeof command !== 'string' || !command.trim()) {
    throw new Error('Command must be a non-empty string.')
  }

  const editableFiles = await getEditableFileContext()
  const instruction = await requestInstruction(
    buildInitialMessages(command, editableFiles)
  )
  return ensureUsableInstruction(command, instruction)
}
