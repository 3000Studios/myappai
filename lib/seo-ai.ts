/**
 * SEO & Discovery AI
 * Automatic SEO optimization and metadata generation
 */

import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export function generateSEO(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://3000studios.com';
  const fullUrl = config.url ? `${baseUrl}${config.url}` : baseUrl;
  const ogImage = config.image || `${baseUrl}/og-image.jpg`;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,

    openGraph: {
      title: config.title,
      description: config.description,
      url: fullUrl,
      siteName: '3000 Studios',
      images: [{ url: ogImage }],
      type: (config.type || 'website') as any,
    },

    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [ogImage],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateSchema(
  type: 'Organization' | 'WebSite' | 'Article' | 'Product',
  data: any
) {
  const baseSchemas: Record<string, unknown> = {
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '3000 Studios',
      url: 'https://3000studios.com',
      logo: 'https://res.cloudinary.com/dj92eb97f/image/upload/v1767046287/new_logo-min_zd44u2.png',
      ...data,
    },
    WebSite: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: '3000 Studios',
      url: 'https://3000studios.com',
      ...data,
    },
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      publisher: {
        '@type': 'Organization',
        name: '3000 Studios',
        logo: 'https://res.cloudinary.com/dj92eb97f/image/upload/v1767046287/new_logo-min_zd44u2.png',
      },
      ...data,
    },
    Product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: '3000 Studios',
      },
      ...data,
    },
  };

  return baseSchemas[type];
}

export async function submitToSearchEngines(url: string) {
  // Google indexing API integration
  // Bing indexing API integration
  console.log(`Submitting ${url} to search engines`);
}

