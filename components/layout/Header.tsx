'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brand, navigation, contact, booking } from '@/lib/config/brand';
import { MobileNav } from './MobileNav';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-bg/95 backdrop-blur-sm border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container-luxury">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-4"
              aria-label={`${brand.name} - Home`}
            >
              <Image
                src={brand.logo.main}
                alt={brand.name}
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
                priority
              />
              <span className="hidden sm:block font-serif text-gold text-lg">
                {brand.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navigation.main.slice(0, 5).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-light/70 hover:text-gold transition-colors duration-300 text-sm uppercase tracking-widest"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Book Now - Desktop */}
              <Link
                href={booking.primaryUrl || '/book'}
                className="hidden md:block btn-primary text-sm py-3 px-6"
              >
                Book Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden p-2 text-gold"
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={navigation.main}
      />

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}
