export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background video */}
      <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full object-cover">
        <source
          src="https://videos.pexels.com/video-files/3535889/3535889-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />

      <div className="relative z-10 pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="text-6xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
                Get In Touch
              </h1>
              <p className="text-xl text-platinum/80 leading-relaxed mb-8">
                Have an exciting project in mind? Want to collaborate with 3000 Studios? We'd love
                to hear from you. Reach out and let's create something extraordinary together.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 hover:border-amber-400/50 transition-colors">
                  <span className="text-3xl">📧</span>
                  <div>
                    <p className="text-sm text-platinum/60">Email</p>
                    <a
                      href="mailto:contact@3000studios.com"
                      className="font-semibold text-amber-300 hover:text-amber-200"
                    >
                      contact@3000studios.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 hover:border-amber-400/50 transition-colors">
                  <span className="text-3xl">💼</span>
                  <div>
                    <p className="text-sm text-platinum/60">Business Hours</p>
                    <p className="font-semibold">Monday - Friday, 9 AM - 6 PM EST</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 hover:border-amber-400/50 transition-colors">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <p className="text-sm text-platinum/60">Response Time</p>
                    <p className="font-semibold">Within 24 hours</p>
                  </div>
                </div>
              </div>

              <a
                href="mailto:contact@3000studios.com"
                className="inline-block px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all duration-300 transform hover:scale-105"
              >
                Send Email
              </a>
            </div>

            {/* Visual element */}
            <div className="relative h-96 rounded-lg overflow-hidden group border border-amber-400/20 hover:border-amber-400/50 transition-colors duration-300">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
                alt="Get in touch"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="relative mb-20">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center">Send us a Message</h2>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">Your Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-platinum/40 focus:border-amber-400 focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3">Your Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-platinum/40 focus:border-amber-400 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Company/Project</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-platinum/40 focus:border-amber-400 focus:outline-none transition-colors"
                    placeholder="Your company or project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Project Type</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-amber-400 focus:outline-none transition-colors">
                    <option className="bg-black">Select project type...</option>
                    <option className="bg-black">Web Design</option>
                    <option className="bg-black">Web Development</option>
                    <option className="bg-black">Branding</option>
                    <option className="bg-black">Video Production</option>
                    <option className="bg-black">3D/Animation</option>
                    <option className="bg-black">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Project Details</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-platinum/40 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project, goals, and timeline..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-400/50 transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Services Grid */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">What We Can Help With</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Design', items: ['UI/UX', 'Branding', 'Visual Design'] },
                {
                  title: 'Development',
                  items: ['Web Apps', 'E-commerce', 'Platforms'],
                },
                {
                  title: 'Media',
                  items: ['Video Production', 'Animation', '3D Content'],
                },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 hover:border-amber-400/50 transition-colors duration-300 group"
                >
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>
                  <ul className="space-y-2 text-platinum/70">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center pt-12 border-t border-white/10">
            <h3 className="text-2xl font-bold mb-8">Connect With Us</h3>
            <div className="flex gap-6 justify-center flex-wrap">
              {['Twitter', 'LinkedIn', 'Instagram', 'GitHub'].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg hover:border-amber-400/50 hover:text-amber-400 transition-all duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

