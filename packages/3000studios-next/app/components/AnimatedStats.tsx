'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

/**
 * Animated Statistics Dashboard
 * Displays key metrics with count-up animations
 */
export default function AnimatedStats() {
  const [stats] = useState<Stat[]>([
    { label: 'Projects Completed', value: 250, suffix: '+', prefix: '' },
    { label: 'Happy Clients', value: 180, suffix: '+', prefix: '' },
    { label: 'Years Experience', value: 12, suffix: '', prefix: '' },
    { label: 'Success Rate', value: 99, suffix: '%', prefix: '' },
  ]);

  const [displayValues, setDisplayValues] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      const increment = stat.value / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayValues((prev) => {
            const newValues = [...prev];
            newValues[index] = Math.min(increment * currentStep, stat.value);
            return newValues;
          });
        } else {
          clearInterval(interval);
        }
      }, stepDuration);
    });
  }, [stats]);

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card text-center hover-lift"
            >
              <div className="gradient-text text-5xl md:text-6xl font-bold mb-2">
                {stat.prefix}
                {Math.floor(displayValues[index])}
                {stat.suffix}
              </div>
              <div className="text-platinum text-sm md:text-base opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

