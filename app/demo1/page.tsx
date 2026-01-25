'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * DEMO1 - Hero Section Preview
 * =============================
 * Clean hero section demo with Editorial Warm filter applied.
 * This is the recommended look for production.
 */

// Demo images
const heroOptions = [
  { id: 1, src: '/images/demo/photo-01.jpg', label: 'Photo 1' },
  { id: 2, src: '/images/demo/photo-02.jpg', label: 'Photo 2' },
  { id: 3, src: '/images/demo/photo-03.jpg', label: 'Photo 3' },
  { id: 4, src: '/images/demo/photo-04.jpg', label: 'Photo 4' },
  { id: 5, src: '/images/demo/photo-05.jpg', label: 'Photo 5' },
  { id: 6, src: '/images/demo/photo-06.jpg', label: 'Photo 6' },
  { id: 7, src: '/images/demo/photo-07.jpg', label: 'Photo 7' },
  { id: 8, src: '/images/demo/photo-08.jpg', label: 'Photo 8' },
  { id: 9, src: '/images/demo/photo-09.jpg', label: 'Photo 9' },
  { id: 10, src: '/images/demo/photo-10.jpg', label: 'Photo 10' },
  { id: 11, src: '/images/demo/photo-11.jpg', label: 'Photo 11' },
  { id: 12, src: '/images/demo/photo-12.jpg', label: 'Photo 12' },
  { id: 13, src: '/images/demo/photo-13.jpg', label: 'Photo 13' },
  { id: 14, src: '/images/demo/photo-14.jpg', label: 'Photo 14' },
  { id: 15, src: '/images/demo/photo-15.jpg', label: 'Photo 15' },
  { id: 16, src: '/images/demo/photo-16.jpg', label: 'Photo 16' },
  { id: 17, src: '/images/demo/photo-17.jpg', label: 'Photo 17' },
];

// Editorial Warm filter - RECOMMENDED
const EDITORIAL_FILTER = 'brightness(1.02) contrast(1.05) saturate(0.9) sepia(0.08)';

export default function Demo1Page() {
  const [selectedHero, setSelectedHero] = useState(heroOptions[0]);

  return (
    <div className="min-h-screen bg-paper">
      {/* ============================================================
          HERO SECTION - Full Screen Magazine Cover Style
          ============================================================ */}
      <section className="relative h-screen min-h-[700px] flex items-end">
        {/* Background Image with Editorial Warm Filter */}
        <div className="absolute inset-0">
          <Image
            src={selectedHero.src}
            alt="Steph's Beauty Box - Beauty for Everyone"
            fill
            className="object-cover object-top"
            style={{ filter: EDITORIAL_FILTER }}
            priority
            sizes="100vw"
          />
          {/* Magazine cover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-charcoal/10" />
        </div>

        {/* Hero Content */}
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
              A welcoming space where all shades, all styles, and all stories are celebrated.
              Your beauty journey starts here.
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

        {/* Brand Stamp */}
        <div className="absolute bottom-20 right-8 lg:right-20 z-10">
          <span className="font-display text-6xl lg:text-8xl text-off-white/10 tracking-tighter">
            SB
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50 z-10">
          <span className="overline text-off-white/60">Explore</span>
          <div className="w-px h-12 bg-off-white/30" />
        </div>
      </section>

      {/* ============================================================
          IMAGE SELECTOR - Choose Hero Image
          ============================================================ */}
      <section className="py-12 bg-off-white/50">
        <div className="container-editorial">
          <h2 className="font-display text-display-sm text-ink mb-6">Select Hero Image</h2>
          <p className="text-ink/60 text-body-md font-body mb-8">
            Click any image to preview it as the hero. Filter: <strong>Editorial Warm</strong> (recommended)
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {heroOptions.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedHero(img)}
                className={`relative aspect-[3/4] overflow-hidden transition-all duration-300 ${
                  selectedHero.id === img.id
                    ? 'ring-2 ring-botanical ring-offset-2 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-102'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  className="object-cover"
                  style={{ filter: EDITORIAL_FILTER }}
                  sizes="100px"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-charcoal/70 py-1 px-2">
                  <span className="text-off-white text-xs">{img.id}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          EDITORIAL SECTIONS PREVIEW
          ============================================================ */}
      <section className="section-editorial">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/demo/photo-03.jpg"
                alt="Hair styling showcase"
                fill
                className="object-cover"
                style={{ filter: EDITORIAL_FILTER }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div>
              <p className="overline mb-4">Hair</p>
              <h2 className="font-display text-display-lg text-ink mb-6 leading-[0.9]">
                Your Crown,
                <br />
                <span className="font-editorial-italic">Reimagined</span>
              </h2>
              <p className="text-ink/70 text-body-lg mb-8 font-body leading-relaxed max-w-md">
                From transformative color to precision cuts, we work with every texture and style.
                Your hair tells a story—let us help you write the next chapter.
              </p>
              <Link href="/contact" className="editorial-link text-body-md">
                Inquire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Second Editorial Section - Image Right */}
      <section className="section-editorial bg-off-white/30">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="lg:order-1">
              <p className="overline mb-4">Makeup</p>
              <h2 className="font-display text-display-lg text-ink mb-6 leading-[0.9]">
                The Art
                <br />
                <span className="font-editorial-italic">of You</span>
              </h2>
              <p className="text-ink/70 text-body-lg mb-8 font-body leading-relaxed max-w-md">
                Whether soft and natural or bold and dramatic, our makeup artistry enhances
                your unique beauty. Every face is a canvas waiting for its moment.
              </p>
              <Link href="/gallery" className="editorial-link text-body-md">
                View Gallery
              </Link>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden lg:order-2">
              <Image
                src="/images/demo/photo-07.jpg"
                alt="Makeup artistry showcase"
                fill
                className="object-cover"
                style={{ filter: EDITORIAL_FILTER }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          GALLERY GRID PREVIEW
          ============================================================ */}
      <section className="section-editorial">
        <div className="container-editorial">
          <div className="mb-12">
            <p className="overline mb-4">Our Work</p>
            <h2 className="font-display text-display-lg text-ink leading-[0.9]">
              Gallery Preview
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {heroOptions.slice(0, 9).map((img, index) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    className="object-cover transition-transform duration-600 ease-luxury group-hover:scale-[1.03]"
                    style={{ filter: EDITORIAL_FILTER }}
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  />
                </div>
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA SECTION
          ============================================================ */}
      <section className="section-editorial bg-botanical">
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
              href="tel:+17863783511"
              className="cta-secondary border-off-white/30 text-off-white hover:bg-off-white/10"
            >
              (786) 378-3511
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          FILTER INFO
          ============================================================ */}
      <section className="py-12 bg-charcoal">
        <div className="container-editorial">
          <p className="text-off-white/60 text-body-sm font-body">
            <strong className="text-off-white">Filter Applied:</strong> Editorial Warm —
            <code className="ml-2 text-off-white/80 bg-off-white/10 px-2 py-1 text-xs">
              {EDITORIAL_FILTER}
            </code>
          </p>
        </div>
      </section>
    </div>
  );
}
