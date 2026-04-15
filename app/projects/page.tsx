/**
 * Projects Page
 * Interactive showcase of studio projects and work
 * Features: Project gallery, filtering by type, detailed project cards
 */

'use client';

import VideoBackground from '@/components/VideoBackground';
import AdUnit from '@/components/monetization/AdUnit';
import { Code, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image?: string;
  link?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with AI-powered recommendations',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Stripe'],
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=600&q=80',
  },
  {
    id: 2,
    title: 'Brand Identity System',
    description: 'Complete brand identity and design system for tech startup',
    category: 'Design',
    tags: ['Branding', 'UI/UX', 'Design System'],
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
  },
  {
    id: 3,
    title: 'Mobile App Experience',
    description: 'Premium mobile app with real-time features',
    category: 'Mobile',
    tags: ['React Native', 'Firebase', 'Animation'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  },
  {
    id: 4,
    title: 'AI Dashboard Analytics',
    description: 'Real-time analytics dashboard with machine learning insights',
    category: 'Web Development',
    tags: ['AI/ML', 'Data Viz', 'React'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    id: 5,
    title: '3D Product Configurator',
    description: 'Interactive 3D product visualization and customization',
    category: 'Interactive',
    tags: ['Three.js', 'WebGL', '3D'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
  },
  {
    id: 6,
    title: 'SaaS Platform',
    description: 'Multi-tenant SaaS platform with subscription management',
    category: 'Web Development',
    tags: ['Full-stack', 'SaaS', 'Payments'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
];

const categories = ['All', 'Web Development', 'Design', 'Mobile', 'Interactive'];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen relative py-8 px-4">
      <VideoBackground
        src="https://cdn.pixabay.com/video/2020/11/22/57523-484196884_large.mp4"
        opacity={0.3}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">Our Projects</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Showcasing our finest work across web, mobile, and interactive experiences
          </p>
        </div>

        {/* AdSense Placeholder */}
        <AdUnit slotId="projects-top-banner" format="horizontal" className="mb-8" />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gold text-black'
                  : 'glass border border-gray-700 text-gray-300 hover:border-gold'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card group">
              {/* Project Image */}
              <div className="relative w-full h-48 bg-gradient-to-br from-gold/20 to-sapphire/20 rounded-lg mb-4 overflow-hidden">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Code className="text-gold opacity-30" size={64} />
                  </div>
                )}
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-sm font-semibold">
                  {project.category}
                </span>
              </div>

              {/* Project Info */}
              <h2 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                {project.title}
              </h2>
              <p className="text-gray-400 mb-4">{project.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-900 text-gray-400 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button className="flex items-center gap-2 text-gold hover:text-platinum transition-colors min-h-[24px]">
                  <ExternalLink size={16} />
                  <span className="text-sm">View Project</span>
                </button>
                {project.github && (
                  <button className="flex items-center gap-2 text-gold hover:text-platinum transition-colors min-h-[24px]">
                    <Github size={16} />
                    <span className="text-sm">Code</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 card bg-gradient-to-r from-gold/10 to-sapphire/10 border-gold text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Have a Project in Mind?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Let&apos;s collaborate and bring your vision to life with cutting-edge technology
          </p>
          <button className="px-8 py-3 bg-gold text-black font-bold rounded-lg hover:bg-platinum transition-all hover:shadow-lg">
            Start a Project
          </button>
        </div>
      </div>
    </div>
  );
}

