/**
 * Central Image Manifest
 * ======================
 * Single source of truth for all gallery images.
 * Use helpers to select images with automatic looping.
 *
 * Images processed with muted editorial color grading:
 * - Dusty mauve pinks, creamy ivory whites
 * - Low contrast, warm sepia undertones
 * - Film-like dreamy quality (Vogue Italia aesthetic)
 */

// All gallery images in order (demo-v4 with editorial color grading)
export const GALLERY_IMAGES = [
  '/images/demo-v4/photo-01.png',
  '/images/demo-v4/photo-02.png',
  '/images/demo-v4/photo-03.png',
  '/images/demo-v4/photo-04.png',
  '/images/demo-v4/photo-05.png',
  '/images/demo-v4/photo-06.png',
  '/images/demo-v4/photo-07.png',
  '/images/demo-v4/photo-08.png',
  '/images/demo-v4/photo-09.png',
  '/images/demo-v4/photo-10.png',
  '/images/demo-v4/photo-11.png',
  '/images/demo-v4/photo-12.png',
  '/images/demo-v4/photo-13.png',
  '/images/demo-v4/photo-14.png',
  '/images/demo-v4/photo-15.png',
  '/images/demo-v4/photo-16.png',
  '/images/demo-v4/photo-17.png',
  '/images/demo-v4/photo-18.png',
  '/images/demo-v4/photo-19.png',
  '/images/demo-v4/photo-20.png',
  '/images/demo-v4/photo-21.png',
  '/images/demo-v4/photo-22.png',
  '/images/demo-v4/photo-23.png',
  '/images/demo-v4/photo-24.png',
  '/images/demo-v4/photo-25.png',
  '/images/demo-v4/photo-26.png',
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

// =============================================================================
// HERO IMAGE (Manually uploaded high-quality asset)
// =============================================================================
export const HERO_IMAGE = '/images/hero/hero-main.png';
export const HERO_MOBILE_IMAGE = getImage(1); // Fallback to gallery

// =============================================================================
// SERVICE & SECTION IMAGES (Recycled from gallery)
// =============================================================================

// Service images - prioritizing darker models (7, 8, 12, 15, 17)
// Must match the 5 service IDs from brand.ts: hair, makeup, skin, brows-lashes, wigs
export const SERVICE_IMAGES = {
  hair: getImage(7),
  makeup: getImage(12),
  skin: getImage(8),
  'brows-lashes': getImage(15),
  wigs: getImage(17),
} as const;

// About page images - replaced 11 with 15
export const ABOUT_IMAGES = {
  steph: getImage(10),
  studio: getImage(15),  // Changed from 11 to 15
  detail: getImage(12),
} as const;

// Gallery page gets all images in order
export const GALLERY_PAGE_IMAGES = GALLERY_IMAGES;
