import fs from 'node:fs/promises'
import path from 'node:path'
import { repoRoot } from '../server/services/platformPaths.js'

const ALLOWED_EDIT_PREFIXES = [
  'frontend',
  'content/pages',
  'content/products',
  'content/blog',
  'content/system',
]
const DISALLOWED_SEGMENTS = new Set([
  '.git',
  '.github',
  'node_modules',
  'server',
  'api',
])
const SUPPORTED_ACTIONS = new Set([
  'replace_text',
  'insert_before',
  'insert_after',
  'append_text',
])

function normalizeRelativePath(filePath) {
  return filePath.replaceAll('\\', '/').replace(/^\/+/, '')
}

function assertAllowedFile(filePath) {
  const normalizedPath = normalizeRelativePath(filePath)
  const segments = normalizedPath.split('/')

  if (
    !ALLOWED_EDIT_PREFIXES.some(
      (prefix) =>
        normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
    )
  ) {
    throw new Error(
      `Edits are limited to: ${ALLOWED_EDIT_PREFIXES.join(', ')}.`
    )
  }

  if (segments.some((segment) => DISALLOWED_SEGMENTS.has(segment))) {
    throw new Error('The requested file path is not editable.')
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
  return content.split(target).length - 1
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
      throw new Error(`Unsupported patch action "${action}".`)
  }
}

export async function applyPatch(instruction) {
  if (!instruction || typeof instruction !== 'object') {
    throw new Error('Instruction must be an object.')
  }

  const { file, action, target = '', value = '' } = instruction

  if (typeof file !== 'string' || !file.trim()) {
    throw new Error('Instruction.file is required.')
  }

  if (typeof action !== 'string' || !SUPPORTED_ACTIONS.has(action)) {
    throw new Error(
      `Instruction.action must be one of: ${[...SUPPORTED_ACTIONS].join(', ')}.`
    )
  }

  if (typeof value !== 'string') {
    throw new Error('Instruction.value must be a string.')
  }

  if (action !== 'append_text' && (typeof target !== 'string' || !target)) {
    throw new Error(
      'Instruction.target must be a non-empty string for this action.'
    )
  }

  const relativePath = assertAllowedFile(file)
  const absolutePath = path.join(repoRoot, relativePath)
  const originalContent = await fs.readFile(absolutePath, 'utf8')
  const nextContent = applyTextOperation(originalContent, action, target, value)

  if (nextContent === originalContent) {
    throw new Error('Patch produced no file changes.')
  }

  await fs.writeFile(absolutePath, nextContent, 'utf8')

  return {
    file: relativePath,
    action,
    changed: true,
  }
}
