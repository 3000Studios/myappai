/**
 * Cloudinary integration utilities
 * Provides image optimization, transformations, and media management
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dj92eb97f';

/**
 * Generate optimized Cloudinary image URL
 */
export const cloudinaryImage = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'crop' | 'auto';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    gravity?: 'auto' | 'center' | 'face';
  } = {}
): string => {
  const {
    width,
    height,
    crop = 'auto',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options;

  const transforms: string[] = [];

  if (width || height) {
    const w = width ? `w_${width}` : '';
    const h = height ? `h_${height}` : '';
    transforms.push([w, h, `c_${crop}`, `g_${gravity}`].filter(Boolean).join(','));
  }

  transforms.push(`q_${quality}`);
  transforms.push(`f_${format}`);

  const transformPath = transforms.length > 0 ? `/${transforms.join('/')}` : '';

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload${transformPath}/${publicId}`;
};

/**
 * Generate Cloudinary video URL
 */
export const cloudinaryVideo = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
  } = {}
): string => {
  const { width, height, quality = 'auto' } = options;

  const transforms: string[] = [];

  if (width || height) {
    const w = width ? `w_${width}` : '';
    const h = height ? `h_${height}` : '';
    transforms.push([w, h, 'c_fit'].filter(Boolean).join(','));
  }

  transforms.push(`q_${quality}`);

  const transformPath = transforms.length > 0 ? `/${transforms.join('/')}` : '';

  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload${transformPath}/${publicId}`;
};

/**
 * Upload image to Cloudinary (client-side)
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_upload'); // Set in Cloudinary dashboard

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.public_id;
  } catch (error: unknown) {
    console.error('Upload failed', error);
    throw error;
  }
};

/**
 * Get image metadata from Cloudinary
 */
export const getImageMetadata = async (publicId: string) => {
  try {
    const response = await fetch(
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/fl_getinfo/${publicId}.json`
    );
    return await response.json();
  } catch (error: unknown) {
    console.error('Failed to get metadata', error);
    return null;
  }
};
