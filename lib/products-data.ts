/**
 * Store Products Data
 * Third-party integrated products with pricing and inventory
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  inventory: number;
  sku: string;
  supplier: string;
  features: string[];
  specifications: Record<string, string>;
  shippingWeight?: number;
  tags: string[];
}

export const products: Product[] = [
  // === COURSES ===
  {
    id: 'prod_video_editing_pro',
    name: 'Professional Video Editing Course',
    description:
      'Complete video editing masterclass with DaVinci Resolve, Premiere Pro, and Final Cut Pro. Includes project files and lifetime access.',
    price: 297,
    compareAtPrice: 497,
    category: 'courses',
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'COURSE-VID-001',
    supplier: '3000Studios',
    features: [
      '20+ hours of video content',
      'Project files included',
      'Lifetime access',
      'Certificate of completion',
      '24/7 community support',
    ],
    specifications: {
      Duration: '20+ hours',
      Level: 'Beginner to Advanced',
      Software: 'DaVinci Resolve, Premiere Pro, Final Cut Pro',
      Language: 'English',
      Updates: 'Lifetime',
    },
    tags: ['video editing', 'course', 'davinci resolve', 'premiere pro'],
  },
  {
    id: 'prod_3d_animation_master',
    name: '3D Animation & Motion Graphics Masterclass',
    description:
      'Learn Blender, Cinema 4D, and After Effects. Create stunning 3D animations and motion graphics from scratch.',
    price: 397,
    compareAtPrice: 697,
    category: 'courses',
    images: [
      'https://images.unsplash.com/photo-1551913902-c92207f1a2b3?w=800',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'COURSE-3D-001',
    supplier: '3000Studios',
    features: [
      '30+ hours training',
      'Blender + Cinema 4D + After Effects',
      '100+ project files',
      'Render farm access',
      'Lifetime updates',
    ],
    specifications: {
      Duration: '30+ hours',
      Level: 'Intermediate to Advanced',
      Software: 'Blender, Cinema 4D, After Effects',
      Language: 'English',
      Projects: '50+ practical exercises',
    },
    tags: ['3d', 'animation', 'blender', 'cinema4d', 'motion graphics'],
  },
  {
    id: 'prod_youtube_growth',
    name: 'YouTube Growth Blueprint 2025',
    description:
      'Complete YouTube strategy course. Grow from 0 to 100K subscribers using proven tactics and AI tools.',
    price: 197,
    compareAtPrice: 397,
    category: 'courses',
    images: [
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'COURSE-YT-001',
    supplier: '3000Studios',
    features: [
      'Algorithm mastery',
      'Thumbnail templates',
      'Script templates',
      'Analytics dashboard',
      'Community access',
    ],
    specifications: {
      Duration: '15+ hours',
      Level: 'All levels',
      Tools: 'TubeBuddy, VidIQ, ChatGPT',
      Templates: '50+ thumbnails, 20+ scripts',
      Support: 'Private Discord',
    },
    tags: ['youtube', 'social media', 'content creation', 'growth'],
  },

  // === AI & SOFTWARE ===
  {
    id: 'prod_ai_automation',
    name: 'AI Automation Toolkit',
    description:
      'Complete AI automation suite with ChatGPT, Claude, and Gemini integrations. Automate content creation, customer service, and workflow.',
    price: 497,
    compareAtPrice: 997,
    category: 'software',
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      'https://images.unsplash.com/photo-1676277791608-ac4240481a10?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'SOFT-AI-001',
    supplier: '3000Studios',
    features: [
      'Multi-AI platform integration',
      'Custom workflow builder',
      'API access included',
      'White-label option',
      'Priority support',
    ],
    specifications: {
      Platforms: 'ChatGPT, Claude, Gemini, Groq',
      Deployment: 'Cloud-based',
      'API Calls': 'Unlimited',
      Updates: '12 months included',
      Support: 'Priority email + Discord',
    },
    tags: ['ai', 'automation', 'chatgpt', 'claude', 'productivity'],
  },
  {
    id: 'prod_content_ai_writer',
    name: 'AI Content Writer Pro',
    description:
      'Generate SEO-optimized blog posts, social media content, and email campaigns with AI. 100K words/month.',
    price: 97,
    compareAtPrice: 197,
    category: 'software',
    images: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'SOFT-AI-002',
    supplier: '3000Studios',
    features: [
      '100K words per month',
      'SEO optimization',
      '50+ templates',
      'Multi-language support',
      'Plagiarism checker',
    ],
    specifications: {
      Words: '100,000/month',
      Templates: '50+',
      Languages: '25+',
      SEO: 'Built-in optimization',
      Export: 'PDF, DOCX, HTML',
    },
    tags: ['ai', 'content', 'writing', 'seo', 'marketing'],
  },
  {
    id: 'prod_video_ai_editor',
    name: 'AI Video Editor & Shorts Generator',
    description:
      'Automatically create short-form videos from long content. AI-powered editing, captions, and viral hooks.',
    price: 147,
    compareAtPrice: 297,
    category: 'software',
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'SOFT-VID-001',
    supplier: '3000Studios',
    features: [
      'Auto-generate shorts',
      'AI captions & subtitles',
      'Viral hook templates',
      'Multi-platform export',
      '500 videos/month',
    ],
    specifications: {
      Videos: '500/month',
      Platforms: 'TikTok, YouTube Shorts, Instagram Reels',
      Captions: 'Auto-generated + styled',
      Export: '1080p, 4K',
      Processing: 'Cloud-based',
    },
    tags: ['ai', 'video', 'shorts', 'tiktok', 'automation'],
  },

  // === BUNDLES & TEMPLATES ===
  {
    id: 'prod_streaming_bundle',
    name: 'Live Streaming Production Bundle',
    description:
      'Everything you need to start professional live streaming. Includes software licenses, templates, overlays, and training.',
    price: 397,
    compareAtPrice: 697,
    category: 'bundles',
    images: [
      'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800',
    ],
    inStock: true,
    inventory: 50,
    sku: 'BUNDLE-STREAM-001',
    supplier: '3000Studios',
    features: [
      'OBS Studio setup guide',
      '50+ stream overlays',
      'Alert system templates',
      'Multi-platform streaming guide',
      '90 days support',
    ],
    specifications: {
      Platforms: 'Twitch, YouTube, Facebook, TikTok',
      Software: 'OBS Studio, Streamlabs',
      Templates: '50+ overlays, 20+ alerts',
      Support: '90 days email support',
    },
    tags: ['streaming', 'obs', 'twitch', 'youtube', 'bundle'],
  },
  {
    id: 'prod_web_dev_template',
    name: 'Next.js Full-Stack Starter',
    description:
      'Production-ready Next.js template with authentication, payments, database, and deployment configured.',
    price: 197,
    compareAtPrice: 397,
    category: 'templates',
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'TEMPLATE-NEXT-001',
    supplier: '3000Studios',
    features: [
      'Next.js 15 + React 19',
      'Stripe & PayPal integration',
      'PostgreSQL + Prisma',
      'Authentication (NextAuth)',
      'Tailwind CSS + shadcn/ui',
      'Vercel deployment ready',
    ],
    specifications: {
      Framework: 'Next.js 15',
      Database: 'PostgreSQL',
      Payments: 'Stripe, PayPal',
      Auth: 'NextAuth.js',
      Styling: 'Tailwind CSS',
    },
    tags: ['nextjs', 'template', 'full-stack', 'saas', 'starter'],
  },
  {
    id: 'prod_ultimate_creator_bundle',
    name: 'Ultimate Creator Bundle',
    description:
      'Everything you need to succeed as a content creator. 10+ courses, 1000+ templates, lifetime access.',
    price: 997,
    compareAtPrice: 2997,
    category: 'bundles',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'BUNDLE-ULTIMATE-001',
    supplier: '3000Studios',
    features: [
      '10+ complete courses',
      '1000+ templates',
      'AI tools access',
      'Private community',
      'Lifetime updates',
      '1-on-1 coaching session',
    ],
    specifications: {
      Courses: '10+',
      Templates: '1000+',
      Value: '$5000+',
      Access: 'Lifetime',
      Bonus: '1-hour coaching call',
    },
    tags: ['bundle', 'creator', 'ultimate', 'courses', 'templates'],
  },
  {
    id: 'prod_social_media_templates',
    name: 'Social Media Template Pack (1000+)',
    description:
      'Instagram, TikTok, YouTube templates. Canva-ready designs for every niche. Updated monthly.',
    price: 67,
    compareAtPrice: 147,
    category: 'templates',
    images: [
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800',
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'TEMPLATE-SM-001',
    supplier: '3000Studios',
    features: [
      '1000+ templates',
      'All social platforms',
      'Canva ready',
      'Monthly updates',
      'Commercial license',
    ],
    specifications: {
      Templates: '1000+',
      Platforms: 'Instagram, TikTok, YouTube, Facebook',
      Format: 'Canva, PSD, Figma',
      License: 'Commercial use',
      Updates: 'Monthly',
    },
    tags: ['templates', 'social media', 'instagram', 'tiktok', 'canva'],
  },

  // === SERVICES ===
  {
    id: 'prod_consulting_hour',
    name: '1-Hour Consulting Session',
    description:
      'One-on-one consulting for video production, web development, or AI automation strategy.',
    price: 250,
    category: 'services',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
    ],
    inStock: true,
    inventory: 10,
    sku: 'SERVICE-CONSULT-001',
    supplier: '3000Studios',
    features: [
      '60 minutes video call',
      'Screen sharing included',
      'Follow-up email summary',
      'Action plan document',
      'Recording provided',
    ],
    specifications: {
      Duration: '60 minutes',
      Format: 'Zoom/Google Meet',
      Recording: 'Yes',
      'Follow-up': 'Email summary + action plan',
    },
    tags: ['consulting', 'service', 'strategy', 'coaching'],
  },
  {
    id: 'prod_web_development',
    name: 'Custom Website Development',
    description:
      'Full custom website development. Modern design, fast performance, SEO optimized. 4-6 weeks delivery.',
    price: 5000,
    compareAtPrice: 10000,
    category: 'services',
    images: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    ],
    inStock: true,
    inventory: 3,
    sku: 'SERVICE-WEB-001',
    supplier: '3000Studios',
    features: [
      'Custom design',
      'Next.js/React',
      'Mobile responsive',
      'SEO optimized',
      'CMS integration',
      '3 months support',
    ],
    specifications: {
      Timeline: '4-6 weeks',
      Revisions: '3 rounds',
      Pages: 'Up to 10',
      Support: '3 months',
      Tech: 'Next.js, React, Tailwind',
    },
    tags: ['web development', 'service', 'custom', 'website'],
  },
  {
    id: 'prod_video_production',
    name: 'Professional Video Production',
    description:
      'Complete video production service. Scripting, filming, editing, color grading. 2-3 minute final video.',
    price: 3000,
    compareAtPrice: 6000,
    category: 'services',
    images: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
    ],
    inStock: true,
    inventory: 5,
    sku: 'SERVICE-VIDEO-001',
    supplier: '3000Studios',
    features: [
      'Professional filming',
      'Script writing',
      'Professional editing',
      'Color grading',
      '2 revisions',
      '4K delivery',
    ],
    specifications: {
      Length: '2-3 minutes',
      Resolution: '4K',
      Revisions: '2',
      Delivery: '2-3 weeks',
      Locations: 'Up to 2',
    },
    tags: ['video production', 'service', 'filming', 'editing'],
  },

  // === DIGITAL PRODUCTS ===
  {
    id: 'prod_stock_footage',
    name: 'Premium Stock Footage Library',
    description:
      '500+ 4K stock footage clips. Nature, cityscapes, technology, people. Commercial license included.',
    price: 147,
    compareAtPrice: 397,
    category: 'digital',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'DIGITAL-STOCK-001',
    supplier: '3000Studios',
    features: [
      '500+ clips',
      '4K resolution',
      'Commercial license',
      'Organized by category',
      'Lifetime downloads',
    ],
    specifications: {
      Clips: '500+',
      Resolution: '4K',
      License: 'Commercial',
      Format: 'MP4, MOV',
      Size: '~200GB',
    },
    tags: ['stock footage', 'video', '4k', 'commercial'],
  },
  {
    id: 'prod_music_library',
    name: 'Royalty-Free Music Library',
    description:
      '1000+ tracks. All genres. Perfect for YouTube, podcasts, videos. Commercial license.',
    price: 97,
    compareAtPrice: 297,
    category: 'digital',
    images: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'DIGITAL-MUSIC-001',
    supplier: '3000Studios',
    features: [
      '1000+ tracks',
      'All genres',
      'Commercial license',
      'High quality WAV',
      'Monthly updates',
    ],
    specifications: {
      Tracks: '1000+',
      Format: 'MP3, WAV',
      License: 'Commercial',
      Quality: '320kbps, 16-bit',
      Updates: 'Monthly',
    },
    tags: ['music', 'royalty-free', 'audio', 'commercial'],
  },
  {
    id: 'prod_sound_effects',
    name: 'Sound Effects Pack (5000+)',
    description: '5000+ sound effects. UI, nature, cinematic, transitions. Organized library.',
    price: 67,
    compareAtPrice: 197,
    category: 'digital',
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'DIGITAL-SFX-001',
    supplier: '3000Studios',
    features: [
      '5000+ effects',
      'Organized categories',
      'High quality',
      'Commercial license',
      'Regular updates',
    ],
    specifications: {
      Effects: '5000+',
      Format: 'WAV, MP3',
      License: 'Commercial',
      Quality: '48kHz, 24-bit',
      Categories: '50+',
    },
    tags: ['sound effects', 'sfx', 'audio', 'commercial'],
  },
  {
    id: 'prod_luts_presets',
    name: 'Color Grading LUTs & Presets',
    description:
      '200+ professional LUTs and presets. Cinematic, vintage, modern looks. Works with all major software.',
    price: 47,
    compareAtPrice: 97,
    category: 'digital',
    images: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
      'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'DIGITAL-LUT-001',
    supplier: '3000Studios',
    features: [
      '200+ LUTs',
      'Multiple styles',
      'Universal compatibility',
      'Before/after previews',
      'Installation guide',
    ],
    specifications: {
      LUTs: '200+',
      Format: '.cube, .3dl',
      Software: 'Premiere, Final Cut, DaVinci, Photoshop',
      Styles: 'Cinematic, Vintage, Modern',
      Guide: 'Video tutorial included',
    },
    tags: ['luts', 'color grading', 'presets', 'video editing'],
  },

  // === MEMBERSHIPS ===
  {
    id: 'prod_monthly_membership',
    name: 'Creator Pro Monthly Membership',
    description:
      'Access all courses, templates, and tools. Cancel anytime. Best value for active creators.',
    price: 97,
    category: 'membership',
    images: [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'MEMBER-MONTHLY-001',
    supplier: '3000Studios',
    features: [
      'All courses access',
      'All templates',
      'AI tools included',
      'Priority support',
      'Monthly workshops',
      'Cancel anytime',
    ],
    specifications: {
      Billing: 'Monthly',
      Access: 'Everything',
      Support: 'Priority',
      Workshops: 'Monthly live sessions',
      Cancel: 'Anytime',
    },
    tags: ['membership', 'subscription', 'monthly', 'access-all'],
  },
  {
    id: 'prod_yearly_membership',
    name: 'Creator Pro Yearly (Save 40%)',
    description: 'Full year access to everything. Save $468 vs monthly. Best deal!',
    price: 697,
    compareAtPrice: 1164,
    category: 'membership',
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    ],
    inStock: true,
    inventory: 999,
    sku: 'MEMBER-YEARLY-001',
    supplier: '3000Studios',
    features: [
      'Everything included',
      'Save 40%',
      '1-on-1 kickoff call',
      'Exclusive bonuses',
      'Priority support',
      'Certificate programs',
    ],
    specifications: {
      Billing: 'Yearly',
      Savings: '$468/year',
      Access: 'Everything',
      Bonus: '1-hour call + exclusive content',
      Support: 'VIP priority',
    },
    tags: ['membership', 'subscription', 'yearly', 'best-deal'],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit: number = 3): Product[] {
  return products.slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.includes(lowerQuery))
  );
}

export function getProducts(): Product[] {
  return products;
}

