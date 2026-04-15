'use client';

import VideoBackground from '@/components/VideoBackground';
import AdUnit from '@/components/monetization/AdUnit';
import { useCartStore } from '@/lib/cart-store';
import { Check, ExternalLink, ShoppingCart, Sparkles, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// ============================================
// DIGITAL PRODUCTS - Live and ready to sell
// ============================================
const PRODUCTS = [
  {
    id: 'ai-automation-toolkit',
    name: 'AI Automation Toolkit',
    description:
      'Complete starter kit for building AI-powered automation workflows. Includes 50+ ready-to-use templates, API integrations, and step-by-step guides.',
    price: 97,
    originalPrice: 197,
    category: 'Digital Product',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    features: [
      '50+ Automation Templates',
      'API Integration Guides',
      'ChatGPT Prompt Library',
      'Zapier & Make Workflows',
      'Video Tutorials (5+ hours)',
      'Lifetime Updates',
    ],
    badge: 'BEST SELLER',
    badgeColor: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'premium-ui-components',
    name: 'Premium UI Component Pack',
    description:
      'Production-ready React/Next.js components with Tailwind CSS. Beautifully designed, fully responsive, and easily customizable.',
    price: 149,
    originalPrice: 299,
    category: 'Component Library',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    features: [
      '200+ UI Components',
      'Dark/Light Mode Support',
      'TypeScript Ready',
      'Tailwind CSS Styling',
      'Figma Source Files',
      '1 Year Updates',
    ],
    badge: 'NEW',
    badgeColor: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'voice-command-system',
    name: 'Voice Command System',
    description:
      'Transform any web app into a voice-controlled experience. Complete SDK with speech recognition, command parsing, and AI integration.',
    price: 247,
    originalPrice: 497,
    category: 'SDK',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&q=80',
    features: [
      'Speech Recognition Engine',
      'Natural Language Processing',
      'Multi-language Support',
      'Custom Command Builder',
      'React/Vue/Angular SDKs',
      'Priority Support (1 year)',
    ],
    badge: 'PRO',
    badgeColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 'website-starter-kit',
    name: 'Premium Website Starter',
    description:
      'Complete Next.js 16 website template with authentication, payments, CMS, and SEO optimization. Launch in hours, not months.',
    price: 197,
    originalPrice: 397,
    category: 'Template',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
    features: [
      'Next.js 16 + TypeScript',
      'Stripe/PayPal Integration',
      'Auth (NextAuth.js)',
      'Prisma + PostgreSQL',
      'Tailwind + Animations',
      'Vercel Deploy Ready',
    ],
    badge: 'POPULAR',
    badgeColor: 'from-green-500 to-emerald-500',
  },
];

// Services section
const SERVICES = [
  {
    title: 'Custom Development',
    price: 'From $2,500',
    description: 'Full-stack web applications tailored to your needs',
    icon: '💻',
  },
  {
    title: 'AI Integration',
    price: 'From $1,500',
    description: 'Add AI capabilities to your existing applications',
    icon: '🤖',
  },
  {
    title: 'Design & Branding',
    price: 'From $1,000',
    description: 'Premium UI/UX design and brand identity',
    icon: '🎨',
  },
];

export default function StorePage() {
  const { addItem, getTotalItems } = useCartStore();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: (typeof PRODUCTS)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAddedProducts((prev) => new Set([...prev, product.id]));
    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  const cartItemCount = getTotalItems();

  return (
    <div className="min-h-screen relative">
      <VideoBackground
        src="https://res.cloudinary.com/dj92eb97f/video/upload/v1766986154/Coin_stack_lhwjax.mp4"
        opacity={0.3}
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-yellow-500/30 to-transparent blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/30 to-transparent blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-yellow-400" size={24} />
              <span className="text-yellow-400 font-semibold tracking-wider uppercase text-sm">
                Premium Digital Products
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] bg-clip-text text-transparent">
              3000 Studios Store
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional tools, templates, and resources to accelerate your digital projects.
              Built by developers, for developers.
            </p>
          </div>

          {/* Cart indicator */}
          {cartItemCount > 0 && (
            <div className="fixed top-24 right-6 z-50">
              <Link
                href="/store/checkout"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                <ShoppingCart size={20} />
                <span>{cartItemCount} items</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <Zap className="text-yellow-400" />
            Digital Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300"
              >
                {/* Badge */}
                <div
                  className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gradient-to-r ${product.badgeColor} text-white text-xs font-bold shadow-lg`}
                >
                  {product.badge}
                </div>

                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {product.features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check size={14} className="text-green-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <span className="text-3xl font-bold text-white">${product.price}</span>
                      <span className="ml-2 text-lg text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addedProducts.has(product.id)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all ${
                        addedProducts.has(product.id)
                          ? 'bg-green-600 text-white'
                          : 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:scale-105'
                      }`}
                    >
                      {addedProducts.has(product.id) ? (
                        <span className="flex items-center gap-2">
                          <Check size={18} />
                          Added!
                        </span>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Unit - After Products */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <AdUnit slotId="store-products-bottom" format="horizontal" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Professional Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <div
                key={i}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-[#D4AF37]/50 transition-all group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4">{service.description}</p>
                <p className="text-[#D4AF37] font-bold">{service.price}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Get a Custom Quote
              <ExternalLink size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* AdSense Unit - After Services */}
      <section className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <AdUnit slotId="store-services-bottom" format="rectangle" />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '250+', label: 'Happy Customers' },
              { value: '99%', label: 'Satisfaction Rate' },
              { value: '24/7', label: 'Support Available' },
              { value: '30-day', label: 'Money Back' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-[#D4AF37]">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {cartItemCount > 0 && (
        <section className="py-12 px-4 bg-gradient-to-r from-[#D4AF37]/10 via-yellow-500/5 to-[#D4AF37]/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to checkout?</h2>
            <p className="text-gray-400 mb-6">Complete your purchase with Stripe or PayPal</p>
            <Link
              href="/store/checkout"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black font-bold rounded-lg hover:scale-105 transition-transform text-lg"
            >
              <ShoppingCart size={20} />
              Proceed to Checkout ({cartItemCount} items)
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

