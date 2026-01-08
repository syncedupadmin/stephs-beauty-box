'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brand, contact, hours, social, navigation } from '@/lib/config/brand';

/**
 * FOOTER - EDITORIAL MINIMAL
 * ===========================
 * Design: Clean, text-only, no icons
 * - Editorial links
 * - Vast negative space
 * - Hairline dividers
 * - Hidden on admin pages
 */

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Don't render on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-paper border-t border-ink/10">
      {/* Main Footer */}
      <div className="container-editorial py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-xl text-ink mb-4">{brand.name}</h3>
            <p className="text-ink/50 text-body-sm font-body leading-relaxed mb-4">
              {brand.description}
            </p>
            <p className="font-display italic text-botanical/70 text-sm">
              {brand.faithMessage}
            </p>

            {/* Social - Text Links Only */}
            <div className="flex gap-6 mt-8">
              {social.instagram && (
                <a
                  href={social.instagram.url}
                  className="editorial-link text-body-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
              {social.threads && (
                <a
                  href={social.threads.url}
                  className="editorial-link text-body-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Threads
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube.url}
                  className="editorial-link text-body-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="overline mb-6">Navigation</p>
            <ul className="space-y-3">
              {navigation.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink/50 text-body-sm font-body hover:text-botanical transition-colors duration-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="overline mb-6">Hours</p>
            <ul className="space-y-2">
              {hours.schedule.map((day) => (
                <li key={day.day} className="flex justify-between text-body-sm font-body">
                  <span className={day.isOpen ? 'text-ink/70' : 'text-ink/30'}>
                    {day.day}
                  </span>
                  <span className={day.isOpen ? 'text-botanical' : 'text-ink/30'}>
                    {day.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="overline mb-6">Contact</p>
            <address className="not-italic text-body-sm font-body text-ink/50 space-y-4">
              <p>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-botanical transition-colors duration-600"
                >
                  {contact.address.street}<br />
                  {contact.address.unit}<br />
                  {contact.address.city}, {contact.address.state} {contact.address.zip}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${contact.phoneClean}`}
                  className="text-botanical hover:opacity-70 transition-opacity duration-600"
                >
                  {contact.phoneFormatted}
                </a>
              </p>
              <p>
                <a
                  href={contact.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-botanical transition-colors duration-600"
                >
                  WhatsApp
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ink/5">
        <div className="container-editorial py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-ink/30 text-xs font-body">
              &copy; {currentYear} {brand.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-ink/30 text-xs font-body hover:text-ink/60 transition-colors duration-600"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-ink/30 text-xs font-body hover:text-ink/60 transition-colors duration-600"
              >
                Terms
              </Link>
              <span className="text-ink/20 text-xs font-body">
                Website by{' '}
                <a
                  href="https://syncedup.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-botanical transition-colors duration-600"
                >
                  SyncedUp
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
