/**
 * Product Data for 3000 Studios Store
 * Expanded product catalog with diverse offerings
 */

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  image?: string;
  inStock: boolean;
  affiliateLink?: string;
  featured?: boolean;
  tags?: string[];
}

export const productCatalog: Product[] = [
  // Digital Products
  {
    productId: 'prod-001',
    name: 'Premium Website Template - Business',
    description:
      'Fully responsive, modern business website template built with Next.js and Tailwind CSS. Includes 15+ pages, dark mode, and SEO optimization.',
    price: 149.99,
    category: 'Templates',
    rating: 4.9,
    reviewCount: 127,
    inStock: true,
    featured: true,
    tags: ['Next.js', 'Tailwind', 'Business', 'SEO'],
  },
  {
    productId: 'prod-002',
    name: 'E-Commerce Starter Kit',
    description:
      'Complete e-commerce solution with shopping cart, checkout, payment integration, and admin dashboard. Ready to deploy.',
    price: 299.99,
    category: 'Templates',
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    featured: true,
    tags: ['E-Commerce', 'Stripe', 'PayPal', 'Admin'],
  },
  {
    productId: 'prod-003',
    name: 'UI Component Library Pro',
    description:
      '200+ premium React components with TypeScript support, Storybook documentation, and dark mode. Save hundreds of hours.',
    price: 199.99,
    category: 'Design',
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    featured: true,
    tags: ['React', 'Components', 'TypeScript', 'Storybook'],
  },
  {
    productId: 'prod-004',
    name: 'SaaS Dashboard Template',
    description:
      'Modern SaaS dashboard with analytics, user management, billing integration, and real-time updates. Production-ready.',
    price: 249.99,
    category: 'Templates',
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    featured: false,
    tags: ['SaaS', 'Dashboard', 'Analytics', 'Billing'],
  },
  {
    productId: 'prod-005',
    name: 'Landing Page Bundle - 10 Pack',
    description:
      'Collection of 10 high-converting landing page templates. Each optimized for conversions with A/B testing built-in.',
    price: 179.99,
    category: 'Templates',
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    featured: false,
    tags: ['Landing Pages', 'Conversion', 'Marketing'],
  },
  {
    productId: 'prod-006',
    name: 'Animation Library Premium',
    description:
      'Smooth, performant animations for React. Includes 100+ pre-built animations with full customization options.',
    price: 89.99,
    category: 'Digital',
    rating: 4.9,
    reviewCount: 178,
    inStock: true,
    featured: false,
    tags: ['Animations', 'React', 'Framer Motion'],
  },
  {
    productId: 'prod-007',
    name: 'Blog Theme - Content Creator',
    description:
      'Beautiful, fast blog theme with MDX support, syntax highlighting, and built-in newsletter integration.',
    price: 129.99,
    category: 'Themes',
    rating: 4.8,
    reviewCount: 112,
    inStock: true,
    featured: false,
    tags: ['Blog', 'MDX', 'Newsletter', 'SEO'],
  },
  {
    productId: 'prod-008',
    name: 'Portfolio Showcase Template',
    description:
      'Stunning portfolio template for creatives. Includes project galleries, case studies, and contact forms.',
    price: 99.99,
    category: 'Templates',
    rating: 4.7,
    reviewCount: 87,
    inStock: true,
    featured: false,
    tags: ['Portfolio', 'Gallery', 'Creative'],
  },
  {
    productId: 'prod-009',
    name: 'Design System Starter',
    description:
      'Complete design system with Figma files, React components, and comprehensive documentation. Perfect for teams.',
    price: 349.99,
    category: 'Design',
    rating: 4.9,
    reviewCount: 145,
    inStock: true,
    featured: true,
    tags: ['Design System', 'Figma', 'Teams', 'Components'],
  },
  {
    productId: 'prod-010',
    name: 'Mobile App UI Kit',
    description:
      'Premium mobile UI kit with 150+ screens for iOS and Android. Includes Figma and Sketch files.',
    price: 169.99,
    category: 'Design',
    rating: 4.8,
    reviewCount: 134,
    inStock: true,
    featured: false,
    tags: ['Mobile', 'UI Kit', 'Figma', 'Sketch'],
  },
  {
    productId: 'prod-011',
    name: 'SEO Toolkit Pro',
    description:
      'Comprehensive SEO toolkit with keyword research, site audits, and competitor analysis. Boost your rankings.',
    price: 79.99,
    category: 'Digital',
    rating: 4.7,
    reviewCount: 201,
    inStock: true,
    featured: false,
    tags: ['SEO', 'Marketing', 'Analytics'],
  },
  {
    productId: 'prod-012',
    name: 'Icon Pack - 1000+ Premium Icons',
    description:
      'Massive collection of premium icons in SVG, PNG, and icon font formats. Customizable and production-ready.',
    price: 49.99,
    category: 'Design',
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    featured: false,
    tags: ['Icons', 'SVG', 'Design Assets'],
  },
  {
    productId: 'prod-013',
    name: 'Email Template Suite',
    description:
      '50+ responsive email templates for marketing, transactional, and newsletter campaigns. Works with all major ESPs.',
    price: 89.99,
    category: 'Templates',
    rating: 4.6,
    reviewCount: 76,
    inStock: true,
    featured: false,
    tags: ['Email', 'Marketing', 'Templates'],
  },
  {
    productId: 'prod-014',
    name: 'Admin Dashboard Pro',
    description:
      'Feature-rich admin dashboard with user management, analytics, reports, and customizable widgets.',
    price: 279.99,
    category: 'Templates',
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    featured: true,
    tags: ['Admin', 'Dashboard', 'Analytics'],
  },
  {
    productId: 'prod-015',
    name: 'Social Media Graphics Pack',
    description:
      '500+ customizable social media templates for Instagram, Facebook, Twitter, and LinkedIn.',
    price: 59.99,
    category: 'Design',
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    featured: false,
    tags: ['Social Media', 'Graphics', 'Marketing'],
  },
  {
    productId: 'prod-016',
    name: 'WordPress Theme - Agency',
    description:
      'Premium WordPress theme for creative agencies. Includes Elementor integration and 20+ demo sites.',
    price: 159.99,
    category: 'Themes',
    rating: 4.8,
    reviewCount: 167,
    inStock: true,
    featured: false,
    tags: ['WordPress', 'Agency', 'Elementor'],
  },
  {
    productId: 'prod-017',
    name: 'Figma UI Kit - Mobile Banking',
    description:
      'Complete mobile banking app UI kit with 80+ screens, components library, and style guide.',
    price: 139.99,
    category: 'Design',
    rating: 4.9,
    reviewCount: 92,
    inStock: true,
    featured: false,
    tags: ['Figma', 'Mobile', 'Banking', 'UI Kit'],
  },
  {
    productId: 'prod-018',
    name: 'Startup Launch Bundle',
    description:
      'Everything a startup needs: website template, pitch deck, social media kit, and brand guidelines.',
    price: 399.99,
    category: 'Digital',
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    featured: true,
    tags: ['Startup', 'Bundle', 'Branding', 'Complete'],
  },
  {
    productId: 'prod-019',
    name: 'Video Background Collection',
    description:
      '50 premium 4K video backgrounds perfect for hero sections and landing pages. Multiple categories.',
    price: 79.99,
    category: 'Digital',
    rating: 4.6,
    reviewCount: 143,
    inStock: true,
    featured: false,
    tags: ['Video', 'Backgrounds', '4K'],
  },
  {
    productId: 'prod-020',
    name: 'Code Snippet Library',
    description:
      '300+ production-ready code snippets for React, Vue, and vanilla JavaScript. Copy, paste, customize.',
    price: 69.99,
    category: 'Digital',
    rating: 4.8,
    reviewCount: 234,
    inStock: true,
    featured: false,
    tags: ['Code', 'Snippets', 'React', 'JavaScript'],
  },
  {
    productId: 'prod-021',
    name: 'Branding Guidelines Template',
    description:
      'Professional brand guidelines template with logo usage, color palettes, typography, and examples.',
    price: 54.99,
    category: 'Design',
    rating: 4.7,
    reviewCount: 108,
    inStock: true,
    featured: false,
    tags: ['Branding', 'Guidelines', 'Identity'],
  },
  {
    productId: 'prod-022',
    name: 'Restaurant Website Template',
    description:
      'Delicious restaurant website template with online ordering, reservations, and menu management.',
    price: 189.99,
    category: 'Templates',
    rating: 4.8,
    reviewCount: 79,
    inStock: true,
    featured: false,
    tags: ['Restaurant', 'Ordering', 'Reservations'],
  },
  {
    productId: 'prod-023',
    name: 'Fitness App UI Kit',
    description:
      'Complete fitness app UI with workout tracking, nutrition planning, and social features. 100+ screens.',
    price: 149.99,
    category: 'Design',
    rating: 4.9,
    reviewCount: 86,
    inStock: true,
    featured: false,
    tags: ['Fitness', 'Mobile', 'UI Kit', 'Health'],
  },
  {
    productId: 'prod-024',
    name: 'Real Estate Platform Template',
    description:
      'Full-featured real estate platform with property listings, search, virtual tours, and agent profiles.',
    price: 329.99,
    category: 'Templates',
    rating: 4.7,
    reviewCount: 54,
    inStock: true,
    featured: true,
    tags: ['Real Estate', 'Listings', 'Search'],
  },
  {
    productId: 'gear-001',
    name: 'Sony A7 IV Mirrorless Camera',
    description:
      'The ultimate hybrid camera for content creators. 33MP Full-Frame sensor, 4K 60p, and incredible autofocus.',
    price: 2498.0,
    category: 'Gear',
    rating: 5.0,
    reviewCount: 3420,
    inStock: true,
    featured: true,
    tags: ['Camera', 'Sony', 'Video', 'Photography'],
    affiliateLink: 'https://amzn.to/3EXAMPLE',
  },
  {
    productId: 'gear-002',
    name: 'MacBook Pro 16" M3 Max',
    description:
      'Unstopdable performance for creative pros. 48GB Unified Memory, 1TB SSD, Space Black.',
    price: 3499.0,
    category: 'Gear',
    rating: 4.9,
    reviewCount: 890,
    inStock: true,
    featured: true,
    tags: ['Apple', 'MacBook', 'Laptop', 'Dev'],
    affiliateLink: 'https://amzn.to/3EXAMPLE',
  },
  {
    productId: 'gear-003',
    name: 'Shure SM7B Vocal Microphone',
    description:
      'The legendary broadcasting microphone. Perfect for podcasting, streaming, and voiceovers.',
    price: 399.0,
    category: 'Gear',
    rating: 4.9,
    reviewCount: 15400,
    inStock: true,
    featured: false,
    tags: ['Audio', 'Microphone', 'Streaming'],
    affiliateLink: 'https://amzn.to/3EXAMPLE',
  },
];

export function getFeaturedProducts(): Product[] {
  return productCatalog.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return productCatalog.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return productCatalog.find((p) => p.productId === id);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(productCatalog.map((p) => p.category)));
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return productCatalog.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

