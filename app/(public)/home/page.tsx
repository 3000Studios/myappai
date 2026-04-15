import MediaGrid from '@/components/MediaGrid';
import SectionMedia from '@/components/SectionMedia';
import Image from 'next/image';

export default function HomePage() {
  const portfolioItems = [
    {
      id: '1',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      alt: 'Digital Design Portfolio',
      title: 'Digital Design',
      description: 'Cutting-edge UI/UX experiences',
      ratio: 'landscape' as const,
    },
    {
      id: '2',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      alt: 'Brand Strategy',
      title: 'Brand Strategy',
      description: 'Building iconic identities',
      ratio: 'landscape' as const,
    },
    {
      id: '3',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
      alt: 'Web Development',
      title: 'Web Development',
      description: 'High-performance platforms',
      ratio: 'landscape' as const,
    },
    {
      id: '4',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      alt: 'Motion Design',
      title: 'Motion Design',
      description: 'Fluid animations & interactions',
      ratio: 'landscape' as const,
    },
    {
      id: '5',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
      alt: '3D Visualization',
      title: '3D Visualization',
      description: 'Immersive 3D experiences',
      ratio: 'landscape' as const,
    },
    {
      id: '6',
      type: 'image' as const,
      src: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop',
      alt: 'Content Creation',
      title: 'Content Creation',
      description: 'Engaging multimedia stories',
      ratio: 'landscape' as const,
    },
  ];

  return (
    <div className="relative min-h-screen bg-black text-white">

      {/* Hero Section with Background Video */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3048997/3048997-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/70" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-linear-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-fade-in">
            3000 Studios
          </h1>
          <p className="text-2xl md:text-3xl text-platinum/90 mb-8 font-light">
            Where Innovation Meets Luxury
          </p>
          <p className="text-lg text-platinum/70 max-w-2xl mx-auto leading-relaxed font-light">
            Crafting immersive digital experiences that push the boundaries of design and
            technology.
          </p>
        </div>
      </div>

      {/* Features Section with Media */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionMedia
            type="image"
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=700&fit=crop"
            alt="Studio Creative Process"
            title="Our Creative Vision"
            description="We don't just build websites—we create digital experiences that inspire, engage, and transform. Our approach blends cutting-edge technology with timeless design principles to deliver solutions that resonate with your audience."
            position="right"
            height="lg"
          />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="relative py-20 px-6 bg-linear-to-b from-black to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">Our Services</h2>
            <p className="text-xl text-platinum/60">
              Comprehensive solutions for your digital needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: 'Web Design & Development',
                description: 'Responsive, high-performance websites that engage and convert',
                image:
                  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
              },
              {
                title: 'Brand & Identity',
                description: 'Compelling brand strategies and visual identities that stand out',
                image:
                  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
              },
              {
                title: 'Motion & Animation',
                description: 'Captivating animations and interactive experiences',
                image:
                  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg hyper-glass p-8 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-platinum/70 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-white">Featured Work</h2>
            <p className="text-xl text-platinum/60">
              A selection of our latest projects and collaborations
            </p>
          </div>

          <MediaGrid items={portfolioItems} columns={3} gap="lg" />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/2802809/2802809-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-white">Ready to Transform Your Vision?</h2>
          <p className="text-2xl text-platinum/80 mb-8">
            Let&apos;s collaborate to create something extraordinary.
          </p>
          <button className="px-8 py-4 bg-linear-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all duration-300 transform hover:scale-105">
            Start a Project
          </button>
        </div>
      </section>

    </div>
  );
}


