/**
 * Global Media Registry
 * Single source of truth for all media assets
 */

export const mediaRegistry = {
  heroVideos: ['https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4'],

  backgroundVideos: [
    'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
  ],

  sounds: {
    hover: '/audio/hover.mp3',
    click: '/audio/click.mp3',
    success: '/audio/success.mp3',
    nav: '/audio/nav.mp3',
  },

  avatars: {
    default: '/avatars/default.mp4',
    female3d: '/avatars/female-3d.glb',
  },

  logos: {
    main: 'https://res.cloudinary.com/dj92eb97f/image/upload/v1767046287/new_logo-min_zd44u2.png',
    icon: 'https://res.cloudinary.com/dj92eb97f/image/upload/v1767046287/new_logo-min_zd44u2.png',
  },

  fallbackAssets: {
    video: 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
    image: 'https://res.cloudinary.com/dj92eb97f/image/upload/v1767046287/new_logo-min_zd44u2.png',
  },
};

export function getMedia(category: keyof typeof mediaRegistry, key?: string) {
  if (!key) return mediaRegistry[category];
  return (mediaRegistry[category] as any)[key] || mediaRegistry.fallbackAssets.image;
}

export function addMedia(category: string, url: string, key?: string) {
  // Add new media to registry
  console.log(`Adding ${url} to ${category}`);
}

