/**
 * SEO Optimization Library
 * Handles metadata, schema, internal linking, and sitemap generation
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export interface SchemaMarkup {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Generate internal link suggestions for content
 */
export function generateInternalLinks(content: string, existingPages: string[]): string[] {
  const links: string[] = [];

  // Keywords that should link internally
  const keywordMap: Record<string, string> = {
    store: '/store',
    products: '/store',
    pricing: '/store',
    blog: '/blog',
    portfolio: '/portfolio',
    projects: '/projects',
    'live stream': '/live',
    'command center': '/admin',
    'voice control': '/admin',
  };

  for (const [keyword, url] of Object.entries(keywordMap)) {
    if (content.toLowerCase().includes(keyword) && existingPages.includes(url)) {
      links.push(url);
    }
  }

  return Array.from(new Set(links));
}

/**
 * Generate Article schema markup
 */
export function generateArticleSchema(metadata: SEOMetadata, content: string): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metadata.title,
    description: metadata.description,
    image: metadata.ogImage || 'https://3000studios.com/og-image.png',
    author: {
      '@type': 'Organization',
      name: metadata.author || '3000 Studios',
    },
    datePublished: metadata.publishedDate || new Date().toISOString(),
    dateModified: metadata.modifiedDate || new Date().toISOString(),
    wordCount: content.split(/\s+/).length,
  };
}

/**
 * Generate Product schema markup
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
}): SchemaMarkup {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: (product.reviewCount || 0).toString(),
        }
      : undefined,
  };
}

/**
 * Generate SEO-optimized metadata
 */
export function generateSEOMetadata(
  title: string,
  description: string,
  keywords: string[] = []
): SEOMetadata {
  return {
    title: `${title} | 3000 Studios`,
    description: description.slice(0, 160),
    keywords,
    ogImage: 'https://3000studios.com/og-image.png',
    canonicalUrl: `https://3000studios.com`,
    author: '3000 Studios',
    publishedDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
  };
}

/**
 * Generate robots.txt rules
 */
export function generateRobotsTxt(sitemapUrl: string): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /matrix

Sitemap: ${sitemapUrl}

User-agent: AdsBot-Google
Allow: /

User-agent: Googlebot
Allow: /
`;
}

/**
 * Generate XML sitemap entry
 */
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemapXml(entries: SitemapEntry[]): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>
`
  )
  .join('')}
</urlset>`;
  return xml;
}

/**
 * Ping search engines for indexing (IndexNow / Ping API)
 */
export async function pingSearchEngines(urls: string[], apiKey: string): Promise<boolean> {
  try {
    // IndexNow API
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: '3000studios.com',
        key: apiKey,
        keyLocation: 'https://3000studios.com/indexnow.txt',
        urlList: urls,
      }),
    });

    return true;
  } catch (error: unknown) {
    console.error("", error);
    return false;
  }
}

