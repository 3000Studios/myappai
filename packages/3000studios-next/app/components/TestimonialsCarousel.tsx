'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

/**
 * Testimonials Carousel
 * Auto-rotating customer testimonials with smooth transitions
 */
export default function TestimonialsCarousel() {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Mitchell',
      role: 'CEO',
      company: 'TechVision Inc',
      content:
        '3000 Studios transformed our digital presence completely. The attention to detail and creative vision exceeded all expectations. Our conversion rates increased by 300%!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'Innovate Labs',
      content:
        'Working with 3000 Studios was an absolute game-changer. They delivered a cutting-edge solution that perfectly captured our brand identity and drove real business results.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder',
      company: 'Creative Minds Co',
      content:
        "The team at 3000 Studios is phenomenal! They brought our vision to life with incredible precision and creativity. The results speak for themselves - we've never looked better.",
      rating: 5,
    },
    {
      name: 'David Thompson',
      role: 'CTO',
      company: 'Digital Dynamics',
      content:
        'Exceptional quality, lightning-fast delivery, and outstanding support. 3000 Studios sets the gold standard for digital creative services. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Jessica Palmer',
      role: 'Brand Manager',
      company: 'Luxury Lifestyle',
      content:
        'The sophistication and elegance they brought to our project was unmatched. Every detail was perfected, resulting in a truly premium digital experience.',
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Change testimonial every 6 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 px-6 mesh-gradient">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
        >
          What Our Clients Say
        </motion.h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-8 md:p-12 min-h-[300px] flex flex-col justify-between"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-lg md:text-xl text-foreground mb-8 italic leading-relaxed">
                &quot;{testimonials[currentIndex].content}&quot;
              </p>

              {/* Author */}
              <div>
                <div className="text-gold font-semibold text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-platinum opacity-80">
                  {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-gold w-8' : 'bg-platinum opacity-40 hover:opacity-70'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

