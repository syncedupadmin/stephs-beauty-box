'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * DEMO PAGE - Photo Filter Preview
 * =================================
 * Shows how the uploaded photos look with various filters
 * that match the brand's romantic high-fashion editorial aesthetic.
 */

// All demo images
const demoImages = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  src: `/images/demo/photo-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `Demo photo ${i + 1}`,
}));

// Filter presets that match the brand aesthetic
const filterPresets = {
  none: {
    name: 'Original',
    description: 'No filter applied',
    css: '',
  },
  editorial: {
    name: 'Editorial Warm',
    description: 'Warm tones, slightly desaturated - recommended',
    css: 'brightness(1.02) contrast(1.05) saturate(0.9) sepia(0.08)',
  },
  luxury: {
    name: 'Luxury Soft',
    description: 'Soft, lifted blacks, muted elegance',
    css: 'brightness(1.05) contrast(0.95) saturate(0.85) sepia(0.05)',
  },
  botanical: {
    name: 'Botanical',
    description: 'Warm with slight green undertone',
    css: 'brightness(1.03) contrast(1.02) saturate(0.88) sepia(0.1) hue-rotate(-5deg)',
  },
  magazine: {
    name: 'Magazine Cover',
    description: 'High contrast, punchy but warm',
    css: 'brightness(1.0) contrast(1.12) saturate(0.95) sepia(0.05)',
  },
  romantic: {
    name: 'Romantic',
    description: 'Soft, dreamy, slightly pink undertone',
    css: 'brightness(1.05) contrast(0.98) saturate(0.85) sepia(0.12) hue-rotate(-8deg)',
  },
};

type FilterKey = keyof typeof filterPresets;

export default function DemoPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('editorial');
  const [compareMode, setCompareMode] = useState(false);
  const [heroImage, setHeroImage] = useState(demoImages[0]);

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-editorial">
          <Link href="/" className="editorial-link text-body-sm mb-6 inline-block">
            &larr; Back to Site
          </Link>
          <p className="overline mb-4">Photo Demo</p>
          <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-6">
            Filter Preview
          </h1>
          <p className="text-ink/70 text-body-lg font-body max-w-xl">
            See how your photos look with CSS filters applied to match the brand&apos;s
            romantic high-fashion editorial aesthetic.
          </p>
        </div>
      </header>

      {/* Filter Controls */}
      <section className="py-8 bg-off-white/50 sticky top-20 z-30">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-body-sm font-body text-ink/60">Filter:</span>
            {Object.entries(filterPresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as FilterKey)}
                className={`px-4 py-2 text-body-sm font-body transition-all duration-300 rounded-full ${
                  activeFilter === key
                    ? 'bg-botanical text-off-white'
                    : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
          <p className="text-body-sm text-ink/50 font-body">
            {filterPresets[activeFilter].description}
          </p>

          {/* Compare toggle */}
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="w-4 h-4 accent-botanical"
            />
            <span className="text-body-sm text-ink/70">Show side-by-side comparison</span>
          </label>
        </div>
      </section>

      {/* Hero Preview */}
      <section className="py-16 md:py-24">
        <div className="container-editorial">
          <h2 className="font-display text-display-md text-ink mb-8">Hero Preview</h2>

          {compareMode ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Original */}
              <div>
                <p className="overline mb-4">Original</p>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={heroImage.src}
                    alt="Original"
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
              </div>

              {/* Filtered */}
              <div>
                <p className="overline mb-4">{filterPresets[activeFilter].name}</p>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={heroImage.src}
                    alt="Filtered"
                    fill
                    className="object-cover"
                    style={{ filter: filterPresets[activeFilter].css }}
                    sizes="50vw"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <Image
                src={heroImage.src}
                alt="Hero preview"
                fill
                className="object-cover"
                style={{ filter: filterPresets[activeFilter].css }}
                sizes="100vw"
                priority
              />
              {/* Overlay gradient like homepage */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />

              {/* Sample text overlay */}
              <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-10">
                <p className="overline text-off-white/60 mb-4">West Park, FL</p>
                <h2 className="font-display text-display-lg md:text-display-hero text-off-white leading-[0.9] mb-4">
                  Beauty for<br />
                  <span className="font-editorial-italic">Everyone</span>
                </h2>
                <span className="cta-primary">Start the Journey</span>
              </div>
            </div>
          )}

          {/* Hero image selector */}
          <div className="mt-8">
            <p className="text-body-sm text-ink/60 mb-4">Select hero image:</p>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {demoImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setHeroImage(img)}
                  className={`relative w-16 h-20 flex-shrink-0 overflow-hidden transition-all ${
                    heroImage.id === img.id ? 'ring-2 ring-botanical' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    style={{ filter: filterPresets[activeFilter].css }}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid Preview */}
      <section className="py-16 md:py-24 bg-off-white/30">
        <div className="container-editorial">
          <h2 className="font-display text-display-md text-ink mb-4">Gallery Preview</h2>
          <p className="text-ink/60 text-body-md font-body mb-12">
            All {demoImages.length} photos with the <strong>{filterPresets[activeFilter].name}</strong> filter applied.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {demoImages.map((img, index) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-600 ease-luxury group-hover:scale-[1.03]"
                    style={{ filter: filterPresets[activeFilter].css }}
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors duration-600 flex items-end p-4">
                  <span className="text-off-white/0 group-hover:text-off-white/90 text-body-sm font-body transition-colors duration-600">
                    Photo {img.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section Preview */}
      <section className="section-editorial">
        <div className="container-editorial">
          <h2 className="font-display text-display-md text-ink mb-12">Editorial Section Preview</h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={demoImages[2]?.src || demoImages[0].src}
                alt="Editorial preview"
                fill
                className="object-cover"
                style={{ filter: filterPresets[activeFilter].css }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div>
              <p className="overline mb-4">Hair</p>
              <h3 className="font-display text-display-lg text-ink mb-6 leading-[0.9]">
                Your Crown,<br />
                <span className="font-editorial-italic">Reimagined</span>
              </h3>
              <p className="text-ink/70 text-body-lg mb-8 font-body leading-relaxed max-w-md">
                From transformative color to precision cuts, we work with every texture and style.
                Your hair tells a story—let us help you write the next chapter.
              </p>
              <span className="editorial-link text-body-md cursor-pointer">
                Inquire
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Code Preview */}
      <section className="py-16 md:py-24 bg-charcoal">
        <div className="container-editorial">
          <h2 className="font-display text-display-md text-off-white mb-8">CSS Filter Code</h2>
          <p className="text-off-white/60 text-body-md font-body mb-8">
            Copy this CSS to apply the <strong className="text-off-white">{filterPresets[activeFilter].name}</strong> filter globally:
          </p>

          <div className="bg-near-black p-6 rounded-none overflow-x-auto">
            <pre className="text-off-white/80 font-mono text-sm">
{`/* ${filterPresets[activeFilter].name} filter */
.gallery-image,
.hero-image,
.editorial-image {
  filter: ${filterPresets[activeFilter].css || 'none'};
}`}
            </pre>
          </div>

          <p className="text-off-white/40 text-body-sm font-body mt-6">
            Or add to your Tailwind config as a custom utility class.
          </p>
        </div>
      </section>

      {/* Recommendation */}
      <section className="section-editorial bg-botanical">
        <div className="container-editorial text-center">
          <h2 className="font-display text-display-md text-off-white mb-6">
            Recommended Filter
          </h2>
          <p className="text-off-white/70 text-body-lg font-body mb-8 max-w-lg mx-auto">
            For Steph&apos;s Beauty Box, we recommend the <strong className="text-off-white">Editorial Warm</strong> filter.
            It creates a cohesive, luxurious feel that matches the warm ivory palette and botanical accents.
          </p>
          <button
            onClick={() => setActiveFilter('editorial')}
            className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
          >
            Apply Editorial Warm
          </button>
        </div>
      </section>
    </div>
  );
}
