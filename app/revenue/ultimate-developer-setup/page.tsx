import { Metadata } from 'next';
import { AFFILIATES } from '@/lib/affiliates';

export const metadata: Metadata = {
  title: 'The Ultimate Developer Setup 2025 | 3000 Studios',
  description:
    'Hardware and software essentials for peak coding performance. Keyboards, monitors, and productivity tools reviewed.',
  keywords: 'developer setup, coding gear, mechanical keyboards, productivity tools',
};

export default function RevenuePage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 animate-fade-in-up">
            The Ultimate Developer Setup 2025
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Hardware and software essentials for peak coding performance. Keyboards, monitors, and
            productivity tools reviewed.
          </p>
        </header>

        {/* Content Body */}
        <div className="prose prose-invert prose-lg max-w-none glass-panel p-8 rounded-2xl animate-fade-in-up delay-200 border border-white/10">
          <p className="text-lg leading-relaxed text-gray-300">
            Efficiency starts with the right environment. We review the best mechanical keyboards,
            ergonomic chairs, and high-performance monitors for professional developers.
          </p>

          <div className="my-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Why This Matters</h3>
            <p className="text-gray-400">
              In the rapidly evolving digital landscape, having the right tools is the difference
              between surviving and thriving. These selections are vetted for performance,
              reliability, and ROI.
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
                <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                  Premium Tool A
                </h3>
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
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Top Rated Gear
                </h3>
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
          <p>
            Disclosure: This content is reader-supported. When you buy through links on our site, we
            may earn an affiliate commission.
          </p>
        </div>
      </div>
    </div>
  );
}

