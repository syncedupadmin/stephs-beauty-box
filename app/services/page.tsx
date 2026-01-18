import Link from 'next/link';
import Image from 'next/image';
import { brand, contact } from '@/lib/config/brand';
import { getServicesGroupedByCategory } from '@/lib/db/bookings';
import { PRICING_DISCLAIMER, DEPOSIT_DISPLAY } from '@/lib/config/policies';
import { ServicesAccordion } from '@/components/services/ServicesAccordion';
import { getImage } from '@/lib/config/images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: `View our complete menu of beauty services including wigs, braids, makeup, waxing, and more at ${brand.name} in West Park, FL.`,
};

// Revalidate every 60 seconds to pick up database changes
export const revalidate = 60;

/**
 * SERVICES PAGE - ACCORDION LAYOUT
 * =================================
 * Design: Clean accordion sections for easy browsing
 * - Hero section with editorial styling
 * - Collapsible categories with full pricing
 * - Book Now CTA with deposit info
 *
 * DATA SOURCE: Supabase database (same as booking page)
 */

export default async function ServicesPage() {
  // Fetch services from database grouped by category
  const serviceCategories = await getServicesGroupedByCategory();
  const totalServices = serviceCategories.reduce((sum, cat) => sum + cat.services.length, 0);

  return (
    <>
      {/* Hero Section - Editorial with Image */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="max-w-xl">
              <p className="overline mb-6">Our Menu</p>
              <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
                Services<br />
                <span className="font-editorial-italic">&amp; Pricing</span>
              </h1>
              <p className="text-ink/70 text-body-lg font-body leading-relaxed mb-6">
                From wig installations to braids, makeup to facials, we offer a full range
                of luxury beauty services tailored to celebrate your unique style.
              </p>
              <p className="text-ink/50 text-body-sm font-body leading-relaxed">
                {PRICING_DISCLAIMER}
              </p>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block relative aspect-[4/5] overflow-hidden">
              <Image
                src={getImage(13)}
                alt="Beauty services"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="py-6 bg-ink/[0.02]">
        <div className="container-editorial">
          <div className="flex flex-wrap items-center justify-between gap-4 text-body-sm">
            <div className="flex items-center gap-6 text-ink/60">
              <span>{serviceCategories.length} Categories</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">{totalServices}+ Services</span>
            </div>
            <div className="flex items-center gap-2 text-botanical font-medium">
              <span>{DEPOSIT_DISPLAY} deposit to book</span>
              <Link href="/book" className="editorial-link ml-2">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Accordion */}
      <section className="py-12 md:py-20">
        <div className="container-editorial">
          <ServicesAccordion
            categories={serviceCategories}
            defaultOpenFirst={false}
          />
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-12 md:py-16">
        <div className="container-editorial">
          <div className="divider-hairline mb-8" />
          <div className="max-w-xl mx-auto text-center">
            <p className="text-ink/50 text-body-sm font-body leading-relaxed mb-4">
              {PRICING_DISCLAIMER}
            </p>
            <p className="text-ink/40 text-body-sm font-body">
              Additional fees may apply for extra-long hair, complex styles, or rush appointments.
            </p>
          </div>
        </div>
      </section>

      {/* Booking CTA - Botanical */}
      <section className="section-editorial bg-botanical">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <p className="overline text-off-white/50 mb-6">Ready to Book?</p>
            <h2 className="font-display text-display-md text-off-white mb-6 leading-[0.9]">
              Secure Your<br />
              <span className="font-editorial-italic">Appointment</span>
            </h2>
            <p className="text-off-white/70 text-body-lg font-body mb-4 max-w-md mx-auto">
              Book your appointment online with a {DEPOSIT_DISPLAY} deposit.
              The remaining balance is due upon arrival.
            </p>
            <p className="text-off-white/50 text-body-sm font-body mb-10 max-w-md mx-auto">
              All deposits are non-refundable and non-transferable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
              >
                Book Now
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
