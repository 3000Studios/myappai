'use client';

import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  alt: string;
  title?: string;
  description?: string;
  ratio?: 'square' | 'portrait' | 'landscape' | 'video';
}

interface MediaGridProps {
  items: MediaItem[];
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapMap = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

const ratioMap = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-video',
  video: 'aspect-video',
};

/**
 * Responsive media grid component
 * - Supports images and videos
 * - Multiple aspect ratios
 * - Lazy loading
 * - Hover animations
 */
export default function MediaGrid({
  items,
  columns = 3,
  gap = 'md',
  className = '',
}: MediaGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gapMap[gap]} ${className}`}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`group relative overflow-hidden rounded-lg ${ratioMap[item.ratio || 'landscape']}`}
        >
          {item.type === 'image' ? (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <video
              src={item.src}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Text overlay */}
          {(item.title || item.description) && (
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.title && <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>}
              {item.description && <p className="text-sm text-platinum/80">{item.description}</p>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

