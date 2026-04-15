/**
 * Blog Page
 * Content blog with rich, auto-generated articles and updates
 * Features: Article grid, categories, search functionality, newsletter signup
 */

'use client';

import VideoBackground from '@/components/VideoBackground';
import AdUnit from '@/components/monetization/AdUnit';
import { motion } from 'framer-motion';
import { Calendar, Search, Tag, User } from 'lucide-react';
import { useState } from 'react';
import Newsletter from '../components/Newsletter';
import { blogPosts, getAllCategories, getAllTags } from '../lib/blogData';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...getAllCategories()];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-x-hidden">
      <VideoBackground
        src="https://cdn.pixabay.com/video/2023/10/22/186175-877083431_large.mp4"
        opacity={0.3}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1
            className="text-5xl md:text-6xl font-bold mb-4 neon-glow"
            style={{ color: 'var(--marble-white)' }}
          >
            Blog & Insights
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--marble-white)' }}>
            Stories, insights, and updates from the 3000 Studios team
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 backdrop-blur-md rounded-xl bg-black/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 focus:bg-black/20 transition-all shadow-lg"
              aria-label="Search blog articles"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all hover-lift min-h-[44px] flex items-center ${
                selectedCategory === category
                  ? 'bg-gold text-black'
                  : 'glass border border-gold/30 text-gold hover:bg-gold/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Google Ads Placeholder - Revenue Generation */}
        <AdUnit slotId="blog-top-banner" format="horizontal" className="mb-8" />

        {/* Blog Posts Grid */}
        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group rounded-xl"
            >
              {/* Animated Glowing Border Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

              {/* Main Content Container - Tight & See-through */}
              <div className="relative h-full bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 overflow-hidden transition-all group-hover:border-yellow-500/30 flex flex-col md:flex-row gap-4">
                {/* Featured Image */}
                <div className="md:w-1/3 shrink-0">
                  <div className="w-full h-40 md:h-full min-h-[160px] bg-white/5 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-blue-500/10" />
                    {post.featured && (
                      <div className="absolute top-2 right-2 bg-yellow-500/90 text-black px-2 py-0.5 rounded text-[10px] font-bold tracking-wider backdrop-blur-md">
                        FEATURED
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-md text-xs font-medium border border-yellow-500/20">
                      {post.category}
                    </span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-md text-xs font-medium border border-blue-500/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-yellow-400 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <User size={12} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      <span>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button className="text-yellow-400 hover:text-white transition-colors font-semibold flex items-center gap-1 group/btn">
                        Read{' '}
                        <span className="group-hover/btn:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <p className="text-gray-400 text-lg">No articles found matching your search</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-6 py-2 bg-gold text-black font-semibold rounded-lg hover:bg-platinum transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Mid-Content Ad */}
        {filteredPosts.length > 5 && (
          <AdUnit slotId="blog-mid-content" format="rectangle" className="my-12" />
        )}

        {/* Newsletter Signup - Revenue Generation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Newsletter
            title="Join 1,000+ Subscribers"
            description="Get exclusive insights, industry trends, and special offers delivered to your inbox"
            showBenefits={true}
          />
        </motion.div>

        {/* AdSense Unit - After Newsletter */}
        <AdUnit slotId="blog-newsletter-bottom" format="horizontal" className="my-12" />

        {/* Related Topics */}
        <div className="mt-16 relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
          <div className="relative bg-black/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all group-hover:border-blue-500/30">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="text-yellow-400" size={24} />
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {getAllTags()
                .slice(0, 15)
                .map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-md text-gray-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-white/10 transition-all text-xs font-medium min-h-[32px] flex items-center"
                  >
                    {tag}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

