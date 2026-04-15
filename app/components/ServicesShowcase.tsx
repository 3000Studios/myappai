'use client';

import { motion } from 'framer-motion';

interface Service {
  title: string;
  description: string;
  price: string;
  features: string[];
}

/**
 * Premium Services Showcase
 * Displays service offerings with pricing for revenue generation
 */
export default function ServicesShowcase() {
  const services: Service[] = [
    {
      title: 'Web Design & Development',
      description: 'Award-winning websites that convert visitors into customers',
      price: 'From $5,000',
      features: [
        'Custom responsive design',
        'Performance optimization',
        'SEO foundation',
        'Analytics integration',
        '6 months support',
      ],
    },
    {
      title: 'Brand Identity',
      description: 'Complete brand systems that make you unforgettable',
      price: 'From $3,000',
      features: [
        'Logo design & variants',
        'Brand guidelines',
        'Color palette & typography',
        'Marketing materials',
        'Social media assets',
      ],
    },
    {
      title: 'Digital Marketing',
      description: 'Data-driven campaigns that drive real ROI',
      price: 'From $2,500/mo',
      features: [
        'Social media management',
        'Content creation',
        'Paid advertising',
        'Email marketing',
        'Monthly reporting',
      ],
    },
    {
      title: 'E-Commerce Solutions',
      description: 'Complete online stores that maximize revenue',
      price: 'From $8,000',
      features: [
        'Full store setup',
        'Payment integration',
        'Inventory management',
        'Marketing automation',
        'Conversion optimization',
      ],
    },
    {
      title: 'App Development',
      description: 'Native and web apps that users love',
      price: 'From $15,000',
      features: [
        'iOS & Android apps',
        'Backend development',
        'API integration',
        'Push notifications',
        'App store deployment',
      ],
    },
    {
      title: 'Consulting & Strategy',
      description: 'Expert guidance to accelerate your digital growth',
      price: 'From $250/hr',
      features: [
        'Digital strategy',
        'UX/UI consultation',
        'Technology audit',
        'Growth planning',
        'Team training',
      ],
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Premium Services</h2>
          <p className="text-xl text-platinum max-w-3xl mx-auto">
            Comprehensive solutions tailored to elevate your business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card hover-lift group"
            >
              <h3 className="text-2xl font-bold mb-2 text-gold group-hover:text-shadow-gold transition-all">
                {service.title}
              </h3>

              <p className="text-platinum opacity-80 mb-4">{service.description}</p>

              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 text-[10px] uppercase font-black tracking-widest bg-red-600 text-white rounded animate-pulse">
                  Limited Time Offer
                </span>
              </div>

              <div className="text-3xl font-bold gradient-text mb-6">{service.price}</div>

              <ul className="space-y-3 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full glass border border-gold/30 text-gold py-3 rounded-lg font-semibold hover:bg-gold hover:text-black transition-all duration-300">
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

