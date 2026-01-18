'use client';

import Image from 'next/image';
import { brand, contact } from '@/lib/config/brand';
import { HERO_IMAGE } from '@/lib/config/images';

/**
 * COMING SOON PAGE - ROMANTIC HIGH-FASHION EDITORIAL
 * ===================================================
 * Temporary landing page with same luxury aesthetic
 * Preserves brand identity while site is in preparation
 */

export default function ComingSoonPage() {
  return (
    <>
      {/* =================================================================
          MOBILE: Full-Screen Story Experience
          ================================================================= */}
      <div className="md:hidden min-h-screen relative flex items-center justify-center">
        {/* Background - Campaign Image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt={`${brand.name} - Coming Soon`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Elegant overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 py-20 text-center">
          {/* Brand Mark */}
          <div className="mb-8">
            <span className="inline-block font-display text-5xl text-off-white/20 tracking-tight">
              SB
            </span>
          </div>

          {/* Overline */}
          <p className="overline text-off-white/50 mb-6 tracking-[0.3em]">
            Something Beautiful is Coming
          </p>

          {/* Display Headline */}
          <h1 className="font-display text-4xl sm:text-5xl text-off-white mb-4 leading-[0.9] tracking-tight">
            Coming
            <br />
            <span className="font-editorial-italic">Soon</span>
          </h1>

          {/* Brand Name */}
          <p className="font-display text-xl text-off-white/80 mb-8">
            {brand.name}
          </p>

          {/* Supporting Copy */}
          <p className="text-off-white/60 text-body-md mb-12 max-w-xs mx-auto font-body leading-relaxed">
            We&apos;re putting the finishing touches on something special.
            Beauty for everyone, arriving soon.
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-off-white/20 mx-auto mb-12" />

          {/* Contact Info */}
          <div className="space-y-4">
            <a
              href={`tel:${contact.phoneClean}`}
              className="block text-off-white font-display text-lg hover:text-botanical transition-colors duration-600"
            >
              {contact.phoneFormatted}
            </a>
            <p className="text-off-white/40 text-body-sm font-body">
              West Park, FL
            </p>
          </div>

          {/* Social */}
          <div className="mt-12">
            <p className="overline text-off-white/30 mb-4 text-xs">Follow the Journey</p>
            <a
              href="https://www.instagram.com/stephsbeautybox_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-off-white/70 hover:text-off-white transition-colors duration-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="font-body text-body-sm">@stephsbeautybox_</span>
            </a>
          </div>

          {/* Faith message */}
          <p className="mt-16 font-display italic text-off-white/30 text-sm">
            {brand.faithMessage}
          </p>
        </div>
      </div>

      {/* =================================================================
          DESKTOP: Magazine Cover Coming Soon
          ================================================================= */}
      <div className="hidden md:flex min-h-screen relative items-center">
        {/* Background - Campaign Hero Image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt={`${brand.name} - Coming Soon`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Magazine cover overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-editorial py-20">
          <div className="max-w-xl">
            {/* Brand Mark - Subtle */}
            <div className="mb-12">
              <span className="inline-block font-display text-7xl text-off-white/10 tracking-tight">
                SB
              </span>
            </div>

            {/* Overline */}
            <p className="overline text-off-white/50 mb-8 tracking-[0.3em]">
              Something Beautiful is Coming
            </p>

            {/* Display Headline */}
            <h1 className="font-display text-display-hero text-off-white mb-6 leading-[0.85] tracking-tight">
              Coming
              <br />
              <span className="font-editorial-italic">Soon</span>
            </h1>

            {/* Brand Name */}
            <p className="font-display text-2xl text-off-white/80 mb-8">
              {brand.name}
            </p>

            {/* Supporting Copy */}
            <p className="text-off-white/60 text-body-lg mb-12 max-w-md font-body leading-relaxed">
              We&apos;re putting the finishing touches on something special.
              A sanctuary where beauty meets belonging. For everyone.
            </p>

            {/* Elegant Divider */}
            <div className="w-24 h-px bg-off-white/20 mb-12" />

            {/* Contact & Social */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-8">
              {/* Phone */}
              <a
                href={`tel:${contact.phoneClean}`}
                className="text-off-white font-display text-xl hover:text-botanical transition-colors duration-600"
              >
                {contact.phoneFormatted}
              </a>

              {/* Divider */}
              <span className="hidden sm:block w-px h-6 bg-off-white/20" />

              {/* Instagram */}
              <a
                href="https://www.instagram.com/stephsbeautybox_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-off-white/70 hover:text-off-white transition-colors duration-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-body text-body-md">@stephsbeautybox_</span>
              </a>
            </div>

            {/* Location */}
            <p className="mt-8 text-off-white/30 text-body-sm font-body">
              West Park, FL
            </p>

            {/* Faith message */}
            <p className="mt-16 font-display italic text-off-white/20 text-lg max-w-sm">
              {brand.faithMessage}
            </p>
          </div>
        </div>

        {/* Brand stamp - corner accent */}
        <div className="absolute bottom-20 right-12 lg:right-20">
          <span className="font-display text-8xl text-off-white/5 tracking-tight leading-none">
            SB
          </span>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-off-white/10 to-transparent" />
      </div>
    </>
  );
}
