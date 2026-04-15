'use client';

/**
 * Info Page - Combined About, Contact, JWS, and Vendors content
 */

import { AlertCircle, Check, Loader2, Lock, Mail, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// JWS Password
const JWS_PASSWORD = '88888888';

import VideoBackground from '@/components/VideoBackground';

export default function InfoPage() {
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    budget: '',
    message: '',
    newsletter: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // JWS state
  const [jwsPassword, setJwsPassword] = useState('');
  const [jwsError, setJwsError] = useState('');
  const [isJwsAuthenticated, setIsJwsAuthenticated] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.message.length < 20) newErrors.message = 'Message must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors above');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to send message');
      setSubmitStatus('success');
      setSubmitMessage("Thank you! We'll get back to you within 24 hours.");
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        budget: '',
        message: '',
        newsletter: true,
      });
      setErrors({});
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleJwsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jwsPassword === JWS_PASSWORD) {
      setIsJwsAuthenticated(true);
      setJwsError('');
    } else {
      setJwsError('Invalid password');
      setJwsPassword('');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Particle Background */}
      {/* Video Background */}
      <VideoBackground
        src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986234/earth_tpnzpa.mp4"
        opacity={0.3}
      />

      {/* Gold Border Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-40 border-4 border-[#D4AF37]"
        style={{ boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.3)' }}
      />

      <main className="relative z-10 pt-24 pb-16">
        {/* ========== 3KAI SYSTEM INTEGRITY BOARD ========== */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto backdrop-blur-2xl bg-black/40 border border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] relative group">
            <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/5 to-transparent pointer-events-none" />

            <div className="p-8 md:p-12 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-[#D4AF37]/20 pb-8 mb-8">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-4">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-[#D4AF37] tracking-[0.2em] uppercase">
                      SYSTEM_LIVE
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-2">
                    3KAI <span className="text-[#D4AF37]">Intelligence</span>
                  </h1>
                  <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">
                    Autonomous Deployment & Business Optimization Engine
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="p-6 glass border border-white/5 rounded-2xl text-center min-w-[120px]">
                    <div className="text-3xl font-black text-cyan-400 mb-1">99.9%</div>
                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                      Stability
                    </div>
                  </div>
                  <div className="p-6 glass border border-white/5 rounded-2xl text-center min-w-[120px]">
                    <div className="text-3xl font-black text-[#D4AF37] mb-1">Active</div>
                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider">
                      Status
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Uptime', value: '742:12:05', sub: 'ESTABLISHED' },
                  { label: 'Latency', value: '14ms', sub: 'GLOBAL_NEXUS' },
                  { label: 'Sec_Level', value: 'OMEGA', sub: 'ENCRYPTED' },
                  { label: 'Revenue', value: 'STREAMING', sub: 'WEBHOOKS_ACTIVE' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="space-y-2 p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors bg-white/5"
                  >
                    <div className="text-[10px] font-black text-white/40 tracking-widest uppercase">
                      {stat.label}
                    </div>
                    <div className="text-xl font-bold text-white tracking-tight">{stat.value}</div>
                    <div className="text-[9px] font-mono text-[#D4AF37]/60 tracking-tighter">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Terminal Log Mockup */}
              <div className="mt-8 p-4 bg-black/60 rounded-xl border border-[#D4AF37]/20 font-mono text-[11px] text-gray-400 h-32 overflow-hidden flex flex-col justify-end gap-1">
                <div className="flex gap-2">
                  <span className="text-[#D4AF37]/50">[SYSTEM]</span> Initiating neural handshake...
                  OK
                </div>
                <div className="flex gap-2">
                  <span className="text-[#D4AF37]/50">[AUTON]</span> Changes detected in repository
                  branch: main
                </div>
                <div className="flex gap-2">
                  <span className="text-[#D4AF37]/50">[BUILD]</span> Compiling aesthetic upgrades
                  for InfoPage...
                </div>
                <div className="flex gap-2">
                  <span className="text-[#D4AF37]/50">[DEPLOY]</span> Vercel integration responding
                  @ 200ms
                </div>
                <div className="flex gap-2 animate-pulse">
                  <span className="text-green-500">[STATUS]</span> 3KAI Autonomous CTO is watching
                  your back.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== ABOUT SECTION ========== */}
        <section id="about" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-[#D4AF37]">About</span> Us
            </h2>
            <p className="text-xl text-gray-400">Where creativity meets innovation</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="backdrop-blur-md bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-[#D4AF37] mb-6">Our Story</h3>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                3000 Studios is a creative powerhouse dedicated to pushing the boundaries of digital
                art, development, and design. We specialize in creating stunning visual experiences,
                innovative code solutions, and premium digital products.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our team combines technical expertise with artistic vision to deliver exceptional
                results that inspire and engage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Creative', 'Technical', 'Premium'].map((title, i) => (
                <div
                  key={i}
                  className="backdrop-blur-md bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-8 text-center hover:bg-white/10 transition-all"
                >
                  <h4 className="text-2xl font-bold text-[#D4AF37] mb-2">{title}</h4>
                  <p className="text-gray-400">
                    {i === 0 && 'Innovative designs and artistic excellence'}
                    {i === 1 && 'Cutting-edge development solutions'}
                    {i === 2 && 'High-quality digital products'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CONTACT SECTION ========== */}
        <section id="contact" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-[#D4AF37]">Get in</span> Touch
            </h2>
            <p className="text-xl text-gray-400">
              Have a project in mind? Let&apos;s create something amazing!
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <Mail className="text-black" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <a
                      href="mailto:contact@3000studios.com"
                      className="text-gray-400 hover:text-[#D4AF37]"
                    >
                      contact@3000studios.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <a href="tel:+15550003000" className="text-gray-400 hover:text-[#D4AF37]">
                      +1 (555) 000-3000
                    </a>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p className="text-gray-400">United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus !== 'idle' && (
                  <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${submitStatus === 'success' ? 'bg-green-900/30 border border-green-500/50' : 'bg-red-900/30 border border-red-500/50'}`}
                  >
                    {submitStatus === 'success' ? (
                      <Check size={20} className="text-green-400" />
                    ) : (
                      <AlertCircle size={20} className="text-red-400" />
                    )}
                    <p className={submitStatus === 'success' ? 'text-green-200' : 'text-red-200'}>
                      {submitMessage}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-900 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-900 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-900 border ${errors.message ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-none`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && <p className="mt-1 text-red-400 text-sm">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Send size={20} />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ========== JWS SECTION ========== */}
        <section id="jws" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-[#D4AF37]">JWS</span> Protected Area
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            {isJwsAuthenticated ? (
              <div className="backdrop-blur-md bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-black" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-2">Welcome, Boss Man J!</h3>
                <p className="text-gray-400 mb-6">Access granted to protected area</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => router.push('/matrix')}
                    className="p-4 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#FFD700]"
                  >
                    🎛️ Matrix Control
                  </button>
                  <button
                    onClick={() => router.push('/store')}
                    className="p-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
                  >
                    🛍️ Store
                  </button>
                </div>
              </div>
            ) : (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-black" size={32} />
                  </div>
                  <p className="text-gray-400">Enter password to access</p>
                </div>
                <form onSubmit={handleJwsSubmit} className="space-y-4">
                  {jwsError && (
                    <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
                      <AlertCircle size={18} />
                      {jwsError}
                    </div>
                  )}
                  <input
                    type="password"
                    value={jwsPassword}
                    onChange={(e) => setJwsPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Enter password"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#FFD700]"
                  >
                    Access Protected Area
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* ========== VENDORS SECTION ========== */}
        <section id="vendors" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-[#D4AF37]">Vendor</span> Platform
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/vendors"
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition-all block"
              >
                <h4 className="text-xl font-bold text-[#D4AF37]">Vendor Sign Up</h4>
                <p className="text-gray-400 mt-2">Submit your feed and join our platform</p>
              </Link>
              <Link
                href="/api/vendors/products?vendor=custom"
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#D4AF37] transition-all block"
              >
                <h4 className="text-xl font-bold text-[#D4AF37]">Browse Products</h4>
                <p className="text-gray-400 mt-2">View all ingested vendor products</p>
              </Link>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Platform Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>Multi-vendor product ingestion (CJ, ShareASale, Amazon, Shopify)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>Auto-pricing with margin guardrails</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>AI product ranking and relevance scoring</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>Commission tracking and analytics</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>Vendor self-signup with multiple models</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>Dropship fulfillment webhooks and routing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-green-500">✅</div>
                  <span>AI-generated product pages with SEO schema</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

