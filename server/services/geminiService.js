import { GoogleGenerativeAI } from '@google/generative-ai'

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()
  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getGeminiApiKey() {
  return String(process.env.GEMINI_API_KEY ?? '').trim()
}

function getDefaultModel() {
  return String(process.env.GEMINI_MODEL ?? '').trim() || 'gemini-1.5-flash'
}

export async function generateGeminiText({
  prompt,
  model = undefined,
  systemInstruction = undefined,
} = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A prompt is required.')
  }

  const apiKey = getGeminiApiKey()
  if (!isConfiguredValue(apiKey)) {
    throw new Error('GEMINI_API_KEY is not configured on this server.')
  }

  const resolvedModel =
    typeof model === 'string' && model.trim() ? model.trim() : getDefaultModel()

  const client = new GoogleGenerativeAI(apiKey)
  const generativeModel = client.getGenerativeModel(
    systemInstruction &&
      typeof systemInstruction === 'string' &&
      systemInstruction.trim()
      ? { model: resolvedModel, systemInstruction: systemInstruction.trim() }
      : { model: resolvedModel }
  )

  const result = await generativeModel.generateContent(prompt.trim())
  const response = await result.response
  const text = response.text()

  return {
    ok: true,
    model: resolvedModel,
    text: String(text ?? '').trim(),
  }
}

export async function streamGeminiText(
  { prompt, model = undefined, systemInstruction = undefined } = {},
  onChunk
) {
  if (typeof onChunk !== 'function') {
    throw new Error('A stream callback is required.')
  }

  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A prompt is required.')
  }

  const apiKey = getGeminiApiKey()
  if (!isConfiguredValue(apiKey)) {
    throw new Error('GEMINI_API_KEY is not configured on this server.')
  }

  const resolvedModel =
    typeof model === 'string' && model.trim() ? model.trim() : getDefaultModel()

  const client = new GoogleGenerativeAI(apiKey)
  const generativeModel = client.getGenerativeModel(
    systemInstruction &&
      typeof systemInstruction === 'string' &&
      systemInstruction.trim()
      ? { model: resolvedModel, systemInstruction: systemInstruction.trim() }
      : { model: resolvedModel }
  )

  const stream = await generativeModel.generateContentStream(prompt.trim())
  for await (const chunk of stream.stream) {
    onChunk(String(chunk.text() ?? ''))
  }

  return {
    ok: true,
    model: resolvedModel,
  }
}
