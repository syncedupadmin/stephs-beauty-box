'use client';

import Link from 'next/link';
import { brand, contact, services } from '@/lib/config/brand';
import { homeStorySections, editorialSections } from '@/lib/config/homeStorySections';
import { HERO_IMAGE, ABOUT_IMAGES } from '@/lib/config/images';

/**
 * HOMEPAGE - ROMANTIC HIGH-FASHION EDITORIAL
 * ===========================================
 * Mobile: Scroll-snap story experience (full-screen slides)
 * Desktop: Magazine cover hero + lookbook editorial sections
 *
 * Design References: Gucci Garden, Dolce & Gabbana campaigns
 * Aesthetic: Visually expensive, welcoming, inclusive
 */

export default function HomePage() {
  return (
    <>
      {/* =================================================================
          MOBILE: Scroll-Snap Story Experience
          ================================================================= */}
      <div className="story-container md:hidden">
        {homeStorySections.map((section, index) => (
          <section
            key={section.id}
            className="story-section relative flex items-end"
          >
            {/* Background - Campaign Image */}
            <div className="absolute inset-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${section.imageSrc})` }}
              />
              {/* Story gradient overlay */}
              <div className="story-gradient absolute inset-0" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full p-6 pb-16 safe-area-bottom">
              <div
                className={`max-w-sm ${
                  section.textPosition === 'bottom-center'
                    ? 'mx-auto text-center'
                    : section.textPosition === 'bottom-right'
                    ? 'ml-auto text-right'
                    : 'text-left'
                }`}
              >
                {/* Headline - Display font */}
                <h2 className="font-display text-3xl md:text-4xl text-off-white mb-3 leading-[0.9]">
                  {section.headline}
                </h2>

                {/* Supporting Line */}
                <p className="text-off-white/80 text-body-md mb-6 font-body">
                  {section.supportingLine}
                </p>

                {/* CTA - Editorial pill */}
                <Link href={section.cta.href} className="cta-primary">
                  {section.cta.label}
                </Link>
              </div>

              {/* Scroll indicator - first section only */}
              {index === 0 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
                  <span className="text-overline uppercase tracking-[0.2em] text-off-white/60">
                    Scroll
                  </span>
                  <div className="w-px h-8 bg-off-white/30" />
                </div>
              )}
            </div>

            {/* Brand stamp - subtle */}
            {index === 0 && (
              <div className="brand-stamp top-28 right-6">
                SB
              </div>
            )}
          </section>
        ))}

        {/* Final Story Section - Contact */}
        <section className="story-section bg-paper flex flex-col justify-center px-6">
          <div className="text-center">
            <p className="overline mb-4">West Park, FL</p>
            <h2 className="font-display text-display-md text-ink mb-6">
              Begin Your Journey
            </h2>
            <p className="text-ink/70 text-body-md mb-8 max-w-xs mx-auto font-body">
              {brand.description}
            </p>

            <div className="flex flex-col gap-4 max-w-xs mx-auto">
              <Link href="/contact" className="cta-primary justify-center">
                Start the Journey
              </Link>
              <a
                href={`tel:${contact.phoneClean}`}
                className="cta-secondary justify-center"
              >
                {contact.phoneFormatted}
              </a>
            </div>

            {/* Faith message */}
            <p className="mt-12 font-display italic text-botanical/70 text-lg">
              {brand.faithMessage}
            </p>
          </div>
        </section>
      </div>

      {/* =================================================================
          DESKTOP: Magazine Cover + Editorial Lookbook
          ================================================================= */}
      <div className="hidden md:block">
        {/* Hero - Full Bleed Magazine Cover */}
        <section className="relative h-screen min-h-[600px] flex items-end">
          {/* Background - Campaign Hero Image */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO_IMAGE})` }}
            />
            {/* Magazine cover overlay - darker at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
          </div>

          {/* Cover Content */}
          <div className="relative z-10 container-editorial pb-20 lg:pb-32">
            <div className="max-w-2xl">
              {/* Overline */}
              <p className="overline text-off-white/60 mb-6">West Park, FL</p>

              {/* Display Headline */}
              <h1 className="font-display text-display-hero text-off-white mb-6 leading-[0.9] tracking-tight">
                Beauty for
                <br />
                <span className="font-editorial-italic">Everyone</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-off-white/80 text-body-lg mb-10 max-w-md font-body leading-relaxed">
                {brand.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="cta-primary">
                  Start the Journey
                </Link>
                <Link href="/gallery" className="cta-secondary border-off-white/30 text-off-white hover:bg-off-white/10">
                  View Gallery
                </Link>
              </div>
            </div>
          </div>

          {/* Brand stamp */}
          <div className="brand-stamp bottom-20 right-12 lg:right-20">
            SB
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
            <span className="overline text-off-white/60">Explore</span>
            <div className="w-px h-12 bg-off-white/30" />
          </div>
        </section>

        {/* Editorial Sections - Alternating Layouts */}
        {editorialSections.map((section, index) => (
          <section key={section.id} className="section-editorial">
            <div className="container-editorial">
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  section.imagePosition === 'right' ? '' : ''
                }`}
              >
                {/* Image */}
                <div
                  className={`relative aspect-[4/5] overflow-hidden ${
                    section.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${section.imageSrc})` }}
                  />
                </div>

                {/* Content */}
                <div
                  className={`${
                    section.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {/* Overline */}
                  <p className="overline mb-4">{section.overline}</p>

                  {/* Headline */}
                  <h2 className="font-display text-display-lg text-ink mb-6 leading-[0.9]">
                    {section.headline}
                  </h2>

                  {/* Body */}
                  <p className="text-ink/70 text-body-lg mb-8 font-body leading-relaxed max-w-md">
                    {section.body}
                  </p>

                  {/* Editorial Link */}
                  <Link href={section.cta.href} className="editorial-link text-body-md">
                    {section.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Services Overview - Editorial Grid */}
        <section className="section-editorial bg-off-white/50">
          <div className="container-editorial">
            {/* Section Header */}
            <div className="mb-20">
              <p className="overline mb-4">What We Offer</p>
              <h2 className="font-display text-display-lg text-ink leading-[0.9]">
                Our Services
              </h2>
            </div>

            {/* Service Categories - Minimal List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {services.categories.map((category) => (
                <div key={category.id} className="group">
                  {/* Divider Line */}
                  <div className="divider-hairline mb-6" />

                  {/* Category Name */}
                  <h3 className="font-display text-display-sm text-ink mb-4 leading-tight">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-ink/60 text-body-md font-body leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Editorial Link */}
                  <Link
                    href="/contact"
                    className="editorial-link text-body-sm"
                  >
                    {category.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Preview - Editorial */}
        <section className="section-editorial">
          <div className="container-editorial">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ABOUT_IMAGES.steph})` }}
                />
              </div>

              {/* Content */}
              <div>
                <p className="overline mb-4">About</p>
                <h2 className="font-display text-display-lg text-ink mb-6 leading-[0.9]">
                  External &<br />
                  <span className="font-editorial-italic">Internal</span> Beauty
                </h2>
                <p className="text-ink/70 text-body-lg font-body leading-relaxed mb-6 max-w-md">
                  At {brand.name}, we believe beauty is more than skin deep. Our space is built on
                  welcoming everyone—celebrating all shades, all styles, all stories.
                </p>
                <p className="text-ink/50 text-body-md font-body leading-relaxed mb-8 max-w-md">
                  We create an environment where you feel safe, seen, and celebrated.
                  Whether you&apos;re here for a transformation or a touch-up, you belong here.
                </p>
                <Link href="/about" className="editorial-link text-body-md">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA - Botanical */}
        <section className="section-editorial-sm bg-botanical">
          <div className="container-editorial text-center">
            <h2 className="font-display text-display-md text-off-white mb-6 leading-[0.9]">
              Ready to Begin?
            </h2>
            <p className="text-off-white/70 text-body-lg font-body mb-10 max-w-lg mx-auto">
              Reach out to book your appointment or ask any questions.
              We&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="cta-primary bg-off-white text-botanical hover:bg-off-white/90">
                Get in Touch
              </Link>
              <a
                href={`tel:${contact.phoneClean}`}
                className="cta-secondary border-off-white/30 text-off-white hover:bg-off-white/10"
              >
                {contact.phoneFormatted}
              </a>
            </div>
          </div>
        </section>

        {/* Instagram - Subtle Editorial */}
        <section className="section-editorial-sm">
          <div className="container-editorial text-center">
            <p className="overline mb-6">Follow Along</p>
            <a
              href="https://www.instagram.com/stephsbeautybox_/"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link font-display text-xl text-ink"
            >
              @stephsbeautybox_
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
