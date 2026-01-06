import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { PreviewBanner } from '@/components/generated/PreviewBanner';
import { brand, seo, contact } from '@/lib/config/brand';

// =============================================================================
// PREVIEW MODE CONFIG - Steph's Beauty Box Project ID
// =============================================================================
const PROJECT_ID = 'proj_mju927zf_i0kx5n';

// =============================================================================
// FONTS - ROMANTIC HIGH-FASHION EDITORIAL
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

// =============================================================================
// VIEWPORT
// =============================================================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F6F0E6',
};

// =============================================================================
// METADATA
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: seo.title,
    template: `%s | ${brand.name}`,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: brand.name }],
  creator: brand.name,
  metadataBase: new URL('https://stephs-beauty-box.vercel.app'),

  icons: {
    icon: [{ url: '/brand/1.png', type: 'image/png' }],
    apple: [{ url: '/brand/1.png', type: 'image/png' }],
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: brand.name,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.openGraph.image,
        width: 1200,
        height: 630,
        alt: brand.name,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: brand.name,
    description: seo.description,
    images: [seo.openGraph.image],
  },

  robots: {
    index: true,
    follow: true,
  },

  other: {
    'geo.region': 'US-FL',
    'geo.placename': contact.address.city,
  },
};

// =============================================================================
// ROOT LAYOUT
// =============================================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-body bg-paper text-ink antialiased">
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />

        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-botanical focus:text-paper"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content">
          {children}
        </main>

        <Footer />

        {/* Cart Drawer - Slide-out cart panel */}
        <CartDrawer />

        {/* Preview Mode Banner - Shows when invoice mode is enabled and site is unpaid */}
        <PreviewBanner projectId={PROJECT_ID} />
      </body>
    </html>
  );
}
