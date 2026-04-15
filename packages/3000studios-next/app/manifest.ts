import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '3000 Studios - Professional Creative Studio',
    short_name: '3000 Studios',
    description:
      'Premium creative studio specializing in digital products, live streaming, and AI-powered solutions',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FFD700',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

