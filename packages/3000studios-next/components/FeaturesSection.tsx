'use client';

import { motion } from 'framer-motion';
import { Globe, Shield, Sparkles, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Experience',
    description: 'Luxury hospitality meets cutting-edge technology',
  },
  {
    icon: Zap,
    title: 'Performance First',
    description: 'Lightning-fast load times and seamless interactions',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Accessible from anywhere in the world',
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Enterprise-grade security and reliability',
  },
];

export function FeaturesSection() {
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    hoverSoundRef.current = new Audio(
      'data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0Ya4AAAA='
    );
  }, []);

  const playHoverSound = () => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="w-full py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-bold text-3d mb-6 animate-glow">
            Why Choose Us
          </h2>
          <p className="text-xl text-gold-gradient">Experience the pinnacle of modern luxury</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel p-8 hover-pop glossy-border cursor-pointer"
                onMouseEnter={playHoverSound}
              >
                <div className="mb-6 animate-float">
                  <Icon className="w-12 h-12 text-gold-primary animate-glow" />
                </div>
                <h3 className="text-2xl font-bold text-gold-gradient mb-4">{feature.title}</h3>
                <p className="text-white/80 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

