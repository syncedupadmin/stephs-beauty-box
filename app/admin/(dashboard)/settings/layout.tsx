'use client';

/**
 * Settings Layout
 * ===============
 * Settings navigation tabs
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Shop', href: '/admin/settings/shop' },
  { name: 'Booking', href: '/admin/settings/booking' },
  { name: 'Availability', href: '/admin/settings/availability' },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-ink/10">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 text-body-sm font-body transition-colors duration-600 border-b-2 -mb-px ${
                isActive
                  ? 'border-botanical text-botanical'
                  : 'border-transparent text-ink/60 hover:text-ink'
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
