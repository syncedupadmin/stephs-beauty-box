/**
 * STEPH'S BEAUTY BOX - Brand Configuration
 * =========================================
 * SINGLE SOURCE OF TRUTH - All brand data lives here.
 *
 * DO NOT hardcode any of this information elsewhere in the codebase.
 * Import from this file: import { brand } from '@/lib/config/brand';
 *
 * Fields marked as null are UNKNOWN and need to be collected from the client.
 */

// =============================================================================
// CORE BRAND
// =============================================================================

export const brand = {
  name: "Steph's Beauty Box",
  tagline: "Faith, Glam & Beauty",
  motto: "WITH GOD ALL THINGS ARE POSSIBLE",
  description: "A faith-forward, glamorous beauty studio specializing in lashes, hair, and makeup artistry.",

  // Logo paths - relative to public folder
  logo: {
    main: "/brand/logo.jpg",
    // These can be added when client provides additional logo formats
    light: null as string | null,
    dark: null as string | null,
    icon: null as string | null,
  },
} as const;

// =============================================================================
// CONTACT INFORMATION
// =============================================================================

export const contact = {
  // VERIFIED
  phone: "+1 (786) 378-3511",
  phoneFormatted: "(786) 378-3511",
  phoneClean: "7863783511", // For tel: links

  // Client email
  email: "steph@stephsbeautybox.com",

  // VERIFIED
  address: {
    street: "5612 Pembroke Rd",
    unit: "Unit D",
    city: "West Park",
    state: "FL",
    zip: "33023",
    full: "5612 Pembroke Rd Unit D, West Park, FL 33023",
  },

  // Google Maps embed URL (need to generate from address)
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=5612+Pembroke+Rd+Unit+D+West+Park+FL+33023",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.1234!2d-80.1234!3d25.9876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU5JzE1LjQiTiA4MMKwMDcnMjQuNCJX!5e0!3m2!1sen!2sus!4v1234567890",
} as const;

// =============================================================================
// BUSINESS HOURS
// =============================================================================

export const hours = {
  // Full schedule - VERIFIED
  schedule: [
    { day: "Monday", hours: "Closed", isOpen: false },
    { day: "Tuesday", hours: "Closed", isOpen: false },
    { day: "Wednesday", hours: "11:00 AM - 7:00 PM", isOpen: true },
    { day: "Thursday", hours: "11:00 AM - 7:00 PM", isOpen: true },
    { day: "Friday", hours: "11:00 AM - 7:00 PM", isOpen: true },
    { day: "Saturday", hours: "11:00 AM - 7:00 PM", isOpen: true },
    { day: "Sunday", hours: "11:00 AM - 7:00 PM", isOpen: true },
  ],

  // Summary text
  summary: "Wed - Sun: 11:00 AM - 7:00 PM",
  closedDays: "Closed Monday & Tuesday",
} as const;

// =============================================================================
// SOCIAL MEDIA
// =============================================================================

export const social = {
  // VERIFIED
  instagram: {
    url: "https://instagram.com/stephsbeautybox__",
    handle: "@stephsbeautybox__",
  },
  threads: {
    url: "https://www.threads.net/@stephsbeautybox__",
    handle: "@stephsbeautybox__",
  },
  youtube: {
    url: "https://youtube.com/@stephsbeautybox__",
    handle: "@stephsbeautybox__",
  },

  // UNKNOWN - need from client
  tiktok: null as { url: string; handle: string } | null,
  snapchat: null as { url: string; handle: string } | null,
  facebook: null as { url: string; handle: string } | null,
} as const;

// =============================================================================
// BOOKING & PAYMENTS
// =============================================================================

export const booking = {
  // User mentioned booksy.com likely - NEED EXACT URL
  primaryUrl: null as string | null,
  buttonText: "Book Now",

  // Phone booking fallback
  phoneBooking: true,

  // UNKNOWN - need from client
  cashApp: null as string | null,
  zelle: null as string | null,
  venmo: null as string | null,
} as const;

// =============================================================================
// REVIEWS & TESTIMONIALS
// =============================================================================

export const reviews = {
  // UNKNOWN - need from client
  googleUrl: null as string | null,
  yelpUrl: null as string | null,

  // Featured testimonials - NEED FROM CLIENT
  // Will be displayed on the homepage
  featured: [] as Array<{
    name: string;
    text: string;
    service?: string;
    rating?: number;
  }>,
} as const;

// =============================================================================
// SERVICES
// =============================================================================

// Service categories - prices marked as null until confirmed
export const services = {
  categories: [
    {
      id: "lashes",
      name: "Lash Services",
      description: "Beautiful lash extensions and lifts",
      icon: "sparkle",
      services: [
        { name: "Classic Full Set", price: null as number | null, duration: null as string | null },
        { name: "Volume Full Set", price: null as number | null, duration: null as string | null },
        { name: "Mega Volume Full Set", price: null as number | null, duration: null as string | null },
        { name: "Lash Fill (2 weeks)", price: null as number | null, duration: null as string | null },
        { name: "Lash Fill (3 weeks)", price: null as number | null, duration: null as string | null },
        { name: "Lash Lift & Tint", price: null as number | null, duration: null as string | null },
        { name: "Lash Removal", price: null as number | null, duration: null as string | null },
      ],
    },
    {
      id: "hair",
      name: "Hair Services",
      description: "Styling, treatments, and transformations",
      icon: "scissors",
      services: [
        { name: "Silk Press", price: null as number | null, duration: null as string | null },
        { name: "Sew-In Install", price: null as number | null, duration: null as string | null },
        { name: "Wig Install", price: null as number | null, duration: null as string | null },
        { name: "Quick Weave", price: null as number | null, duration: null as string | null },
        { name: "Deep Conditioning", price: null as number | null, duration: null as string | null },
        { name: "Color Services", price: null as number | null, duration: null as string | null },
      ],
    },
    {
      id: "makeup",
      name: "Makeup Artistry",
      description: "Glam looks for any occasion",
      icon: "lipstick",
      services: [
        { name: "Full Glam Makeup", price: null as number | null, duration: null as string | null },
        { name: "Soft Glam / Natural", price: null as number | null, duration: null as string | null },
        { name: "Bridal Makeup", price: null as number | null, duration: null as string | null },
        { name: "Special Event", price: null as number | null, duration: null as string | null },
        { name: "Makeup Lesson", price: null as number | null, duration: null as string | null },
      ],
    },
    {
      id: "brows",
      name: "Brow Services",
      description: "Perfect brows for every face",
      icon: "eyebrow",
      services: [
        { name: "Brow Wax & Shape", price: null as number | null, duration: null as string | null },
        { name: "Brow Tint", price: null as number | null, duration: null as string | null },
        { name: "Brow Lamination", price: null as number | null, duration: null as string | null },
      ],
    },
  ],

  // Notice about pricing
  pricingNote: "Prices vary based on style and consultation. Book a consultation for an exact quote.",
} as const;

// =============================================================================
// GALLERY
// =============================================================================

export const gallery = {
  // Gallery images - NEED FROM CLIENT
  // These should be added to public/gallery/
  images: [] as Array<{
    src: string;
    alt: string;
    category: "lashes" | "hair" | "makeup" | "brows" | "other";
  }>,

  // Instagram feed integration
  instagramFeed: true, // Pull from Instagram if possible
} as const;

// =============================================================================
// SEO & META
// =============================================================================

export const seo = {
  title: "Steph's Beauty Box | Lashes, Hair & Makeup | West Park, FL",
  description: "Faith-forward beauty studio in West Park, FL offering lash extensions, hair services, and makeup artistry. WITH GOD ALL THINGS ARE POSSIBLE.",
  keywords: [
    "lash extensions West Park FL",
    "beauty salon West Park",
    "makeup artist South Florida",
    "hair stylist West Park FL",
    "lash lift and tint",
    "bridal makeup Florida",
    "Steph's Beauty Box",
  ],

  // Open Graph
  ogImage: "/brand/og-image.jpg", // Need to create

  // Location for local SEO
  location: {
    city: "West Park",
    state: "Florida",
    region: "South Florida",
    coordinates: {
      lat: 25.9876, // Approximate - need exact
      lng: -80.1234, // Approximate - need exact
    },
  },
} as const;

// =============================================================================
// THEME COLORS
// =============================================================================

export const theme = {
  // Dark glam aesthetic with gold/rose-gold accents
  colors: {
    // Primary background - deep dark
    bg: "#0A0A0A",
    bgSoft: "#141414",
    bgCard: "#1A1A1A",

    // Gold accent (primary)
    gold: "#D4AF37",
    goldSoft: "#E5C158",
    goldDark: "#B8972E",

    // Rose gold (secondary accent)
    roseGold: "#B76E79",
    roseGoldSoft: "#C9858F",

    // Text colors
    ivory: "#F5F1E8",
    ivorySoft: "#E8E4DB",
    ivoryMuted: "#A9A6A0",

    // Faith accent (soft purple/lavender optional)
    accent: "#9B7EBD",
  },

  // Font configuration
  fonts: {
    heading: "Playfair Display", // Elegant serif
    body: "Inter", // Clean sans-serif
  },
} as const;

// =============================================================================
// POLICIES
// =============================================================================

export const policies = {
  cancellation: {
    notice: "24 hours", // Need to confirm with client
    fee: null as string | null, // e.g., "50% of service cost"
  },

  lateness: {
    graceMinutes: 15, // Need to confirm
    policy: "Appointments more than 15 minutes late may need to be rescheduled.",
  },

  deposits: {
    required: null as boolean | null,
    amount: null as string | null,
  },

  // Additional policies - need from client
  additionalPolicies: [] as string[],
} as const;

// =============================================================================
// NAVIGATION
// =============================================================================

export const navigation = {
  main: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/beauty-concierge", label: "Beauty Concierge" },
    { href: "/contact", label: "Contact" },
  ],

  footer: [
    { href: "/policies", label: "Policies" },
    { href: "/book", label: "Book Now" },
  ],
} as const;

// =============================================================================
// EXPORT ALL
// =============================================================================

export const config = {
  brand,
  contact,
  hours,
  social,
  booking,
  reviews,
  services,
  gallery,
  seo,
  theme,
  policies,
  navigation,
} as const;

export default config;
