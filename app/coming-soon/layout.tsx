import type { Metadata } from 'next';
import { brand, seo } from '@/lib/config/brand';

export const metadata: Metadata = {
  title: `Coming Soon | ${brand.name}`,
  description: 'Something beautiful is coming. Stay tuned for the launch of our luxury beauty experience.',
  openGraph: {
    title: `Coming Soon | ${brand.name}`,
    description: 'Something beautiful is coming. Stay tuned for the launch of our luxury beauty experience.',
    images: [seo.openGraph.image],
  },
};

/**
 * Coming Soon Layout
 * No header, no footer - just the immersive coming soon experience
 */
export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
