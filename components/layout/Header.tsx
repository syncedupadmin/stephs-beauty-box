'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brand, navigation, contact, booking } from '@/lib/config/brand';
import { MobileNav } from './MobileNav';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-bg/95 backdrop-blur-md shadow-lg border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[72px] md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 min-w-0 group"
            aria-label={`${brand.name} - Home`}
          >
            <Image
              src={brand.logo.main}
              alt={brand.name}
              width={120}
              height={120}
              className="h-14 w-auto md:h-16 object-contain rounded-full border-2 border-gold/30 group-hover:border-gold/60 transition-colors duration-300"
              priority
            />
            <div className="hidden sm:block">
              <span className="text-lg md:text-xl font-serif text-gold">{brand.name}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navigation.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-ivory/80 hover:text-gold transition-colors duration-200 text-sm tracking-wide uppercase font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gold to-rose transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Book Now Button - Desktop */}
            <Link
              href={booking.primaryUrl || `/book`}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-bg font-medium rounded-full hover:bg-gold-soft hover:shadow-gold transition-all duration-300 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              Book Now
            </Link>

            {/* Call Button - Desktop */}
            <a
              href={`tel:${contact.phoneClean}`}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-gold border border-gold/40 rounded-full hover:bg-gold/10 transition-all duration-300 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              {contact.phoneFormatted}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden p-2 text-ivory/80 hover:text-gold transition-colors duration-200"
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
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
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        links={navigation.main}
      />

      {/* Header spacer */}
      <div className="h-[72px] md:h-20" />
    </>
  );
}
