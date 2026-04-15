/**
 * Video Map
 * Per-page video background configuration
 */

export const videoMap: Record<string, string> = {
  '/': 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
  '/about': 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
  '/store': 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
  '/portfolio': 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
  '/live': 'https://res.cloudinary.com/dj92eb97f/video/upload/v1767186687/1230_ptjsbp.mp4',
};

export function getVideoForRoute(route: string): string | undefined {
  return videoMap[route];
}

