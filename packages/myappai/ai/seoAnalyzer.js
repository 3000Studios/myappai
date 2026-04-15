import {
  getContentBundle,
  getSystemDefault,
  readSystemDocument,
  writeSystemDocument,
} from '../server/services/contentService.js'

const DEFAULT_TRAFFIC = getSystemDefault('traffic.json')

const SEED_TOPICS = [
  {
    topic: 'AI automation tools for small business',
    intent: 'commercial',
    funnel: 'lead_capture',
  },
  {
    topic: 'best AI workflow builders',
    intent: 'commercial',
    funnel: 'product_comparison',
  },
  {
    topic: 'how to automate marketing with AI',
    intent: 'informational',
    funnel: 'newsletter',
  },
  {
    topic: 'AI productivity tools comparison',
    intent: 'commercial',
    funnel: 'product_comparison',
  },
  {
    topic: 'AI marketing automation for startups',
    intent: 'commercial',
    funnel: 'trial_signup',
  },
]

function nowIso() {
  return new Date().toISOString()
}

function keywordDifficultyScore(keyword) {
  const words = keyword.split(/\s+/).length
  return Math.max(18, 58 - words * 4)
}

function demandScore(keyword) {
  return Math.min(92, 48 + (keyword.length % 37))
}

function opportunityScore(topic) {
  const demand = demandScore(topic.keyword)
  const difficulty = keywordDifficultyScore(topic.keyword)
  const intentBoost =
    topic.intent === 'commercial'
      ? 14
      : topic.intent === 'transactional'
        ? 18
        : 6
  return Math.max(1, Math.round(demand - difficulty + intentBoost))
}

function normalizeTopic(seed) {
  const keyword = seed.keyword ?? seed.topic.toLowerCase()
  return {
    topic: seed.topic,
    keyword,
    intent: seed.intent ?? 'informational',
    funnel: seed.funnel ?? 'lead_capture',
    demand: demandScore(keyword),
    difficulty: keywordDifficultyScore(keyword),
    score: opportunityScore({ ...seed, keyword }),
    createdAt: nowIso(),
  }
}

export async function discoverTopics({ seedTopics = [], limit = 5 } = {}) {
  const bundle = await getContentBundle('blog')
  const existingTitles = new Set(
    bundle.blog.flatMap((entry) => {
      const data = entry.data ?? {}
      return [
        String(data.title ?? '').toLowerCase(),
        String(data.slug ?? '').toLowerCase(),
      ]
    })
  )

  const topics = [...seedTopics, ...SEED_TOPICS]
    .map((entry) => (typeof entry === 'string' ? { topic: entry } : entry))
    .map(normalizeTopic)
    .filter(
      (entry) =>
        !existingTitles.has(entry.topic.toLowerCase()) &&
        !existingTitles.has(entry.keyword.toLowerCase())
    )
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)

  return topics
}

export async function analyzeTopic(topicInput) {
  return normalizeTopic(
    typeof topicInput === 'string' ? { topic: topicInput } : topicInput
  )
}

export async function getTrafficState() {
  return readSystemDocument('traffic.json', DEFAULT_TRAFFIC)
}

export async function updateTrafficState(mutator) {
  const current = await getTrafficState()
  const next = mutator(structuredClone(current))
  next.updatedAt = nowIso()
  await writeSystemDocument('traffic.json', next)
  return next
}
