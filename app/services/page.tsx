import Link from 'next/link';
import { brand, services, contact } from '@/lib/config/brand';
import { getImage } from '@/lib/config/images';
import type { Metadata } from 'next';

// Map service category IDs to image indices - prioritizing darker models (7, 8, 12, 15, 17)
// Must match the 5 service IDs from brand.ts: hair, makeup, skin, brows-lashes, wigs
const serviceImageMap: Record<string, number> = {
  hair: 7,
  makeup: 12,
  skin: 8,
  'brows-lashes': 15,
  wigs: 17,
};

export const metadata: Metadata = {
  title: 'Services',
  description: `Explore our beauty services including hair, makeup, skin, lashes, and wigs at ${brand.name} in West Park, FL.`,
};

/**
 * SERVICES PAGE - EDITORIAL ALTERNATING ROWS
 * ===========================================
 * Design: Asymmetric layouts with vast negative space
 * - No icons, no cards
 * - Alternating image positions
 * - Editorial text links
 */

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section - Editorial */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">What We Offer</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
              Our<br />
              <span className="font-editorial-italic">Services</span>
            </h1>
            <p className="text-ink/70 text-body-lg font-body leading-relaxed max-w-md">
              From hair transformations to glowing skin, we offer personalized services
              that celebrate your unique beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="container-editorial">
        <div className="divider-hairline" />
      </div>

      {/* Services - Alternating Editorial Rows */}
      <section className="py-20 md:py-32">
        <div className="container-editorial">
          <div className="space-y-32 md:space-y-40">
            {services.categories.map((category, index) => (
              <article
                key={category.id}
                id={category.id}
                className="scroll-mt-32"
              >
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  {/* Image */}
                  <div
                    className={`relative aspect-[4/5] overflow-hidden ${
                      index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${getImage(serviceImageMap[category.id] || index + 3)})` }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`${
                      index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    {/* Service Number */}
                    <span className="font-display text-6xl md:text-7xl text-ink/10 leading-none mb-4 block">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Category Name */}
                    <h2 className="font-display text-display-lg text-ink mb-6 leading-[0.9]">
                      {category.name}
                    </h2>

                    {/* Description */}
                    <p className="text-ink/60 text-body-lg font-body leading-relaxed mb-8 max-w-md">
                      {category.description}
                    </p>

                    {/* Editorial Link */}
                    <Link href="/contact" className="editorial-link text-body-md">
                      {category.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Note - Subtle */}
      <section className="py-16 md:py-20">
        <div className="container-editorial">
          <div className="divider-hairline mb-12" />
          <p className="text-ink/50 text-body-sm font-body text-center max-w-lg mx-auto leading-relaxed">
            {services.pricingNote}
          </p>
        </div>
      </section>

      {/* Contact CTA - Botanical */}
      <section className="section-editorial bg-botanical">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <p className="overline text-off-white/50 mb-6">Ready to Begin?</p>
            <h2 className="font-display text-display-md text-off-white mb-6 leading-[0.9]">
              Let&apos;s Create<br />
              <span className="font-editorial-italic">Your Look</span>
            </h2>
            <p className="text-off-white/70 text-body-lg font-body mb-10 max-w-md mx-auto">
              Reach out to schedule a consultation or ask about any of our services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
              >
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
        </div>
      </section>
    </>
  );
}
