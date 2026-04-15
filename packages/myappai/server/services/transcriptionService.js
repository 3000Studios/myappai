import path from 'node:path'
import OpenAI from 'openai'

const DEFAULT_TRANSCRIPTION_MODEL = 'whisper-1'
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024
const SUPPORTED_EXTENSIONS = new Set([
  'm4a',
  'mp3',
  'mp4',
  'mpeg',
  'mpga',
  'wav',
  'webm',
])

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()
  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getTranscriptionModel() {
  const configuredModel = String(
    process.env.OPENAI_TRANSCRIPTION_MODEL ?? ''
  ).trim()

  return configuredModel || DEFAULT_TRANSCRIPTION_MODEL
}

function normalizeOptionalString(value, limit = 200) {
  const normalized = String(value ?? '').trim()

  if (!normalized) {
    return undefined
  }

  return normalized.slice(0, limit)
}

function sanitizeFileName(fileName) {
  const normalized = String(fileName ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')

  return normalized || `whisper-upload-${Date.now()}.mp3`
}

function assertSupportedFileExtension(fileName) {
  const extension = path.extname(fileName).slice(1).toLowerCase()

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw new Error(
      'Supported media formats are m4a, mp3, mp4, mpeg, mpga, wav, and webm.'
    )
  }
}

function decodeBase64Media(base64Data) {
  if (typeof base64Data !== 'string' || !base64Data.trim()) {
    throw new Error('A media file is required for transcription.')
  }

  const normalized = base64Data.replace(/^data:.*?;base64,/, '').trim()
  const buffer = Buffer.from(normalized, 'base64')

  if (!buffer.length) {
    throw new Error('The uploaded media file was empty.')
  }

  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error('Media files must be 25 MB or smaller for transcription.')
  }

  return buffer
}

function normalizeSegments(segments) {
  return Array.isArray(segments)
    ? segments
        .map((segment, index) => {
          const start = Number(segment?.start ?? 0)
          const end = Number(segment?.end ?? start + 0.75)
          const text = String(segment?.text ?? '').trim()

          if (!text) {
            return null
          }

          return {
            id: String(segment?.id ?? index + 1),
            start: Number.isFinite(start) ? Math.max(0, start) : 0,
            end:
              Number.isFinite(end) && end > start
                ? end
                : Math.max(start + 0.75, 0.75),
            text,
          }
        })
        .filter(Boolean)
    : []
}

export async function transcribePublicMedia({
  fileName,
  mimeType,
  base64Data,
  language,
  prompt,
}) {
  if (!isConfiguredValue(process.env.OPENAI_API_KEY)) {
    throw new Error('Whisper transcription is not configured on this server.')
  }

  const safeFileName = sanitizeFileName(fileName)
  assertSupportedFileExtension(safeFileName)

  const file = new File([decodeBase64Media(base64Data)], safeFileName, {
    type: normalizeOptionalString(mimeType, 120) || 'application/octet-stream',
  })
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const transcription = await client.audio.transcriptions.create({
    file,
    model: getTranscriptionModel(),
    response_format: 'verbose_json',
    language: normalizeOptionalString(language, 12),
    prompt: normalizeOptionalString(prompt, 400),
    temperature: 0,
  })

  return {
    ok: true,
    model: getTranscriptionModel(),
    text: String(transcription?.text ?? '').trim(),
    language: normalizeOptionalString(transcription?.language, 32) ?? null,
    durationSeconds: Number(transcription?.duration ?? 0),
    segments: normalizeSegments(transcription?.segments),
  }
}
