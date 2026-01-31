'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { brand, navigation } from '@/lib/config/brand';
import { CartButton } from '@/components/shop/CartDrawer';

/**
 * HEADER - TRANSPARENT EDITORIAL MASTHEAD
 * =========================================
 * Design: Transparent overlay so hero image reaches top edge
 * - Minimal text links (no icons)
 * - Centered brand name
 * - Luxury pace transitions
 * - NO header spacer (content flows beneath)
 * - Hidden on admin pages
 */

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdminPage) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminPage]);

  // Close mobile nav on escape
  useEffect(() => {
    if (isAdminPage) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    if (mobileNavOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [mobileNavOpen, isAdminPage]);

  // Don't render on admin pages
  if (isAdminPage) {
    return null;
  }

  // Minimal nav - only essential links
  const minimalNav = [
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600 ease-luxury ${
          isScrolled
            ? 'bg-paper/95 backdrop-blur-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container-editorial">
          <div className="flex h-20 md:h-24 items-center justify-between">
            {/* Left Nav - Desktop */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
              {minimalNav.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-overline uppercase tracking-[0.15em] transition-opacity duration-600 ease-luxury hover:opacity-60 ${
                    isScrolled ? 'text-ink' : 'text-paper'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Centered Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2"
              aria-label={`${brand.name} - Home`}
            >
              <Image
                src="/images/logo.png"
                alt={brand.name}
                width={120}
                height={48}
                className={`h-10 md:h-12 w-auto transition-all duration-600 ease-luxury ${
                  isScrolled ? '' : 'brightness-0 invert'
                }`}
                priority
              />
            </Link>

            {/* Right Nav - Desktop */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Secondary navigation">
              <Link
                href="/about"
                className={`text-overline uppercase tracking-[0.15em] transition-opacity duration-600 ease-luxury hover:opacity-60 ${
                  isScrolled ? 'text-ink' : 'text-paper'
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`text-overline uppercase tracking-[0.15em] transition-opacity duration-600 ease-luxury hover:opacity-60 ${
                  isScrolled ? 'text-ink' : 'text-paper'
                }`}
              >
                Inquire
              </Link>
              <CartButton
                className={`transition-colors duration-600 ease-luxury ${
                  isScrolled ? 'text-ink' : 'text-paper'
                }`}
              />
            </nav>

            {/* Mobile: Left spacer for balance */}
            <div className="w-20 md:hidden" />

            {/* Mobile Menu Toggle + Cart */}
            <div className="md:hidden flex items-center gap-4">
              <CartButton
                className={`transition-colors duration-600 ease-luxury ${
                  isScrolled ? 'text-ink' : 'text-paper'
                }`}
              />
              <button
                onClick={() => setMobileNavOpen(true)}
                className={`p-2 transition-colors duration-600 ${
                  isScrolled ? 'text-ink' : 'text-paper'
                }`}
                aria-label="Open menu"
              >
                {/* Hamburger Icon */}
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Panel - Full screen editorial */}
          <div className="fixed inset-0 z-50 bg-paper md:hidden">
            <div className="flex flex-col h-full">
              {/* Close */}
              <div className="flex items-center justify-between p-6">
                <Image
                  src="/images/logo.png"
                  alt={brand.name}
                  width={100}
                  height={40}
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="text-overline uppercase tracking-[0.15em] text-ink/60 hover:text-ink transition-colors duration-600"
                  aria-label="Close navigation"
                >
                  Close
                </button>
              </div>

              {/* Divider */}
              <div className="divider-hairline mx-6" />

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col justify-center px-6">
                <ul className="space-y-6">
                  {navigation.main.map((link, index) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileNavOpen(false)}
                        className="block font-display text-display-sm text-ink hover:text-botanical transition-colors duration-600"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer CTA */}
              <div className="p-6 safe-area-bottom">
                <div className="divider-hairline mb-6" />
                <Link
                  href="/services"
                  onClick={() => setMobileNavOpen(false)}
                  className="cta-primary w-full justify-center"
                >
                  Start the Journey
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* NO header spacer - content flows beneath transparent header */}
    </>
  );
}
