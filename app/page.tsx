'use client';

import Link from 'next/link';
import Image from 'next/image';
import { brand, contact, services } from '@/lib/config/brand';
import { homeSections, desktopHero, quickLinks } from '@/lib/config/homeSections';

export default function HomePage() {
  return (
    <>
      {/* =====================================================================
          MOBILE: Scroll-Snap Model Sections
          ===================================================================== */}
      <div className="md:hidden scroll-snap-container h-screen overflow-y-scroll">
        {homeSections.map((section, index) => (
          <section
            key={section.id}
            className="scroll-snap-section relative flex items-end"
          >
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-blush">
              {/* Placeholder gradient until real images are added */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg,
                    ${index % 2 === 0 ? '#E7D3C7' : '#F7F1E8'} 0%,
                    ${index % 2 === 0 ? '#F7F1E8' : '#E7D3C7'} 100%)`,
                }}
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent"
              />
              {/* Placeholder text for missing image */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <span className="text-ink text-lg font-editorial">
                  [MODEL_IMAGE_{index + 1}]
                </span>
              </div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full p-6 pb-12 safe-area-bottom">
              <div className={`${section.contentPosition === 'bottom-center' ? 'text-center' : 'text-left'}`}>
                {/* Headline */}
                <h2 className="text-3xl font-editorial font-medium text-white mb-2 text-balance">
                  {section.headline}
                </h2>

                {/* Subline */}
                <p className="text-white/80 text-base mb-6">
                  {section.subline}
                </p>

                {/* CTA Button */}
                <Link
                  href={section.cta.href}
                  className={`
                    inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-button
                    ${section.cta.variant === 'primary' ? 'bg-white text-ink hover:bg-white/90' : ''}
                    ${section.cta.variant === 'secondary' ? 'bg-sage text-white hover:bg-sage-dark' : ''}
                    ${section.cta.variant === 'outline' ? 'bg-transparent text-white border border-white/50 hover:bg-white/10' : ''}
                    transition-colors duration-200
                  `}
                >
                  {section.cta.label}
                </Link>
              </div>

              {/* Scroll indicator for first section */}
              {index === 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse">
                  <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          </section>
        ))}

        {/* Quick Links Section (after model scroll) */}
        <section className="scroll-snap-section bg-ivory flex flex-col justify-center px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="headline-subsection text-ink mb-2">Explore</h2>
            <p className="text-ink/60">Discover what we offer</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-6 bg-white rounded-subtle shadow-soft hover:shadow-soft-lg transition-shadow"
              >
                <QuickLinkIcon icon={link.icon} />
                <span className="text-sm font-medium text-ink">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Contact CTAs */}
          <div className="mt-8 flex flex-col gap-3 max-w-sm mx-auto w-full">
            <a href={`tel:${contact.phoneClean}`} className="btn-primary w-full justify-center">
              Call Us
            </a>
            <a href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center">
              WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* =====================================================================
          DESKTOP: Editorial Hero + Sections
          ===================================================================== */}
      <div className="hidden md:block">
        {/* Hero Section */}
        <section className="section-padding bg-ivory">
          <div className="container-editorial">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Content */}
              <div className="max-w-xl">
                <p className="eyebrow mb-4">West Park, FL</p>

                <h1 className="headline-display text-ink mb-6 text-balance">
                  {desktopHero.headline}
                </h1>

                <p className="body-large mb-8">
                  {desktopHero.subline}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href={desktopHero.primaryCta.href} className="btn-primary">
                    {desktopHero.primaryCta.label}
                  </Link>
                  <Link href={desktopHero.secondaryCta.href} className="btn-outline">
                    {desktopHero.secondaryCta.label}
                  </Link>
                </div>

                {/* Faith message - subtle */}
                <p className="mt-10 text-sage/80 font-editorial-italic text-lg">
                  {brand.faithMessage}
                </p>
              </div>

              {/* Right: Image placeholder */}
              <div className="relative aspect-[4/5] bg-blush rounded-subtle overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-ink/30 text-lg font-editorial">[HERO_DESKTOP]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="section-padding bg-white">
          <div className="container-editorial">
            <div className="text-center mb-16">
              <p className="eyebrow mb-3">What We Offer</p>
              <h2 className="headline-section text-ink">Our Services</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.categories.slice(0, 3).map((category) => (
                <div key={category.id} className="group">
                  {/* Service Image Placeholder */}
                  <div className="aspect-[4/3] bg-blush rounded-subtle mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-ink/30 text-sm">[{category.name.toUpperCase()}_IMAGE]</span>
                    </div>
                  </div>

                  <h3 className="headline-subsection text-ink mb-2 group-hover:text-sage transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-ink/60 mb-4">
                    {category.description}
                  </p>
                  <Link href={`/services#${category.id}`} className="btn-ghost px-0">
                    {category.cta} →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/services" className="btn-outline">
                View All Services
              </Link>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="section-padding bg-ivory">
          <div className="container-editorial">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image placeholder */}
              <div className="relative aspect-square bg-blush rounded-subtle overflow-hidden order-2 lg:order-1">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-ink/30 text-lg font-editorial">[ABOUT_IMAGE]</span>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <p className="eyebrow mb-4">About Us</p>
                <h2 className="headline-section text-ink mb-6">
                  External & Internal Beauty
                </h2>
                <p className="body-large mb-6">
                  At {brand.name}, we believe beauty is more than skin deep. Our space is built on
                  welcoming everyone—celebrating all shades, all styles, all stories.
                </p>
                <p className="text-ink/60 mb-8">
                  We create an environment where you feel safe, seen, and celebrated.
                  Whether you&apos;re here for a transformation or a touch-up, you belong here.
                </p>
                <Link href="/about" className="btn-primary">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section-padding-sm bg-sage">
          <div className="container-editorial text-center">
            <h2 className="headline-section text-white mb-4">Ready to Begin?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Reach out to book your appointment or ask any questions. We&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-white">
                Get in Touch
              </Link>
              <a
                href={`tel:${contact.phoneClean}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white border border-white/50 rounded-button font-medium text-sm hover:bg-white/10 transition-colors"
              >
                Call {contact.phoneFormatted}
              </a>
            </div>
          </div>
        </section>

        {/* Instagram CTA */}
        <section className="section-padding-sm bg-ivory border-t border-ink/10">
          <div className="container-editorial text-center">
            <p className="eyebrow mb-3">Follow Along</p>
            <a
              href="https://www.instagram.com/stephsbeautybox_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink hover:text-sage transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-medium">@stephsbeautybox_</span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

// Quick link icons
function QuickLinkIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkles: (
      <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    bag: (
      <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    camera: (
      <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    message: (
      <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  };

  return icons[icon] || icons.sparkles;
}
