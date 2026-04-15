import { generateJsonWithOllama } from '../../server/services/ollamaService.js'
import { slugify } from '../../server/services/contentService.js'
import { resolveModelRoute } from '../router/modelRouter.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function parseLength(length) {
  if (length === 'short') {
    return 3
  }

  if (length === 'long') {
    return 6
  }

  return 4
}

function fallbackPage({ page, topic, goal }) {
  return {
    title: `${page} page`,
    headline: `${topic ?? page} converts visitors into ${goal ?? 'qualified leads'}`,
    subheadline: `Built for teams shipping with local models, git-based publishing, and Cloudflare-ready deploys.`,
    cta: 'Launch workflow',
    sections: [
      {
        title: 'Command routing',
        description:
          'Route structured actions into content, media, and deployment services without manual handoffs.',
      },
      {
        title: 'Source-controlled content',
        description:
          'Keep every generated page diffable and reviewable by storing JSON content directly in the repo.',
      },
      {
        title: 'Automatic deployment',
        description:
          'Trigger git commits and Cloudflare rebuilds from a single AI-managed command path.',
      },
    ],
  }
}

function fallbackBlogPost({ topic, length }) {
  const sectionCount = parseLength(length)
  return {
    slug: slugify(topic),
    title: `How ${topic} strengthens an AI-run website stack`,
    description: `A practical look at using ${topic} inside a local-model content and deployment workflow.`,
    excerpt: `A practical look at using ${topic} inside a local-model content and deployment workflow.`,
    publishedAt: today(),
    tags: ['ai', 'automation', slugify(topic)],
    sections: Array.from({ length: sectionCount }, (_, index) => ({
      heading: `Section ${index + 1}: ${topic}`,
      body: `${topic} becomes more useful when commands, content generation, and deployment automation all live in the same repository.`,
    })),
  }
}

function fallbackFeatureSection({ product, topic }) {
  return {
    slug: slugify(product),
    title: `${product} feature system`,
    description: `${product} uses ${topic ?? 'AI orchestration'} to turn product goals into pages, assets, and deployable updates.`,
    bullets: [
      'Validate commands before writing files',
      'Choose the right local model for the task',
      'Commit and push changes for Cloudflare auto-deploy',
    ],
  }
}

async function tryGenerateJson({
  action,
  prompt,
  fallbackFactory,
  taskType = undefined,
}) {
  try {
    const route = await resolveModelRoute({ action, taskType })
    const payload = await generateJsonWithOllama({
      model: route.model,
      systemPrompt:
        'You create concise marketing JSON for a software platform. Respond with valid JSON only and do not include markdown.',
      prompt,
    })

    return {
      provider: 'ollama',
      model: route.model,
      payload,
    }
  } catch {
    return {
      provider: 'fallback',
      model: 'template',
      payload: fallbackFactory(),
    }
  }
}

export async function generateLandingPage({ page, topic, goal }) {
  return tryGenerateJson({
    action: 'create_page',
    fallbackFactory: () => fallbackPage({ page, topic, goal }),
    prompt: `
Create JSON for a landing page.
Requirements:
- keys: title, headline, subheadline, cta, sections
- sections must be an array of 3 objects with title and description
- page slug: ${page}
- topic: ${topic ?? page}
- revenue goal: ${goal ?? 'generate leads'}
`,
  })
}

export async function generateBlogPost({ topic, length = 'medium' }) {
  return tryGenerateJson({
    action: 'create_blog_post',
    fallbackFactory: () => fallbackBlogPost({ topic, length }),
    prompt: `
Create JSON for a blog post.
Requirements:
- keys: slug, title, description, excerpt, publishedAt, tags, sections
- sections must be an array with ${parseLength(length)} sections
- each section includes heading and body
- topic: ${topic}
`,
  })
}

export async function generateFeatureSection({ product, topic }) {
  return tryGenerateJson({
    action: 'generate_feature_section',
    fallbackFactory: () => fallbackFeatureSection({ product, topic }),
    prompt: `
Create JSON for a feature section.
Requirements:
- keys: slug, title, description, bullets
- bullets must contain exactly 3 strings
- product: ${product}
- topic: ${topic ?? 'AI orchestration'}
`,
  })
}
