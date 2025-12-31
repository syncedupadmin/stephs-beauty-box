import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';
import { brand, seo, contact } from '@/lib/config/brand';

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

// SEO Metadata - pulled from brand config
export const metadata: Metadata = {
  title: {
    default: seo.title,
    template: `%s | ${brand.name}`,
  },
  description: seo.description,
  keywords: [...seo.keywords],
  authors: [{ name: brand.name }],
  creator: brand.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: brand.name,
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: seo.ogImage,
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
    images: [seo.ogImage],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-bg focus:rounded-lg"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="min-h-screen">
          {children}
        </main>

        <Footer />

        {/* Mobile sticky bar - Book/Call CTAs */}
        <MobileStickyBar />

        {/* Spacer for mobile sticky bar */}
        <div className="h-20 md:hidden" aria-hidden="true" />
      </body>
    </html>
  );
}
