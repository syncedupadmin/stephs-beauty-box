'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { social } from '@/lib/config/brand';
import { getImage } from '@/lib/config/images';

/**
 * GALLERY PAGE - EDITORIAL LOOKBOOK
 * ==================================
 * Design: Masonry/editorial grid with real campaign images
 * - No icons, no cards
 * - Editorial category filters
 * - Lightbox with luxury transitions
 * - 24 tiles with automatic looping
 */

// Gallery categories
const categories = ['All', 'Hair', 'Makeup', 'Lashes', 'Skin'];

// Category rotation for balanced distribution
const categoryOrder = ['Hair', 'Makeup', 'Lashes', 'Skin'] as const;
const altTexts: Record<string, string[]> = {
  Hair: ['Hair transformation', 'Color work', 'Styling', 'Braids', 'Blowout', 'Extensions'],
  Makeup: ['Glam look', 'Bridal makeup', 'Editorial look', 'Soft glam', 'Special occasion', 'Natural beauty'],
  Lashes: ['Lash extensions', 'Volume set', 'Classic lashes', 'Natural lash look', 'Hybrid set', 'Wispy lashes'],
  Skin: ['Radiant skin', 'Facial treatment', 'Glow treatment', 'Skincare results', 'Clear skin', 'Hydrated glow'],
};

// Prioritize darker model images first (7, 8, 12, 15, 17), then fill with others
const priorityOrder = [7, 8, 12, 15, 17, 1, 2, 3, 4, 5, 6, 9, 10, 11, 13, 14, 16];

// Generate 24 gallery items with prioritized ordering
const galleryItems = Array.from({ length: 24 }, (_, i) => {
  const category = categoryOrder[i % 4];
  const categoryIndex = Math.floor(i / 4);
  const altText = altTexts[category][categoryIndex % altTexts[category].length];
  const imageIndex = priorityOrder[i % priorityOrder.length];
  return {
    id: i + 1,
    category,
    alt: altText,
    image: getImage(imageIndex), // Prioritized darker models first
  };
});

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item: typeof galleryItems[0]) => {
    setLightboxImage(item);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightboxImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === lightboxImage.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredItems.length
      : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxImage(filteredItems[newIndex]);
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

      {/* Category Filter - Editorial Links */}
      <section className="py-6 sticky top-20 md:top-24 z-30 bg-paper/95 backdrop-blur-sm">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-6 md:gap-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-body-sm font-body transition-all duration-600 ${
                  activeCategory === category
                    ? 'text-ink'
                    : 'text-ink/40 hover:text-ink/70'
                }`}
              >
                {category}
                {activeCategory === category && (
                  <span className="block h-px w-full bg-ink mt-1" />
                )}
              </button>
            ))}
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
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(item)}
                className={`group relative overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-botanical ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-600 ease-luxury group-hover:scale-[1.03]"
                    sizes={index % 5 === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-600 flex items-end p-4">
                  <span className="text-off-white/0 group-hover:text-off-white/90 text-body-sm font-body transition-colors duration-600">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-ink/50 font-body">No images in this category yet.</p>
            </div>
          )}
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
            href="/contact"
            className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Lightbox - Editorial Style */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button - Text only */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-10 text-overline uppercase tracking-[0.15em] text-off-white/60 hover:text-off-white transition-colors duration-600"
            aria-label="Close lightbox"
          >
            Close
          </button>

          {/* Navigation - Text */}
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
              src={lightboxImage.image}
              alt={lightboxImage.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <span className="text-off-white/60 text-body-sm font-body">
              {lightboxImage.alt}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
