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
    main: "/brand/1.png",
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
  email: "info.stephsbeautybox@gmail.com",

  // VERIFIED
  address: {
    street: "5612 Pembroke Rd",
    unit: "Bay D",
    city: "West Park",
    state: "FL",
    zip: "33023",
    full: "5612 Pembroke Rd, Bay D, West Park, FL 33023",
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
    url: "https://www.instagram.com/stephsbeautybox_",
    handle: "@stephsbeautybox_",
  },
  threads: {
    url: "https://www.threads.net/@stephsbeautybox_",
    handle: "@stephsbeautybox_",
  },
  youtube: {
    url: "https://youtube.com/@stephsbeautybox_",
    handle: "@stephsbeautybox_",
  },

  // VERIFIED from Popl
  tiktok: {
    url: "https://www.tiktok.com/@stephsbeautybox",
    handle: "@stephsbeautybox",
  },
  snapchat: {
    url: "https://www.snapchat.com/add/Stephsbeautybox",
    handle: "Stephsbeautybox",
  },
  whatsapp: {
    url: "https://wa.me/17863783511",
    phone: "(786) 378-3511",
  },
  // UNKNOWN - need from client
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

  // VERIFIED from Popl
  cashApp: "$Stephsbeautybox",
  zelle: "(786) 378-3511",
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

// Service categories - VERIFIED from Popl card
export const services = {
  categories: [
    {
      id: "hair",
      name: "Hair Services",
      description: "Styling, braids, locs, and transformations",
      icon: "scissors",
      services: [
        { name: "Braids", price: null as number | null, duration: null as string | null },
        { name: "Dread Locs", price: null as number | null, duration: null as string | null },
        { name: "Wig Install", price: null as number | null, duration: null as string | null },
        { name: "Hair Coloring", price: null as number | null, duration: null as string | null },
        { name: "Highlights", price: null as number | null, duration: null as string | null },
        { name: "Balayage", price: null as number | null, duration: null as string | null },
        { name: "Scalp Treatment", price: null as number | null, duration: null as string | null },
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
      ],
    },
    {
      id: "skincare",
      name: "Skincare & Waxing",
      description: "Facials and full body waxing",
      icon: "sparkle",
      services: [
        { name: "Facials", price: null as number | null, duration: null as string | null },
        { name: "Full Body Wax", price: null as number | null, duration: null as string | null },
      ],
    },
    {
      id: "brows",
      name: "Brow Services",
      description: "Perfect brows for every face",
      icon: "eyebrow",
      services: [
        { name: "Brow Lamination", price: null as number | null, duration: null as string | null },
        { name: "Brow Wax & Shape", price: null as number | null, duration: null as string | null },
        { name: "Brow Tint", price: null as number | null, duration: null as string | null },
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
  // LOCKED COLOR SYSTEM - NO DEVIATIONS
  colors: {
    // Primary background - ultra-deep charcoal
    bg: "#111010",

    // Primary accent - rich metallic gold
    gold: "#D4AF37",

    // Secondary accent - soft warm blush
    blush: "#EADBC8",

    // Text colors
    light: "#FFFFFF",
    dark: "#2B2B2B",
  },

  // LOCKED TYPOGRAPHY SYSTEM
  fonts: {
    heading: "Playfair Display", // SemiBold for headlines
    body: "Montserrat", // Regular for body text
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
    { href: "/client-info", label: "*Needed Info*" },
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
