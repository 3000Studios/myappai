import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { src: '/shadow-ui/diamond.jpg', alt: 'Diamond' },
  { src: '/shadow-ui/gold.jpg', alt: 'Gold' },
  { src: '/shadow-ui/platinum.jpg', alt: 'Platinum' },
  { src: '/shadow-ui/ai.jpg', alt: 'AI' },
  { src: '/shadow-ui/space.jpg', alt: 'Space' },
  { src: '/shadow-ui/tech.jpg', alt: 'Tech' },
];

export default function RotatingCarousel() {
  const [index, setIndex] = useState(0);
  function next() {
    setIndex((i) => (i + 1) % items.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }
  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="relative w-full aspect-video overflow-hidden rounded-2xl shadow-2xl mb-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={items[index].src}
            alt={items[index].alt}
            className="absolute w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.92, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotate: 10 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>
      <div className="flex gap-6">
        <button className="luxury-btn" onClick={prev}>
          &larr; Prev
        </button>
        <button className="luxury-btn" onClick={next}>
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

