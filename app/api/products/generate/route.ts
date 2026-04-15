import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, image, url, category } = body;

  const seoTitle = `${name} | Premium ${category || 'Product'}`;
  const seoDescription = description?.slice(0, 150) || `Discover ${name} at 3000 Studios.`;
  const slug = url || `/products/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`;

  return NextResponse.json({
    success: true,
    page: {
      title: seoTitle,
      description: seoDescription,
      slug,
      image,
      price,
      schema: buildSchema({ name, description: seoDescription, price, image, url: slug, category }),
    },
  });
}

function buildSchema({ name, description, price, image, url, category }: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    category,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
      url,
      availability: 'https://schema.org/InStock',
    },
  };
}

