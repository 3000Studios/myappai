import { generateBlogPost } from './generators/contentGenerator.js'
import { generateImages } from './media/mediaEngine.js'
import {
  analyzeTopic,
  discoverTopics,
  getTrafficState,
  updateTrafficState,
} from './seoAnalyzer.js'
import {
  getContentBundle,
  saveBlogPost,
  slugify,
} from '../server/services/contentService.js'

function makeInternalLinks(posts, currentSlug) {
  return posts
    .filter((entry) => entry.slug !== currentSlug)
    .slice(0, 3)
    .map((entry) => ({
      title: entry.data?.title ?? entry.slug,
      href: `/blog/${entry.slug}`,
    }))
}

function buildCta(topic, funnel) {
  return {
    eyebrow: 'Next step',
    heading: `Turn ${topic} into revenue`,
    body:
      funnel === 'product_comparison'
        ? 'Compare platform offers, capture intent, and route readers into your highest-converting product path.'
        : 'Invite readers into a trial, lead magnet, or admin-driven sales funnel directly from the article.',
    primaryLabel: 'Open pricing',
    primaryHref: '/pricing',
  }
}

function enrichPost(post, topicAnalysis, internalLinks, mediaAsset) {
  const slug = slugify(post.slug ?? post.title ?? topicAnalysis.topic)
  return {
    ...post,
    slug,
    seo: {
      keyword: topicAnalysis.keyword,
      intent: topicAnalysis.intent,
      demand: topicAnalysis.demand,
      difficulty: topicAnalysis.difficulty,
      score: topicAnalysis.score,
    },
    media: mediaAsset
      ? {
          heroImage: mediaAsset.imagePath,
          attribution: mediaAsset.attribution,
        }
      : undefined,
    relatedLinks: internalLinks,
    cta: buildCta(topicAnalysis.topic, topicAnalysis.funnel),
    monetization: {
      funnel: topicAnalysis.funnel,
      target:
        topicAnalysis.intent === 'commercial' ? 'subscription' : 'newsletter',
    },
  }
}

export async function runTrafficCycle({
  seedTopics = [],
  count = 2,
  includeImages = true,
} = {}) {
  const discovered = await discoverTopics({
    seedTopics,
    limit: Math.max(count, 3),
  })
  const selectedTopics = discovered.slice(0, count)
  const existingPosts = (await getContentBundle('blog')).blog
  const generated = []

  for (const topic of selectedTopics) {
    const generatedPost = await generateBlogPost({
      topic: topic.topic,
      length: 'long',
    })
    const mediaAssets = includeImages
      ? await generateImages({ query: topic.topic, count: 1 })
      : []
    const internalLinks = makeInternalLinks(
      existingPosts,
      generatedPost.payload.slug
    )
    const enrichedPost = enrichPost(
      generatedPost.payload,
      topic,
      internalLinks,
      mediaAssets[0]
    )
    const savedPost = await saveBlogPost(enrichedPost)
    generated.push({
      topic,
      post: savedPost,
      model: generatedPost.model,
      provider: generatedPost.provider,
    })
    existingPosts.unshift(savedPost)
  }

  const nextTraffic = await updateTrafficState((state) => {
    const publishedEntries = generated.map((entry) => ({
      slug: entry.post.slug,
      topic: entry.topic.topic,
      score: entry.topic.score,
      conversions: 0,
      status: 'published',
      publishedAt: new Date().toISOString(),
    }))

    state.queue = [
      ...discovered.slice(count).map((entry) => ({
        topic: entry.topic,
        keyword: entry.keyword,
        intent: entry.intent,
        score: entry.score,
        status: 'queued',
        funnel: entry.funnel,
        createdAt: entry.createdAt,
      })),
      ...(state.queue ?? []).filter(
        (entry) => !generated.find((item) => item.topic.topic === entry.topic)
      ),
    ].slice(0, 20)

    state.published = [...publishedEntries, ...(state.published ?? [])].slice(
      0,
      30
    )
    return state
  })

  return {
    discovered,
    generated,
    traffic: nextTraffic,
  }
}

export async function previewTrafficTopics({
  seedTopics = [],
  limit = 6,
} = {}) {
  const topics = await discoverTopics({ seedTopics, limit })
  const analyzed = await Promise.all(topics.map((topic) => analyzeTopic(topic)))
  return {
    topics: analyzed,
    traffic: await getTrafficState(),
  }
}
