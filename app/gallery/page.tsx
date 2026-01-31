'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { social } from '@/lib/config/brand';
import { GALLERY_IMAGES } from '@/lib/config/images';

/**
 * GALLERY PAGE - SIMPLE EDITORIAL GRID
 * =====================================
 * All images displayed in a beautiful masonry grid
 * - No categories, just pure visual showcase
 * - Lightbox for full-size viewing
 */

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % GALLERY_IMAGES.length
      : (lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    setLightboxIndex(newIndex);
  };

  return (
    <>
      {/* Hero Section - Editorial */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Our Work</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
              Gallery
            </h1>
            <p className="text-ink/70 text-body-lg font-body leading-relaxed max-w-md">
              A glimpse into the transformations and beautiful moments we create every day.
            </p>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="container-editorial">
        <div className="divider-hairline" />
      </div>

      {/* Gallery Grid - Editorial */}
      <section className="py-16 md:py-24">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {GALLERY_IMAGES.map((image, index) => (
              <button
                key={index}
                onClick={() => openLightbox(index)}
                className={`group relative overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-botanical ${
                  index % 7 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-600 ease-luxury group-hover:scale-[1.03]"
                    sizes={index % 7 === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-600" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA - Editorial */}
      <section className="section-editorial-sm">
        <div className="container-editorial text-center">
          <p className="overline mb-6">See More</p>
          <h2 className="font-display text-display-md text-ink mb-6 leading-[0.9]">
            Follow Our Journey
          </h2>
          <p className="text-ink/60 text-body-md font-body mb-8 max-w-md mx-auto">
            For the latest work, behind-the-scenes, and inspiration.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {social.instagram && (
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link text-body-md"
              >
                Instagram
              </a>
            )}

            {social.threads && (
              <a
                href={social.threads.url}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link text-body-md"
              >
                Threads
              </a>
            )}

            {social.youtube && (
              <a
                href={social.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link text-body-md"
              >
                YouTube
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-editorial-sm bg-botanical">
        <div className="container-editorial text-center">
          <h3 className="font-display text-display-sm text-off-white mb-4">
            Ready for Your Transformation?
          </h3>
          <p className="text-off-white/60 text-body-md font-body mb-8">
            Let us create something beautiful together.
          </p>
          <Link
            href="/book"
            className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Lightbox - Editorial Style */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 text-overline uppercase tracking-[0.15em] text-off-white/60 hover:text-off-white transition-colors duration-600"
            aria-label="Close lightbox"
          >
            Close
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-overline uppercase tracking-[0.15em] text-off-white/60 hover:text-off-white transition-colors duration-600"
            aria-label="Previous image"
          >
            Prev
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-overline uppercase tracking-[0.15em] text-off-white/60 hover:text-off-white transition-colors duration-600"
            aria-label="Next image"
          >
            Next
          </button>

          {/* Image container */}
          <div
            className="relative max-w-4xl w-full mx-6 aspect-[4/5]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <span className="text-off-white/60 text-body-sm font-body">
              {lightboxIndex + 1} / {GALLERY_IMAGES.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
