import Link from 'next/link';
import { brand, contact, hours, social } from '@/lib/config/brand';
import { ABOUT_IMAGES } from '@/lib/config/images';
import type { Metadata } from 'next';

// Type assertion for brand with mission
const brandWithMission = brand as typeof brand & { mission?: string };

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${brand.name} — a welcoming beauty space in West Park, FL where everyone belongs.`,
};

/**
 * ABOUT PAGE - EDITORIAL STORYTELLING
 * ====================================
 * Design: Asymmetric layouts with vast negative space
 * - No icons, no cards
 * - Editorial text links
 * - Atmospheric placeholders
 */

export default function AboutPage() {
  return (
    <>
      {/* Hero Section - Editorial */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="max-w-lg">
              <p className="overline mb-6">Our Story</p>
              <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
                About<br />
                <span className="font-editorial-italic">{brand.name}</span>
              </h1>
              <p className="text-ink/70 text-body-lg font-body leading-relaxed mb-6">
                {brand.description}
              </p>
              {brandWithMission.mission && (
                <p className="text-ink/60 text-body-md font-body leading-relaxed mb-6 border-l-2 border-botanical/30 pl-4 italic">
                  {brandWithMission.mission}
                </p>
              )}
              <p className="font-display italic text-botanical text-xl">
                {brand.faithMessage}
              </p>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${ABOUT_IMAGES.steph})` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Editorial */}
      <section className="section-editorial bg-off-white/50">
        <div className="container-editorial">
          <div className="max-w-2xl mb-20">
            <p className="overline mb-6">What We Believe</p>
            <h2 className="font-display text-display-lg text-ink leading-[0.9] mb-6">
              {brand.tagline}
            </h2>
            <p className="text-ink/60 text-body-lg font-body leading-relaxed">
              Beauty isn&apos;t just about looking good—it&apos;s about feeling confident,
              cared for, and celebrated exactly as you are.
            </p>
          </div>

          {/* Values - Minimal Editorial Grid */}
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Value 1 */}
            <div>
              <div className="divider-hairline mb-6" />
              <h3 className="font-display text-display-sm text-ink mb-4">Everyone Belongs</h3>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                We welcome all ages, backgrounds, and identities.
                Our space is designed for you to feel comfortable, respected, and celebrated.
              </p>
            </div>

            {/* Value 2 */}
            <div>
              <div className="divider-hairline mb-6" />
              <h3 className="font-display text-display-sm text-ink mb-4">Quality & Care</h3>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                Every service is performed with attention to detail, using quality products
                and techniques tailored to your unique needs.
              </p>
            </div>

            {/* Value 3 */}
            <div>
              <div className="divider-hairline mb-6" />
              <h3 className="font-display text-display-sm text-ink mb-4">Inner & Outer Beauty</h3>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                True beauty radiates from within. We strive to help you feel as beautiful
                on the inside as you look on the outside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours - Editorial */}
      <section className="section-editorial">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Location */}
            <div>
              <p className="overline mb-6">Visit Us</p>
              <h2 className="font-display text-display-md text-ink leading-[0.9] mb-8">
                Our Location
              </h2>

              <address className="not-italic text-ink/70 font-body text-body-lg leading-relaxed mb-8">
                {contact.address.street}<br />
                {contact.address.unit}<br />
                {contact.address.city}, {contact.address.state} {contact.address.zip}
              </address>

              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-link text-body-md"
              >
                Get Directions
              </a>
            </div>

            {/* Hours */}
            <div>
              <p className="overline mb-6">Hours</p>
              <h2 className="font-display text-display-md text-ink leading-[0.9] mb-8">
                When We&apos;re Open
              </h2>

              <ul className="space-y-4 mb-8">
                {hours.schedule.map((day) => (
                  <li key={day.day} className="flex justify-between text-body-md font-body">
                    <span className={day.isOpen ? 'text-ink' : 'text-ink/40'}>
                      {day.day}
                    </span>
                    <span className={day.isOpen ? 'text-botanical' : 'text-ink/40'}>
                      {day.hours}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-ink/40 text-body-sm font-body">
                {hours.closedDays}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Connect - Editorial */}
      <section className="section-editorial-sm bg-off-white/50">
        <div className="container-editorial text-center">
          <p className="overline mb-6">Stay Connected</p>
          <h2 className="font-display text-display-md text-ink mb-8 leading-[0.9]">
            Follow Along
          </h2>

          <div className="flex justify-center gap-8">
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

      {/* Contact CTA - Botanical */}
      <section className="section-editorial bg-botanical">
        <div className="container-editorial text-center">
          <h2 className="font-display text-display-md text-off-white mb-6 leading-[0.9]">
            Ready to Begin<br />
            <span className="font-editorial-italic">Your Journey?</span>
          </h2>
          <p className="text-off-white/70 text-body-lg font-body mb-10 max-w-md mx-auto">
            Whether you have questions or are ready to book, we&apos;d love to hear from you.
          </p>
          <Link
            href="/contact"
            className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
