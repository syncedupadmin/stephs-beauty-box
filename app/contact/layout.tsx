import type { Metadata } from 'next';
import { brand, contact, hours } from '@/lib/config/brand';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${brand.name}. Located at ${contact.address.full}. Open ${hours.summary}.`,
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
