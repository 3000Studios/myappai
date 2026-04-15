'use client';

import Image from 'next/image';

interface SectionMediaProps {
  type: 'image' | 'video';
  src: string;
  alt: string;
  title?: string;
  description?: string;
  position?: 'left' | 'right' | 'full';
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const heightMap = {
  sm: 'h-64',
  md: 'h-96',
  lg: 'h-[500px]',
  xl: 'h-[600px]',
};

/**
 * Section media component for single media with text
 * - Flexible positioning
 * - Lazy loading
 * - Responsive
 * - Works with images and videos
 */
export default function SectionMedia({
  type,
  src,
  alt,
  title,
  description,
  position = 'right',
  height = 'lg',
  className = '',
}: SectionMediaProps) {
  const mediaContent = (
    <div className={`relative rounded-lg overflow-hidden ${heightMap[height]} w-full`}>
      {type === 'image' ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );

  if (position === 'full') {
    return (
      <div className={`w-full space-y-6 ${className}`}>
        {mediaContent}
        {(title || description) && (
          <div className="max-w-2xl">
            {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
            {description && (
              <p className="text-lg text-platinum/70 leading-relaxed">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${className}`}>
      {/* Text content */}
      <div className={position === 'right' ? '' : 'md:order-2'}>
        {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
        {description && <p className="text-lg text-platinum/70 leading-relaxed">{description}</p>}
      </div>

      {/* Media */}
      <div className={position === 'right' ? 'md:order-2' : ''}>{mediaContent}</div>
    </div>
  );
}

