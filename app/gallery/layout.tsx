import type { Metadata } from 'next';
import { brand } from '@/lib/config/brand';

export const metadata: Metadata = {
  title: 'Gallery',
  description: `View our portfolio of hair, makeup, lashes, and skin transformations at ${brand.name}.`,
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
