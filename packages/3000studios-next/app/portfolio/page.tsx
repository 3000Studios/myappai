/**
 * Portfolio Page
 * Professional portfolio showcase with case studies and client testimonials
 * Features: Detailed project cards, metrics, filtering, testimonials
 */

'use client';
import VideoBackground from '@/components/VideoBackground';
import AdUnit from '@/components/monetization/AdUnit';
import { motion } from 'framer-motion';
import { Award, ChevronRight, ExternalLink, Filter, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Newsletter from '../components/Newsletter';
import { getAllPortfolioCategories, portfolioItems } from '../lib/portfolioData';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const stats = [
    { icon: <Award size={32} />, value: '250+', label: 'Projects Completed' },
    { icon: <Users size={32} />, value: '500+', label: 'Happy Clients' },
    { icon: <TrendingUp size={32} />, value: '300%', label: 'Average ROI' },
    { icon: <Star size={32} />, value: '4.9', label: 'Client Rating' },
  ];

  const categories = ['All', ...getAllPortfolioCategories()];

  const filteredProjects =
    selectedCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === selectedCategory);

  const toggleProject = (id: string) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  return (
    <div className="min-h-screen relative py-8 px-4">
      <VideoBackground
        src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986142/3dweb_azplaj.mp4"
        opacity={0.3}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold gradient-text mb-4"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            A showcase of excellence, innovation, and transformative digital experiences that drive
            real results
          </motion.p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="card text-center hover-lift"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 glow">
                <div className="text-black">{stat.icon}</div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-2 text-gray-400 mr-4">
            <Filter size={20} />
            <span className="font-medium">Filter:</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all hover-lift ${
                selectedCategory === category
                  ? 'bg-gold text-black'
                  : 'glass border border-gold/30 text-gold hover:bg-gold/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Google Ads Unit */}
        <AdUnit slotId="portfolio-top-banner" format="horizontal" className="mb-12" />

        {/* Featured Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Star className="text-gold fill-gold" size={32} />
            Featured Case Studies
          </h2>
          <p className="text-gray-400 mb-8">Deep dives into our most impactful projects</p>

          <div className="space-y-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card-premium ${project.featured ? 'border-gold' : ''}`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Project Image/Icon */}
                  <div className="lg:w-1/3">
                    <div className="w-full h-64 bg-gradient-to-br from-gold/20 via-purple-500/10 to-sapphire/20 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      {project.featured && (
                        <div className="absolute top-4 right-4 bg-gold text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                          <Star size={16} className="fill-black" />
                          FEATURED
                        </div>
                      )}
                      <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                        {project.category === 'E-Commerce' && '🛍️'}
                        {project.category === 'SaaS' && '💼'}
                        {project.category === 'Mobile App' && '📱'}
                        {project.category === 'Real Estate' && '🏡'}
                        {project.category === 'Restaurant Tech' && '🍽️'}
                        {project.category === 'EdTech' && '📚'}
                        {project.category === 'Non-Profit' && '❤️'}
                        {project.category === 'Startup' && '🚀'}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="glass-premium px-3 py-1 rounded text-sm text-white font-semibold text-center">
                          {project.year}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="lg:w-2/3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-semibold">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-2 hover:text-gold transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 mb-4 italic">Client: {project.client}</p>

                    <p className="text-gray-400 mb-4 italic">Client: {project.client}</p>

                    <p className="text-gray-400 mb-4 italic">Client: {project.client}</p>

                    <p className="text-gray-300 mb-6 text-lg">{project.description}</p>

                    {/* Metrics */}
                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {project.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center p-3 glass-premium rounded-lg">
                            <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                            <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Expand/Collapse for Full Case Study */}
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="text-gold hover:text-platinum transition-colors font-semibold inline-flex items-center gap-2 mb-4"
                    >
                      {expandedProject === project.id ? 'Hide Details' : 'View Full Case Study'}
                      <ChevronRight
                        size={20}
                        className={`transition-transform ${expandedProject === project.id ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {/* Expanded Case Study Details */}
                    {expandedProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 pt-6 border-t border-gray-800"
                      >
                        {/* Challenge */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            🎯 The Challenge
                          </h4>
                          <p className="text-gray-400">{project.challenge}</p>
                        </div>

                        {/* Solution */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            💡 Our Solution
                          </h4>
                          <p className="text-gray-400">{project.solution}</p>
                        </div>

                        {/* Results */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            📊 Results & Impact
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {project.results.map((result, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-gray-300">
                                <TrendingUp
                                  className="text-green-400 flex-shrink-0 mt-1"
                                  size={18}
                                />
                                <span>{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                            🛠️ Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-sapphire/20 text-sapphire rounded-full text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial */}
                        {project.testimonial && (
                          <div className="card bg-gradient-to-br from-gold/10 to-sapphire/10 border-gold">
                            <div className="flex mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="text-gold fill-gold" size={18} />
                              ))}
                            </div>
                            <p className="text-gray-300 mb-4 italic text-lg">
                              &quot;{project.testimonial.quote}&quot;
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                                <Users className="text-black" size={24} />
                              </div>
                              <div>
                                <p className="text-white font-semibold">
                                  {project.testimonial.author}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {project.testimonial.position}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Services Overview */}
        <div className="card-premium bg-gradient-to-r from-gold/10 to-sapphire/10 border-gold mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center hover-lift">
              <h3 className="text-xl font-bold text-white mb-2">Web Development</h3>
              <p className="text-gray-400">
                Full-stack solutions with cutting-edge frameworks and best practices
              </p>
            </div>
            <div className="text-center hover-lift">
              <h3 className="text-xl font-bold text-white mb-2">Mobile Apps</h3>
              <p className="text-gray-400">
                Native and cross-platform applications that users love
              </p>
            </div>
            <div className="text-center hover-lift">
              <h3 className="text-xl font-bold text-white mb-2">UI/UX Design</h3>
              <p className="text-gray-400">
                Beautiful, user-centric interfaces that drive conversions
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <Newsletter
          variant="hero"
          title="Want Results Like These?"
          description="Join our newsletter to learn strategies that drive real business outcomes"
        />

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Ready to Start Your Success Story?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
            Let&apos;s discuss how we can help transform your vision into measurable results
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:from-platinum hover:to-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] text-lg hover-lift"
          >
            Get in Touch
            <ExternalLink size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

