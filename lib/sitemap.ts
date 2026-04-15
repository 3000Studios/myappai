/**
 * Sitemap Generator Helper
 */

import type { SitemapEntry } from '@/lib/seo';

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  // Static pages
  const staticPages = [
    { url: 'https://3000studios.com/', priority: 1.0, changefreq: 'daily' as const },
    { url: 'https://3000studios.com/blog', priority: 0.8, changefreq: 'daily' as const },
    { url: 'https://3000studios.com/store', priority: 0.9, changefreq: 'daily' as const },
    { url: 'https://3000studios.com/portfolio', priority: 0.7, changefreq: 'weekly' as const },
    { url: 'https://3000studios.com/projects', priority: 0.7, changefreq: 'weekly' as const },
  ];

  entries.push(...staticPages);

  // Dynamic content (in production, fetch from database)
  // Blog posts
  try {
    const blogEntries: SitemapEntry[] = [
      {
        url: 'https://3000studios.com/blog/post-1',
        lastmod: new Date().toISOString(),
        priority: 0.8,
        changefreq: 'weekly' as const,
      },
    ];
    entries.push(...blogEntries);
  } catch (error: unknown) {
    console.error("", error);
  }

  // Products
  try {
    const productEntries: SitemapEntry[] = [
      {
        url: 'https://3000studios.com/store/product-1',
        lastmod: new Date().toISOString(),
        priority: 0.9,
        changefreq: 'daily' as const,
      },
    ];
    entries.push(...productEntries);
  } catch (error: unknown) {
    console.error("", error);
  }

  return entries;
}

