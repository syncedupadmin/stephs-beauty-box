/**
 * HOME PAGE SECTIONS - Model Scroll Configuration
 * ================================================
 * Configures the full-screen scroll-snap model sections for mobile.
 * Each section represents a different aspect of the brand with diverse representation.
 *
 * IMAGE PLACEHOLDERS:
 * - Replace [MODEL_IMAGE_X] paths with actual photos when available
 * - Use images featuring models of different skin tones for inclusivity
 * - Recommended: soft, natural, editorial-style photography
 */

export interface HomeSection {
  id: string;
  // Image configuration
  image: {
    src: string;
    alt: string;
    // Position hint for object-position CSS
    position?: "center" | "top" | "bottom";
  };
  // Overlay content
  headline: string;
  subline: string;
  cta: {
    label: string;
    href: string;
    // Style variant
    variant: "primary" | "secondary" | "outline";
  };
  // Overlay positioning
  contentPosition: "bottom-left" | "bottom-center" | "center";
  // Optional overlay opacity (0-1)
  overlayOpacity?: number;
}

// =============================================================================
// SCROLL-SNAP SECTIONS
// =============================================================================

export const homeSections: HomeSection[] = [
  {
    id: "hero",
    image: {
      src: "/images/models/model-1.jpg", // [MODEL_IMAGE_1] - Placeholder
      alt: "Model showcasing natural beauty",
      position: "center",
    },
    headline: "Beauty for Everyone",
    subline: "A welcoming space where you belong.",
    cta: {
      label: "Get in Touch",
      href: "/contact",
      variant: "primary",
    },
    contentPosition: "bottom-left",
    overlayOpacity: 0.3,
  },
  {
    id: "hair",
    image: {
      src: "/images/models/model-2.jpg", // [MODEL_IMAGE_2] - Placeholder
      alt: "Model with styled hair",
      position: "center",
    },
    headline: "Hair That Speaks",
    subline: "Styling, color, and transformations.",
    cta: {
      label: "Explore Services",
      href: "/services#hair",
      variant: "outline",
    },
    contentPosition: "bottom-center",
    overlayOpacity: 0.35,
  },
  {
    id: "makeup",
    image: {
      src: "/images/models/model-3.jpg", // [MODEL_IMAGE_3] - Placeholder
      alt: "Model with makeup artistry",
      position: "center",
    },
    headline: "Your Glow, Elevated",
    subline: "From soft natural to full glam.",
    cta: {
      label: "View Gallery",
      href: "/gallery",
      variant: "outline",
    },
    contentPosition: "bottom-left",
    overlayOpacity: 0.3,
  },
  {
    id: "experience",
    image: {
      src: "/images/models/model-4.jpg", // [MODEL_IMAGE_4] - Placeholder
      alt: "Model representing inclusive beauty",
      position: "center",
    },
    headline: "Inner & Outer Radiance",
    subline: "Where beauty meets grace.",
    cta: {
      label: "About Us",
      href: "/about",
      variant: "secondary",
    },
    contentPosition: "bottom-center",
    overlayOpacity: 0.35,
  },
];

// =============================================================================
// DESKTOP HERO (Alternative layout for larger screens)
// =============================================================================

export const desktopHero = {
  headline: "Beauty for Everyone",
  subline: "A welcoming space in West Park, FL where everyone belongs. We celebrate beauty in all its forms—nurturing both your outer glow and inner radiance.",
  primaryCta: {
    label: "Get in Touch",
    href: "/contact",
  },
  secondaryCta: {
    label: "Our Services",
    href: "/services",
  },
  // Hero image for desktop
  image: {
    src: "/images/hero-desktop.jpg", // [HERO_DESKTOP] - Placeholder
    alt: "Steph's Beauty Box studio",
  },
};

// =============================================================================
// QUICK LINKS (Shown after scroll sections on mobile)
// =============================================================================

export const quickLinks = [
  {
    label: "Services",
    href: "/services",
    icon: "sparkles",
  },
  {
    label: "Shop",
    href: "/shop",
    icon: "bag",
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: "camera",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: "message",
  },
];

export default homeSections;
