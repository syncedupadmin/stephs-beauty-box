'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brand, social } from '@/lib/config/brand';

// Gallery categories
const categories = ['All', 'Hair', 'Makeup', 'Lashes', 'Skin'];

// Demo gallery items (placeholder until real images are provided)
const galleryItems = [
  { id: 1, category: 'Hair', alt: 'Hair styling work', image: null },
  { id: 2, category: 'Makeup', alt: 'Makeup artistry', image: null },
  { id: 3, category: 'Lashes', alt: 'Lash extensions', image: null },
  { id: 4, category: 'Hair', alt: 'Hair transformation', image: null },
  { id: 5, category: 'Skin', alt: 'Skincare results', image: null },
  { id: 6, category: 'Makeup', alt: 'Bridal makeup', image: null },
  { id: 7, category: 'Lashes', alt: 'Natural lash look', image: null },
  { id: 8, category: 'Hair', alt: 'Color transformation', image: null },
  { id: 9, category: 'Makeup', alt: 'Glam look', image: null },
];

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
      {/* Hero Section */}
      <section className="section-padding-sm bg-ivory">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">Our Work</p>
            <h1 className="headline-display text-ink mb-6">
              Gallery
            </h1>
            <p className="body-large text-ink/70 max-w-xl mx-auto">
              A glimpse into the transformations and beautiful moments we create every day.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-ink/10 sticky top-16 md:top-20 z-30">
        <div className="container-editorial">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  activeCategory === category
                    ? 'bg-sage text-white'
                    : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => openLightbox(item)}
                className="aspect-square relative overflow-hidden rounded-subtle group focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-blush/40 flex items-center justify-center">
                    <div className="text-center p-4">
                      <svg
                        className="w-8 h-8 mx-auto text-ink/20 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      <span className="text-ink/30 text-xs">{item.category}</span>
                    </div>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                    />
                  </svg>
                </div>

                {/* Category tag */}
                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-ink text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.category}
                </span>
              </button>
            ))}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-ink/60">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="section-padding-sm bg-sage/5">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow mb-4">See More</p>
            <h2 className="headline-subsection text-ink mb-4">
              Follow Our Journey
            </h2>
            <p className="text-ink/60 mb-6">
              For the latest work, behind-the-scenes, and inspiration, follow us on social media.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {social.instagram && (
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  Instagram
                </a>
              )}

              {social.threads && (
                <a
                  href={social.threads.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.088-1.146 3.6-1.242 1.02-.064 1.973-.013 2.86.152-.1-.628-.314-1.14-.652-1.55-.47-.57-1.18-.859-2.107-.859h-.045c-.767.007-1.512.234-2.036.622l-1.23-1.63c.89-.674 2.04-1.038 3.318-1.053 1.5.013 2.71.524 3.6 1.523.783.875 1.24 2.005 1.364 3.362.435.199.84.44 1.206.72 1.044.8 1.792 1.86 2.165 3.065.493 1.59.388 3.603-1.09 5.49-1.848 2.36-4.71 3.212-8.187 3.212zm-.09-5.894c1.143-.066 1.96-.47 2.43-1.202.478-.745.67-1.77.573-3.05l-.028-.016c-.78-.167-1.636-.236-2.572-.181-1.104.069-1.96.358-2.478.837-.476.44-.683.977-.648 1.598.045.793.396 1.4 1.015 1.752.588.336 1.308.33 1.708.262z"/>
                  </svg>
                  Threads
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding-sm bg-ivory">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="headline-subsection text-ink mb-2">
                Ready for Your Transformation?
              </h3>
              <p className="text-ink/60">
                Let us create something beautiful together.
              </p>
            </div>
            <Link href="/contact" className="btn-primary whitespace-nowrap">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Image container */}
          <div
            className="relative max-w-5xl max-h-[85vh] aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxImage.image ? (
              <Image
                src={lightboxImage.image}
                alt={lightboxImage.alt}
                fill
                className="lightbox-image object-contain"
              />
            ) : (
              <div className="w-full h-full bg-blush/40 rounded-subtle flex items-center justify-center min-w-[300px] min-h-[300px] md:min-w-[500px] md:min-h-[500px]">
                <div className="text-center p-8">
                  <svg
                    className="w-16 h-16 mx-auto text-white/30 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <span className="text-white/50 text-lg">{lightboxImage.category}</span>
                  <p className="text-white/30 text-sm mt-2">[IMAGE_PLACEHOLDER]</p>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <span className="bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
              {lightboxImage.alt} — {lightboxImage.category}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
