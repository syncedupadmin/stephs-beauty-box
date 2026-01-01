/**
 * HOME STORY SECTIONS - MOBILE SCROLL-SNAP EXPERIENCE
 * =====================================================
 * Data-driven config for the mobile campaign story.
 * Each section is a full-screen story slide.
 *
 * RULES:
 * - Minimum 4 sections required
 * - Headlines max 7 words
 * - Supporting lines max 12 words
 * - CTAs: "Inquire" / "Start the Journey" / "View Gallery"
 * - Images should be inclusive and diverse
 */

import { getImage } from './images';

export interface StorySection {
  id: string;
  imageSrc: string; // Image path from manifest
  imageAlt: string;
  headline: string; // Max 7 words
  supportingLine: string; // Max 12 words
  cta: {
    label: string;
    href: string;
  };
  textPosition: 'bottom-left' | 'bottom-right' | 'bottom-center';
}

export const homeStorySections: StorySection[] = [
  {
    id: 'hero',
    imageSrc: getImage(1),
    imageAlt: 'Beauty campaign featuring diverse model',
    headline: 'Beauty for Everyone',
    supportingLine: 'A welcoming space where all are celebrated.',
    cta: {
      label: 'Start the Journey',
      href: '/contact',
    },
    textPosition: 'bottom-left',
  },
  {
    id: 'hair',
    imageSrc: getImage(5),
    imageAlt: 'Hair styling and transformation',
    headline: 'Hair That Tells Your Story',
    supportingLine: 'Styling, color, and transformations for every texture.',
    cta: {
      label: 'Inquire',
      href: '/contact',
    },
    textPosition: 'bottom-right',
  },
  {
    id: 'makeup',
    imageSrc: getImage(4),
    imageAlt: 'Professional makeup application',
    headline: 'Artistry in Every Stroke',
    supportingLine: 'From soft natural to bold glamour.',
    cta: {
      label: 'View Gallery',
      href: '/gallery',
    },
    textPosition: 'bottom-left',
  },
  {
    id: 'experience',
    imageSrc: getImage(7),
    imageAlt: 'The beauty experience',
    headline: 'Inner and Outer Radiance',
    supportingLine: 'Where beauty meets grace.',
    cta: {
      label: 'Start the Journey',
      href: '/contact',
    },
    textPosition: 'bottom-center',
  },
];

// Desktop editorial sections (different from mobile story)
export interface EditorialSection {
  id: string;
  imageSrc: string;
  imageAlt: string;
  overline: string;
  headline: string;
  body: string;
  cta: {
    label: string;
    href: string;
  };
  imagePosition: 'left' | 'right';
}

export const editorialSections: EditorialSection[] = [
  {
    id: 'hair',
    imageSrc: getImage(5),
    imageAlt: 'Hair artistry',
    overline: 'Hair',
    headline: 'Your Crown, Reimagined',
    body: 'From transformative color to precision cuts, we work with every texture and style. Your hair tells a story—let us help you write the next chapter.',
    cta: {
      label: 'Inquire',
      href: '/contact',
    },
    imagePosition: 'left',
  },
  {
    id: 'makeup',
    imageSrc: getImage(4),
    imageAlt: 'Makeup artistry',
    overline: 'Makeup',
    headline: 'The Art of You',
    body: 'Whether soft and natural or bold and dramatic, our makeup artistry enhances your unique beauty. Every face is a canvas waiting for its moment.',
    cta: {
      label: 'View Gallery',
      href: '/gallery',
    },
    imagePosition: 'right',
  },
  {
    id: 'skin',
    imageSrc: getImage(8),
    imageAlt: 'Skincare treatments',
    overline: 'Skin & Facials',
    headline: 'Glow from Within',
    body: 'Nurturing treatments designed to refresh and reveal your natural radiance. Because healthy skin is the foundation of true beauty.',
    cta: {
      label: 'Inquire',
      href: '/contact',
    },
    imagePosition: 'left',
  },
];

export default homeStorySections;
