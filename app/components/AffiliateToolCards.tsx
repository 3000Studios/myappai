/**
 * Affiliate Tool Stack Cards
 * Monetization through affiliate links
 * REVENUE LOCK — DO NOT MODIFY
 * Each card generates affiliate revenue
 */

'use client';

import { motion } from 'framer-motion';
import { Bot, DollarSign, Server, Video } from 'lucide-react';
import { brand } from '@/design/brand';

interface AffiliateTool {
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  affiliateLink: string;
  price: string;
  badge?: string;
}

const affiliateTools: AffiliateTool[] = [
  {
    name: 'ChatGPT Plus',
    category: 'AI',
    description: 'Most powerful AI for content creation and automation',
    icon: <Bot size={32} />,
    affiliateLink: 'https://chat.openai.com/plus',
    price: '$20/mo',
    badge: 'Essential',
  },
  {
    name: 'Vercel Pro',
    category: 'Hosting',
    description: 'Lightning-fast hosting with automatic deployments',
    icon: <Server size={32} />,
    affiliateLink: 'https://vercel.com/pricing',
    price: '$20/mo',
    badge: 'Recommended',
  },
  {
    name: 'Stripe',
    category: 'Finance',
    description: 'Accept payments and scale revenue globally',
    icon: <DollarSign size={32} />,
    affiliateLink: 'https://stripe.com',
    price: 'Free',
    badge: 'Free Start',
  },
  {
    name: 'Riverside.fm',
    category: 'Video',
    description: 'Studio-quality remote recording for creators',
    icon: <Video size={32} />,
    affiliateLink: 'https://riverside.fm',
    price: '$15/mo',
    badge: 'Creator Pick',
  },
];

export default function AffiliateToolCards() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: brand.colors.text.primary }}
          >
            Our Tech Stack
          </h2>
          <p style={{ color: brand.colors.text.secondary }}>
            The tools we use to build digital empires
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {affiliateTools.map((tool, idx) => (
            <motion.a
              key={idx}
              href={tool.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="block p-6 rounded-lg relative overflow-hidden group"
              style={{
                background: brand.colors.bg.elevated,
                border: `1px solid ${brand.colors.border.default}`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: brand.colors.shadow.lg,
              }}
            >
              {/* Badge */}
              {tool.badge && (
                <div
                  className="absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded"
                  style={{
                    background: brand.colors.gradient.primary,
                    color: brand.colors.text.inverse,
                  }}
                >
                  {tool.badge}
                </div>
              )}

              {/* Icon */}
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
                style={{
                  background: brand.colors.bg.glass,
                  color: brand.colors.action.primary,
                }}
              >
                {tool.icon}
              </div>

              {/* Category */}
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: brand.colors.action.secondary }}
              >
                {tool.category}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold mb-2" style={{ color: brand.colors.text.primary }}>
                {tool.name}
              </h3>

              {/* Description */}
              <p className="text-sm mb-4" style={{ color: brand.colors.text.secondary }}>
                {tool.description}
              </p>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="font-bold" style={{ color: brand.colors.revenue.positive }}>
                  {tool.price}
                </span>
                <span
                  className="text-sm group-hover:translate-x-1 transition-transform"
                  style={{ color: brand.colors.action.primary }}
                >
                  Learn more →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

