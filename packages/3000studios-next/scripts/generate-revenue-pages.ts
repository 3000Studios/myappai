import fs from 'fs';
import path from 'path';

const pages = [
  {
    slug: 'best-ai-tools-for-creators',
    title: 'Best AI Tools for Creators (2025)',
    description:
      'Top AI tools to supercharge your creative workflow. Automated comparison of the best software for designers, developers, and artists.',
    keywords: 'ai tools, creator tools, best ai software, generative ai',
    content:
      'Discover the cutting-edge A.I. tools that are redefining creativity in 2025. From image generation to code assistance, these platforms are essential for modern creators.',
  },
  {
    slug: 'best-passive-income-tools',
    title: 'Best Passive Income Tools Online',
    description:
      'Generate revenue while you sleep with these proven digital tools. A comprehensive guide to automated income streams.',
    keywords: 'passive income tools, online income, automated revenue, make money online',
    content:
      'Building wealth requires smart tools. We explore the top platforms for affiliate marketing, digital products, and automated dropshipping that generate real passive income.',
  },
  {
    slug: 'web-design-trends-2025',
    title: 'Web Design Trends Dominating 2025',
    description:
      'Stay ahead of the curve with the latest web design trends. Immersive 3D, micro-interactions, and AI-driven layouts.',
    keywords: 'web design trends, 2025 design, ux trends, ui inspiration',
    content:
      'The web is becoming more immersive. Explore how glassmorphism, 3D elements, and AI-driven personalization are setting the standard for premium web experiences.',
  },
  {
    slug: 'ultimate-developer-setup',
    title: 'The Ultimate Developer Setup 2025',
    description:
      'Hardware and software essentials for peak coding performance. Keyboards, monitors, and productivity tools reviewed.',
    keywords: 'developer setup, coding gear, mechanical keyboards, productivity tools',
    content:
      'Efficiency starts with the right environment. We review the best mechanical keyboards, ergonomic chairs, and high-performance monitors for professional developers.',
  },
];

interface PageData {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  content: string;
}

const template = (p: PageData) => `
import { Metadata } from 'next';
import { AFFILIATES } from '@/lib/affiliates';

export const metadata: Metadata = {
  title: "${p.title} | 3000 Studios",
  description: "${p.description}",
  keywords: "${p.keywords}",
};

export default function RevenuePage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="space-y-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-fade-in-up">
            ${p.title}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
            ${p.description}
          </p>
        </header>

        {/* Content Body */}
        <div className="prose prose-invert prose-lg max-w-none glass-panel p-8 rounded-2xl animate-fade-in-up delay-200 border border-white/10">
          <p className="text-lg leading-relaxed text-gray-300">
            ${p.content}
          </p>
          
          <div className="my-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Why This Matters</h3>
            <p className="text-gray-400">
              In the rapidly evolving digital landscape, having the right tools is the difference between surviving and thriving. 
              These selections are vetted for performance, reliability, and ROI.
            </p>
          </div>
        </div>

        {/* Affiliate CTA Section */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up delay-300">
          <a 
            href={AFFILIATES.general('https://example.com/tool-1')} 
            rel="nofollow sponsored"
            target="_blank"
            className="group relative overflow-hidden rounded-xl p-6 glass-premium hover:border-gold/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">Premium Tool A</h3>
                <p className="text-sm text-gray-400 mt-1">Best for Professionals</p>
              </div>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium group-hover:bg-gold group-hover:text-black transition-all">
                Check Price &rarr;
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <a 
            href={AFFILIATES.amazon('B08XYZ')} 
            rel="nofollow sponsored"
            target="_blank"
            className="group relative overflow-hidden rounded-xl p-6 glass-premium hover:border-blue-400/50 transition-all duration-300 transform hover:-translate-y-1"
          >
             <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Top Rated Gear</h3>
                <p className="text-sm text-gray-400 mt-1">Amazon's Choice</p>
              </div>
              <span className="px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium group-hover:bg-blue-500 group-hover:text-white transition-all">
                View on Amazon &rarr;
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>

        <div className="text-center text-xs text-gray-600 pt-8">
          <p>Disclosure: This content is reader-supported. When you buy through links on our site, we may earn an affiliate commission.</p>
        </div>

      </div>
    </div>
  );
}
`;

// Ensure directory exists
const baseDir = path.join('src/app/revenue');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// 1. Process Hardcoded Pages
pages.forEach((p) => {
  generatePage(p);
});

// 2. Process "Dropzone" Content (src/revenue-content/*.json)
const dropzoneDir = 'src/revenue-content';
if (fs.existsSync(dropzoneDir)) {
  const files = fs.readdirSync(dropzoneDir).filter((file) => file.endsWith('.json'));

  files.forEach((file) => {
    try {
      const rawData = fs.readFileSync(path.join(dropzoneDir, file), 'utf-8');
      const p = JSON.parse(rawData);

      // Basic validation
      if (p.slug && p.title && p.content) {
        generatePage(p);
        console.log(`[Dropzone] Ingested: ${file} -> /revenue/${p.slug}`);
      } else {
        console.warn(
          `[Dropzone] Skipped ${file}: Missing requisite fields (slug, title, content).`
        );
      }
    } catch (err: unknown) {
      console.error("", err);
    }
  });
}

function generatePage(p: PageData) {
  const dir = path.join(baseDir, p.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(p));
  console.log(`Generated revenue page: ${p.slug}`);
}

