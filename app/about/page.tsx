import VideoBackground from '@/components/VideoBackground';

export default function About() {
  return (
    <>
      <div className="relative min-h-screen pt-16 bg-(--marble-black)">
        <VideoBackground />
        <div
          className="fixed inset-0 pointer-events-none z-40 border-4 border-(--gold-flake)"
          style={{ boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.3)' }}
        ></div>

        <main className="relative z-10 container mx-auto px-4 py-12">
          <section className="text-center py-12">
            <h1 className="text-5xl md:text-7xl font-bold text-(--marble-white) mb-4">
              <span className="neon-glow">About</span> Us
            </h1>
            <p className="text-xl text-(--marble-white) opacity-80 max-w-2xl mx-auto">
              Where creativity meets innovation
            </p>
          </section>

          <section className="max-w-4xl mx-auto py-8">
            <div className="backdrop-blur-md bg-(--card-bg) border border-(--card-border) rounded-2xl p-12 mb-12 shadow-2xl">
              <h2 className="text-4xl font-bold metallic-text-gold mb-6">Our Story</h2>
              <p className="text-lg text-(--marble-white) opacity-90 mb-4 leading-relaxed">
                3000 Studios is a creative powerhouse dedicated to pushing the boundaries of digital
                art, development, and design. We specialize in creating stunning visual experiences,
                innovative code solutions, and premium digital products.
              </p>
              <p className="text-lg text-(--marble-white) opacity-90 leading-relaxed">
                Our team combines technical expertise with artistic vision to deliver exceptional
                results that inspire and engage. From live wallpapers to custom code snippets, every
                project is crafted with attention to detail and a commitment to excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="backdrop-blur-md bg-(--card-bg) border border-(--card-border) rounded-2xl p-8 text-center hover:shadow-(--shadow-gold) transition-all duration-500 hover-shimmer">
                <h3 className="text-2xl font-bold metallic-text-gold mb-2">Creative</h3>
                <p className="text-(--marble-white) opacity-80">
                  Innovative designs and artistic excellence
                </p>
              </div>
              <div className="backdrop-blur-md bg-(--card-bg) border border-(--card-border) rounded-2xl p-8 text-center hover:shadow-(--shadow-gold) transition-all duration-500 hover-shimmer">
                <h3 className="text-2xl font-bold metallic-text-gold mb-2">Technical</h3>
                <p className="text-(--marble-white) opacity-80">
                  Cutting-edge development solutions
                </p>
              </div>
              <div className="backdrop-blur-md bg-(--card-bg) border border-(--card-border) rounded-2xl p-8 text-center hover:shadow-(--shadow-gold) transition-all duration-500 hover-shimmer">
                <h3 className="text-2xl font-bold metallic-text-gold mb-2">Premium</h3>
                <p className="text-(--marble-white) opacity-80">High-quality digital products</p>
              </div>
            </div>

            <div className="backdrop-blur-md bg-(--card-bg) border border-(--card-border) rounded-2xl p-12 shadow-2xl">
              <h2 className="text-4xl font-bold text-white mb-6">What We Do</h2>
              <ul className="space-y-4 text-lg text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-3">•</span>
                  <span>Custom digital artwork and illustrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-3">•</span>
                  <span>Live wallpapers and animated backgrounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-3">•</span>
                  <span>Code snippets and development resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-3">•</span>
                  <span>Web and mobile application development</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-3">•</span>
                  <span>Brand identity and UI/UX design</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="py-12 text-center">
            <div className="max-w-3xl mx-auto bg-linear-to-br from-gray-900/50 to-black/50 p-8 rounded-lg border-2 border-[#D4AF37] glossy-overlay">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Work Together?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Let&apos;s create something amazing together.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all duration-300 hover:scale-110"
              >
                Contact Us
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}


