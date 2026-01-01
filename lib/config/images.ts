/**
 * Central Image Manifest
 * ======================
 * Single source of truth for all gallery images.
 * Use helpers to select images with automatic looping.
 */

// All gallery images in order
export const GALLERY_IMAGES = [
  '/images/gallery/gallery-01.png',
  '/images/gallery/gallery-02.png',
  '/images/gallery/gallery-03.png',
  '/images/gallery/gallery-04.png',
  '/images/gallery/gallery-05.png',
  '/images/gallery/gallery-06.png',
  '/images/gallery/gallery-07.png',
  '/images/gallery/gallery-08.png',
  '/images/gallery/gallery-09.png',
  '/images/gallery/gallery-10.png',
  '/images/gallery/gallery-11.png',
  '/images/gallery/gallery-12.png',
  '/images/gallery/gallery-13.png',
  '/images/gallery/gallery-14.png',
  '/images/gallery/gallery-15.png',
  '/images/gallery/gallery-16.png',
  '/images/gallery/gallery-17.png',
] as const;

export const TOTAL_IMAGES = GALLERY_IMAGES.length;

/**
 * Get a single image by index (1-based, loops automatically)
 * @param index - 1-based index
 * @returns Image path
 */
export function getImage(index: number): string {
  // Convert to 0-based and wrap around
  const idx = ((index - 1) % TOTAL_IMAGES + TOTAL_IMAGES) % TOTAL_IMAGES;
  return GALLERY_IMAGES[idx];
}

/**
 * Get multiple images starting from a given index
 * @param count - Number of images to return
 * @param start - Starting index (1-based, default 1)
 * @returns Array of image paths
 */
export function getImages(count: number, start: number = 1): string[] {
  return Array.from({ length: count }, (_, i) => getImage(start + i));
}

/**
 * Get all images shuffled deterministically by seed
 * @param seed - Seed for deterministic shuffle (e.g., page name)
 * @returns Shuffled array of image paths
 */
export function getShuffledImages(seed: string = ''): string[] {
  const images = [...GALLERY_IMAGES];
  // Simple deterministic shuffle based on seed
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return images.sort((a, b) => {
    const aHash = (a.charCodeAt(15) + hash) % 100;
    const bHash = (b.charCodeAt(15) + hash) % 100;
    return aHash - bHash;
  });
}

// Pre-assigned images for specific sections
export const HERO_IMAGE = getImage(1);
export const HERO_MOBILE_IMAGE = getImage(2);

// Story section images (mobile scroll-snap)
export const STORY_IMAGES = {
  lashes: getImage(3),
  makeup: getImage(4),
  hair: getImage(5),
  brows: getImage(6),
  cta: getImage(7),
} as const;

// Service images
export const SERVICE_IMAGES = {
  lashes: getImage(3),
  makeup: getImage(4),
  hair: getImage(5),
  brows: getImage(8),
  styling: getImage(9),
} as const;

// About page images
export const ABOUT_IMAGES = {
  steph: getImage(10),
  studio: getImage(11),
  detail: getImage(12),
} as const;

// Gallery page gets all images in order
export const GALLERY_PAGE_IMAGES = GALLERY_IMAGES;
