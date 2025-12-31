import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { brand, seo, contact } from '@/lib/config/brand';

// =============================================================================
// FONTS - Garden Editorial Typography
// =============================================================================

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

// =============================================================================
// VIEWPORT
// =============================================================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F7F1E8',
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
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans bg-ivory text-ink antialiased">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sage focus:text-white focus:rounded-button"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
