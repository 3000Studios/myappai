import OpenAI from 'openai'
import { getAnalyticsSnapshot } from './analyticsService.js'
import { getCommerceSnapshot } from './commerceService.js'
import { getDeploymentHistory } from './deploymentService.js'
import { generateJsonWithOllama, listAvailableModels } from './ollamaService.js'
import { SITE_DISPLAY_NAME } from '../../frontend/src/siteMeta.js'

const DEFAULT_OPENAI_MODEL = 'gpt-4o'
const DEFAULT_CLAUDE_MODEL = 'claude-3-5-sonnet-latest'
const DEFAULT_OLLAMA_MODEL = 'llama3.2:3b'
const CLAUDE_MESSAGES_API_URL = 'https://api.anthropic.com/v1/messages'
const OLLAMA_MODEL_FAMILY_PREFERENCES = [
  'qwen2.5',
  'qwen3',
  'llama3.1',
  'llama3.2',
  'llama3',
  'gemma3',
  'gemma2',
  'mistral',
]
const ASSISTANT_SYSTEM_PROMPT = `You are the public-facing concierge for ${SITE_DISPLAY_NAME}. Answer like a senior product strategist with concise, direct guidance.

Return JSON only in this shape:
{
  "reply": "short helpful answer",
  "suggestions": [
    { "label": "Open pricing", "href": "/pricing" }
  ]
}

Rules:
- Keep replies under 120 words.
- Stay grounded in the provided business context.
- Prefer routing users to pricing, products, contact, or admin.
- Do not invent credentials, customer logos, or deployment claims.`

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()
  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getConfiguredEnvironmentValue(...names) {
  for (const name of names) {
    const value = String(process.env[name] ?? '').trim()

    if (isConfiguredValue(value)) {
      return value
    }
  }

  return ''
}

function hasOpenAiKey() {
  return Boolean(getConfiguredEnvironmentValue('OPENAI_API_KEY'))
}

function getClaudeApiKey() {
  return getConfiguredEnvironmentValue('CLAUDE_API_KEY', 'ANTHROPIC_API_KEY')
}

function hasClaudeKey() {
  return Boolean(getClaudeApiKey())
}

function getAssistantProvider() {
  const provider = String(process.env.PUBLIC_ASSISTANT_PROVIDER ?? 'openai')
    .trim()
    .toLowerCase()

  if (provider === 'ollama' || provider === 'local' || provider === 'free') {
    return 'ollama'
  }

  if (
    provider === 'claude' ||
    provider === 'anthropic' ||
    provider === 'openclaw'
  ) {
    return 'claude'
  }

  return 'openai'
}

function isMatchingModelFamily(modelName, family) {
  return modelName === family || modelName.startsWith(`${family}:`)
}

function normalizeHistory(history) {
  return Array.isArray(history)
    ? history
        .filter(
          (entry) =>
            entry &&
            (entry.role === 'user' || entry.role === 'assistant') &&
            typeof entry.content === 'string'
        )
        .slice(-6)
        .map((entry) => ({
          role: entry.role,
          content: entry.content.slice(0, 1500),
        }))
    : []
}

function buildContext(analytics, commerce, deployments) {
  const latestDeployment = deployments.history?.[0] ?? null
  const configuredProviders = Object.entries(commerce.providers ?? {})
    .filter(([, enabled]) => enabled)
    .map(([provider]) => provider)

  return {
    analytics,
    commerce,
    deployment: latestDeployment
      ? {
          status: latestDeployment.status,
          message: latestDeployment.message,
          finishedAt: latestDeployment.finishedAt ?? latestDeployment.startedAt,
        }
      : null,
    configuredProviders,
  }
}

function withSource(payload, source) {
  return {
    ...payload,
    source,
  }
}

function buildAssistantMessages(message, history, context) {
  return [
    {
      role: 'user',
      content: `Business context:
${JSON.stringify(context, null, 2)}`,
    },
    ...normalizeHistory(history),
    {
      role: 'user',
      content: message.trim(),
    },
  ]
}

function parseAssistantPayload(rawContent) {
  if (typeof rawContent !== 'string') {
    return null
  }

  const trimmed = rawContent.trim()

  if (!trimmed) {
    return null
  }

  const candidates = [trimmed]
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)

  if (fencedMatch?.[1]) {
    candidates.push(fencedMatch[1].trim())
  }

  const jsonStart = trimmed.indexOf('{')
  const jsonEnd = trimmed.lastIndexOf('}')

  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    candidates.push(trimmed.slice(jsonStart, jsonEnd + 1))
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch {
      continue
    }
  }

  return null
}

function sanitizeSuggestions(suggestions, fallbackSuggestions = []) {
  const normalizedSuggestions = Array.isArray(suggestions)
    ? suggestions
        .filter(
          (entry) =>
            entry &&
            typeof entry.label === 'string' &&
            typeof entry.href === 'string'
        )
        .slice(0, 3)
    : []

  return normalizedSuggestions.length
    ? normalizedSuggestions
    : fallbackSuggestions
}

function hasValidAssistantPayload(payload) {
  return Boolean(
    payload && typeof payload.reply === 'string' && payload.reply.trim()
  )
}

function finalizeAssistantResponse(payload, source, fallback) {
  if (!hasValidAssistantPayload(payload)) {
    return fallback
  }

  return withSource(
    {
      reply: payload.reply.trim(),
      suggestions: sanitizeSuggestions(
        payload.suggestions,
        fallback.suggestions
      ),
    },
    source
  )
}

async function requestOpenAiResponse({ message, history, context }) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: ASSISTANT_SYSTEM_PROMPT,
      },
      ...buildAssistantMessages(message, history, context),
    ],
  })

  return parseAssistantPayload(completion.choices[0]?.message?.content ?? '')
}

function extractClaudeText(responsePayload) {
  return Array.isArray(responsePayload?.content)
    ? responsePayload.content
        .filter(
          (entry) => entry?.type === 'text' && typeof entry.text === 'string'
        )
        .map((entry) => entry.text)
        .join('\n')
        .trim()
    : ''
}

async function requestClaudeResponse({ message, history, context }) {
  const response = await fetch(CLAUDE_MESSAGES_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': getClaudeApiKey(),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? DEFAULT_CLAUDE_MODEL,
      max_tokens: 400,
      system: ASSISTANT_SYSTEM_PROMPT,
      messages: buildAssistantMessages(message, history, context),
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude request failed with status ${response.status}.`)
  }

  const payload = await response.json()
  return parseAssistantPayload(extractClaudeText(payload))
}

function buildOllamaPrompt(message, history, context) {
  const conversation = normalizeHistory(history)
    .map(
      (entry) =>
        `${entry.role === 'assistant' ? 'Assistant' : 'User'}: ${entry.content}`
    )
    .join('\n\n')

  return `Business context:
${JSON.stringify(context, null, 2)}

Recent conversation:
${conversation || 'No prior conversation.'}

Latest user request:
${message.trim()}

Return JSON only.`
}

async function resolveOllamaModel() {
  const configuredModel = getConfiguredEnvironmentValue('OLLAMA_MODEL')

  if (configuredModel) {
    return configuredModel
  }

  const availableModels = await listAvailableModels()

  for (const family of OLLAMA_MODEL_FAMILY_PREFERENCES) {
    const matchedModel = availableModels.find((model) =>
      isMatchingModelFamily(model.name, family)
    )

    if (matchedModel?.name) {
      return matchedModel.name
    }
  }

  return availableModels[0]?.name ?? DEFAULT_OLLAMA_MODEL
}

async function requestOllamaResponse({ message, history, context }) {
  return generateJsonWithOllama({
    model: await resolveOllamaModel(),
    prompt: buildOllamaPrompt(message, history, context),
    systemPrompt: ASSISTANT_SYSTEM_PROMPT,
  })
}

function buildFallbackResponse(message, context) {
  const lowerMessage = message.toLowerCase()
  const providerList = context.configuredProviders.length
    ? context.configuredProviders.join(' + ')
    : 'inquiry-first only'
  const latestDeployment = context.deployment
    ? `${context.deployment.status} on ${new Date(context.deployment.finishedAt).toLocaleString()}`
    : 'No deployment has been recorded yet.'

  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('plan') ||
    lowerMessage.includes('buy')
  ) {
    return withSource(
      {
        reply: `${SITE_DISPLAY_NAME} has three main paths: Season Pass for direct booking, Family Adventure Weekend for guided planning, and Group Retreat Planning for custom group experiences. Active payment routing is ${providerList}.`,
        suggestions: [
          { label: 'Open pricing', href: '/pricing' },
          { label: 'View products', href: '/products' },
        ],
      },
      'fallback'
    )
  }

  if (
    lowerMessage.includes('deploy') ||
    lowerMessage.includes('launch') ||
    lowerMessage.includes('publish')
  ) {
    return withSource(
      {
        reply: `Deployment is wired through the admin operator console and git-based release flow. Latest deployment status: ${latestDeployment}`,
        suggestions: [
          { label: 'Open admin', href: '/admin/login' },
          { label: 'Contact deployment team', href: '/contact' },
        ],
      },
      'fallback'
    )
  }

  if (lowerMessage.includes('paypal') || lowerMessage.includes('payment')) {
    return withSource(
      {
        reply: `Payment readiness is surfaced directly on the pricing and program pages. Direct checkout appears only on eligible offers, while higher-touch experiences use an inquiry-first planning path.`,
        suggestions: [
          { label: 'See checkout options', href: '/pricing' },
          { label: 'Contact the planning team', href: '/contact' },
        ],
      },
      'fallback'
    )
  }

  return withSource(
    {
      reply: `${SITE_DISPLAY_NAME} is built to help families and organizers discover, compare, and plan Georgia camp experiences with more clarity. Right now the platform is tracking ${context.analytics.visitors ?? 0} visitors, ${context.analytics.leads ?? 0} leads, and ${context.analytics.purchases ?? 0} purchases.`,
      suggestions: [
        { label: 'Explore programs', href: '/products' },
        { label: 'Talk to the team', href: '/contact' },
      ],
    },
    'fallback'
  )
}

export async function answerPublicAssistant({ message, history = [] }) {
  if (typeof message !== 'string' || !message.trim()) {
    throw new Error('A message is required.')
  }

  const trimmedMessage = message.trim()
  const [analytics, commerce, deployments] = await Promise.all([
    getAnalyticsSnapshot(),
    getCommerceSnapshot(),
    getDeploymentHistory(),
  ])
  const context = buildContext(analytics, commerce, deployments)
  const fallback = buildFallbackResponse(trimmedMessage, context)
  const provider = getAssistantProvider()

  if (provider === 'ollama') {
    try {
      const payload = await requestOllamaResponse({
        message: trimmedMessage,
        history,
        context,
      })
      return finalizeAssistantResponse(payload, 'ollama', fallback)
    } catch {
      return fallback
    }
  }

  if (provider === 'claude') {
    if (hasClaudeKey()) {
      try {
        const payload = await requestClaudeResponse({
          message: trimmedMessage,
          history,
          context,
        })
        if (hasValidAssistantPayload(payload)) {
          return finalizeAssistantResponse(payload, 'claude', fallback)
        }
      } catch (error) {
        void error
      }

      if (hasOpenAiKey()) {
        try {
          const payload = await requestOpenAiResponse({
            message: trimmedMessage,
            history,
            context,
          })
          return finalizeAssistantResponse(payload, 'openai', fallback)
        } catch {
          return fallback
        }
      }

      return fallback
    }

    if (hasOpenAiKey()) {
      try {
        const payload = await requestOpenAiResponse({
          message: trimmedMessage,
          history,
          context,
        })
        return finalizeAssistantResponse(payload, 'openai', fallback)
      } catch {
        return fallback
      }
    }

    return fallback
  }

  if (!hasOpenAiKey()) {
    return fallback
  }

  try {
    const payload = await requestOpenAiResponse({
      message: trimmedMessage,
      history,
      context,
    })
    return finalizeAssistantResponse(payload, 'openai', fallback)
  } catch {
    return fallback
  }
}
