'use client';

import MediaGrid from '@/components/MediaGrid';
import { Footer } from '@/components/ui/Footer';
import { Navigation } from '@/components/ui/Navigation';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ExperiencePage() {
  const caseStudies = [
    {
      id: '1',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      alt: 'Web Experience Design',
      title: 'Immersive Web',
      description: 'Next-gen interactive experiences',
      ratio: 'landscape' as const,
    },
    {
      id: '2',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
      alt: 'VR Experience',
      title: 'Virtual Reality',
      description: 'Immersive VR environments',
      ratio: 'landscape' as const,
    },
    {
      id: '3',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      alt: 'AR Integration',
      title: 'Augmented Reality',
      description: 'Blended digital-physical experiences',
      ratio: 'landscape' as const,
    },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source
          src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986144/3D_tunnel_to_purple_d7cofd.mp4"
          type="video/mp4"
        />
      </video>
      <div className="fixed inset-0 bg-black/50 -z-5"></div>

      <Navigation />

      <PageHeader title="EXPERIENCE" subtitle="Immersive Digital Environments" />

      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        {/* Main Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="hyper-glass p-12 rounded-sm">
            <h2 className="font-display text-4xl mb-6">The 3000 Standard</h2>
            <p className="font-sans text-platinum/70 leading-relaxed mb-8 font-light">
              We don't just build websites; we construct digital realities. Our experience design
              philosophy centers on the convergence of high-fidelity visuals, fluid motion, and
              intuitive interaction.
            </p>
            <ul className="space-y-4 font-sans text-sm tracking-wide text-platinum/50">
              <li className="flex items-center gap-4">
                <span className="w-1 h-1 bg-hologram rounded-full"></span>
                WebGL & 3D Integration
              </li>
              <li className="flex items-center gap-4">
                <span className="w-1 h-1 bg-hologram rounded-full"></span>
                Advanced Motion Physics
              </li>
              <li className="flex items-center gap-4">
                <span className="w-1 h-1 bg-hologram rounded-full"></span>
                Spatial Audio Environments
              </li>
            </ul>
          </div>

          <div className="relative h-96 w-full overflow-hidden rounded-sm border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-hologram/20 to-void z-10"></div>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connection-3126-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute bottom-8 left-8 z-20">
              <span className="font-mono text-xs text-hologram mb-2 block">SYSTEM STATUS</span>
              <h3 className="font-display text-3xl">ONLINE</h3>
            </div>
          </div>
        </div>

        {/* Design Principles */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl mb-4">Design Principles</h2>
            <p className="font-sans text-platinum/60">
              The philosophy behind every experience we create
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Visual Hierarchy',
                description: 'Elegant typography and spatial design that guides user attention',
              },
              {
                icon: '🎯',
                title: 'Intuitive Interaction',
                description: 'Natural, frictionless interactions that feel responsive and alive',
              },
              {
                icon: '⚡',
                title: 'Performance First',
                description: 'Lightning-fast loading with smooth 60fps animations throughout',
              },
            ].map((principle, idx) => (
              <div
                key={idx}
                className="hyper-glass p-10 rounded-sm group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="text-4xl mb-4">{principle.icon}</div>
                <h3 className="font-display text-2xl mb-4">{principle.title}</h3>
                <p className="font-sans text-platinum/60 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl mb-4">Featured Experiences</h2>
            <p className="font-sans text-platinum/60">
              Cutting-edge projects showcasing our capabilities
            </p>
          </div>

          <MediaGrid items={caseStudies} columns={3} gap="lg" />
        </div>

        {/* Technology Stack Section */}
        <div className="relative overflow-hidden rounded-sm hyper-glass p-12">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          >
            <source
              src="https://videos.pexels.com/video-files/3048997/3048997-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>

          <div className="relative z-10">
            <h3 className="font-display text-3xl mb-8 text-center">Our Technology Stack</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {['React', 'Three.js', 'WebGL', 'Tailwind'].map((tech, idx) => (
                <div
                  key={idx}
                  className="text-center py-6 border border-hologram/20 rounded-sm hover:border-hologram/50 transition-colors duration-300"
                >
                  <p className="font-mono text-sm text-hologram">{tech}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

