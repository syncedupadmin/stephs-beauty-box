/**
 * STEPH'S BEAUTY BOX - Brand Configuration
 * =========================================
 * SINGLE SOURCE OF TRUTH
 * All brand data, contact info, and configuration lives here.
 *
 * RULES:
 * - Only include VERIFIED information
 * - Use "[CLIENT TO CONFIRM]" for missing required info
 * - Use null for optional missing fields
 */

// =============================================================================
// CORE BRAND
// =============================================================================

export const brand = {
  name: "Steph's Beauty Box",
  tagline: "External & Internal Beauty",
  description: "A welcoming space where everyone belongs. We celebrate beauty in all its forms—nurturing both your outer glow and inner radiance.",

  // Faith-forward messaging (use sparingly)
  faithMessage: "Where beauty meets grace.",

  logo: {
    main: "/brand/1.png",
    alt: null as string | null,
  },
} as const;

// =============================================================================
// CONTACT INFORMATION (VERIFIED)
// =============================================================================

export const contact = {
  // VERIFIED
  phone: "+1 (786) 378-3511",
  phoneFormatted: "(786) 378-3511",
  phoneClean: "7863783511",

  // WhatsApp (generated from verified phone)
  whatsapp: {
    url: "https://wa.me/17863783511",
    display: "(786) 378-3511",
  },

  // UNKNOWN - placeholder
  email: "[CLIENT TO CONFIRM]" as string,

  // VERIFIED
  address: {
    street: "5612 Pembroke Rd",
    unit: "Unit D",
    city: "West Park",
    state: "FL",
    zip: "33023",
    full: "5612 Pembroke Rd Unit D, West Park, FL 33023",
  },

  mapsUrl: "https://www.google.com/maps/search/?api=1&query=5612+Pembroke+Rd+Unit+D+West+Park+FL+33023",
} as const;

// =============================================================================
// BUSINESS HOURS (VERIFIED)
// =============================================================================

export const hours = {
  schedule: [
    { day: "Monday", hours: "Closed", isOpen: false },
    { day: "Tuesday", hours: "Closed", isOpen: false },
    { day: "Wednesday", hours: "11:00 AM – 7:00 PM", isOpen: true },
    { day: "Thursday", hours: "11:00 AM – 7:00 PM", isOpen: true },
    { day: "Friday", hours: "11:00 AM – 7:00 PM", isOpen: true },
    { day: "Saturday", hours: "11:00 AM – 7:00 PM", isOpen: true },
    { day: "Sunday", hours: "11:00 AM – 7:00 PM", isOpen: true },
  ],
  summary: "Wed – Sun: 11am – 7pm",
  closedDays: "Closed Monday & Tuesday",
} as const;

// =============================================================================
// SOCIAL MEDIA (VERIFIED ONLY)
// =============================================================================

export const social = {
  // VERIFIED
  instagram: {
    url: "https://www.instagram.com/stephsbeautybox_/",
    handle: "@stephsbeautybox_",
  },
  threads: {
    url: "https://www.threads.com/@stephsbeautybox_",
    handle: "@stephsbeautybox_",
  },
  youtube: {
    url: "https://www.youtube.com/@stephsbeautybox",
    handle: "@stephsbeautybox",
  },

  // UNKNOWN - do not display
  tiktok: null as { url: string; handle: string } | null,
  snapchat: null as { url: string; handle: string } | null,
  facebook: null as { url: string; handle: string } | null,
} as const;

// =============================================================================
// PAYMENT METHODS (UNKNOWN - do not display)
// =============================================================================

export const payments = {
  cashApp: null as string | null,
  zelle: null as string | null,
  venmo: null as string | null,
} as const;

// =============================================================================
// SERVICES (Generic categories only - no invented details)
// =============================================================================

export const services = {
  categories: [
    {
      id: "hair",
      name: "Hair",
      description: "Styling, treatments, and transformations for all hair types.",
      cta: "Inquire for Details",
    },
    {
      id: "makeup",
      name: "Makeup",
      description: "Looks for every occasion—from soft natural to full glam.",
      cta: "Inquire for Details",
    },
    {
      id: "skin",
      name: "Skin & Facials",
      description: "Treatments to nurture and refresh your natural glow.",
      cta: "Inquire for Details",
    },
    {
      id: "brows-lashes",
      name: "Brows & Lashes",
      description: "Shaping, tinting, extensions, and lifts.",
      cta: "Inquire for Details",
    },
    {
      id: "wigs",
      name: "Wigs",
      description: "Installation, styling, and custom wig services.",
      cta: "Inquire for Details",
    },
  ],

  // Note about pricing
  pricingNote: "Pricing varies by style and consultation. Reach out for a personalized quote.",
} as const;

// =============================================================================
// SHOPIFY CONFIGURATION
// =============================================================================

export const shopify = {
  // Set to true when Shopify credentials are provided
  enabled: false,

  // Placeholder - to be filled with actual credentials
  storeDomain: null as string | null,
  storefrontAccessToken: null as string | null,

  // Demo mode banner text
  demoBannerText: "[SHOPIFY CONNECT REQUIRED] – Demo products shown below",
} as const;

// =============================================================================
// NAVIGATION
// =============================================================================

export const navigation = {
  main: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/shop", label: "Shop" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  cta: {
    label: "Get in Touch",
    href: "/contact",
  },
} as const;

// =============================================================================
// SEO
// =============================================================================

export const seo = {
  title: "Steph's Beauty Box | Hair, Makeup & Beauty | West Park, FL",
  description: "A welcoming beauty space in West Park, FL. Hair, makeup, skin, lashes, and more. Everyone belongs here.",
  keywords: [
    "beauty salon West Park FL",
    "hair stylist West Park",
    "makeup artist South Florida",
    "lash extensions West Park",
    "inclusive beauty salon",
  ],

  openGraph: {
    image: "/brand/og-image.jpg",
    type: "website" as const,
  },
} as const;

// =============================================================================
// THEME (Garden Editorial Palette)
// =============================================================================

export const theme = {
  colors: {
    // Background - warm ivory
    background: "#F7F1E8",

    // Primary text - near-black ink
    ink: "#1A1A1A",

    // Accent - muted botanical green (chosen over clay for freshness)
    accent: "#2F4A3B",

    // Secondary - soft blush
    blush: "#E7D3C7",

    // White for overlays
    white: "#FFFFFF",
  },

  fonts: {
    heading: "Cormorant Garamond",
    body: "Inter",
  },
} as const;

// =============================================================================
// POLICIES (Generic - do not invent specific details)
// =============================================================================

export const policies = {
  cancellation: {
    notice: "24 hours",
    fee: null as string | null, // Unknown - do not display
  },
  lateness: {
    policy: "Please arrive on time. Late arrivals may result in shortened service time or rescheduling.",
  },
  deposits: {
    required: false,
    amount: null as string | null,
  },
} as const;

// =============================================================================
// EXPORT ALL
// =============================================================================

export const config = {
  brand,
  contact,
  hours,
  social,
  payments,
  services,
  shopify,
  navigation,
  seo,
  theme,
  policies,
} as const;

export default config;
