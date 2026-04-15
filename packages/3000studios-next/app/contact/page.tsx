/**
 * Contact Page
 * Contact form and information for getting in touch
 * Features: Enhanced contact form, lead capture, backend integration, validation
 */

'use client';

import VideoBackground from '@/components/VideoBackground';
import { AlertCircle, Check, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import GoogleMap from '../components/GoogleMap';

export default function ContactPage() {
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

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

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

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black py-8 px-4 relative">
      <VideoBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? We&apos;d love to hear from you. Let&apos;s create something
            amazing together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shrink-0 glow">
                  <Mail className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:contact@3000studios.com"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    contact@3000studios.com
                  </a>
                </div>
              </div>
            </div>

            <div className="card hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sapphire rounded-full flex items-center justify-center shrink-0 glow-sapphire">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+15550003000"
                    className="text-gray-400 hover:text-gold transition-colors"
                  >
                    +1 (555) 000-3000
                  </a>
                </div>
              </div>
            </div>

            <div className="card hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-platinum rounded-full flex items-center justify-center shrink-0 shimmer">
                  <MapPin className="text-black" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-gray-400">United States</p>
                  <p className="text-gray-500 text-sm">Serving clients worldwide</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card bg-linear-to-br from-gold/10 to-sapphire/10 border-gold">
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gold hover:scale-110 transition-all"
                >
                  <span className="text-white">𝕏</span>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gold hover:scale-110 transition-all"
                >
                  <span className="text-white">in</span>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gold hover:scale-110 transition-all"
                >
                  <span className="text-white">ig</span>
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="card-premium text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h4 className="text-white font-bold mb-1">Quick Response</h4>
              <p className="text-gray-400 text-sm">We typically respond within 24 hours</p>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-gray-900 border ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all`}
                      placeholder="John Doe"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-1 text-red-400 text-sm flex items-center gap-1"
                      >
                        <AlertCircle size={14} /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 bg-gray-900 border ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all`}
                      placeholder="john@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1 text-red-400 text-sm flex items-center gap-1"
                      >
                        <AlertCircle size={14} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Company (Optional)
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                      placeholder="Your Company Inc."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label
                      htmlFor="budget"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Project Budget (Optional)
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    >
                      <option value="">Select a range</option>
                      <option value="<5k">Less than $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-gray-900 border ${
                      errors.message ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none`}
                    placeholder="Tell us about your project, goals, and how we can help..."
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-1 text-red-400 text-sm flex items-center gap-1"
                    >
                      <AlertCircle size={14} /> {errors.message}
                    </p>
                  )}
                  <p className="mt-1 text-gray-500 text-xs">Minimum 20 characters</p>
                </div>

                {/* Newsletter Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-gold bg-gray-900 border-gray-700 rounded focus:ring-2 focus:ring-gold"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-400 cursor-pointer">
                    I want to receive updates, news, and special offers from 3000 Studios
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-linear-to-r from-gold to-yellow-500 text-black font-bold rounded-lg hover:from-platinum hover:to-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover-lift"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} />
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200 flex items-center gap-2">
                    <Check size={20} />
                    <span>{submitMessage}</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{submitMessage}</span>
                  </div>
                )}
              </form>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-sm text-gray-500 text-center">
                  🔒 Your information is secure and will never be shared with third parties
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Integration */}
        <div className="mt-12 card p-0 overflow-hidden hover-lift">
          <div className="w-full h-96">
            <GoogleMap
              apiKey={process.env.NEXT_PUBLIC_MAPS_API || 'YOUR_GOOGLE_MAPS_API_KEY_HERE'}
              center={{ lat: 33.749, lng: -84.388 }} // Atlanta, Georgia
              zoom={13}
              mapType="satellite"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

