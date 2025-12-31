import Link from 'next/link';
import { brand, services, contact } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: `Explore our beauty services including hair, makeup, skin, lashes, and wigs at ${brand.name} in West Park, FL.`,
};

// Service icons using simple SVG
const serviceIcons: Record<string, React.ReactNode> = {
  hair: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
    </svg>
  ),
  makeup: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  skin: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  'brows-lashes': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  wigs: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-ivory">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">What We Offer</p>
            <h1 className="headline-display text-ink mb-6">
              Our Services
            </h1>
            <p className="body-large text-ink/70 max-w-xl mx-auto">
              From hair transformations to glowing skin, we offer personalized services
              that celebrate your unique beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="divider" />

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid gap-8 md:gap-12">
            {services.categories.map((category, index) => (
              <article
                key={category.id}
                id={category.id}
                className="scroll-mt-24"
              >
                <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                  {/* Icon & Number */}
                  <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blush/50 flex items-center justify-center text-sage">
                      {serviceIcons[category.id] || serviceIcons.skin}
                    </div>
                    <span className="text-ink/20 font-editorial text-4xl md:text-5xl">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-7">
                    <h2 className="headline-subsection text-ink mb-3">
                      {category.name}
                    </h2>
                    <p className="text-ink/60 leading-relaxed mb-6">
                      {category.description}
                    </p>
                    <Link
                      href="/contact"
                      className="btn-outline inline-flex items-center gap-2"
                    >
                      <span>{category.cta}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Placeholder for category image */}
                  <div className="hidden md:block md:col-span-3">
                    <div className="aspect-square bg-blush/30 rounded-subtle flex items-center justify-center">
                      <span className="text-ink/30 text-sm text-center px-4">
                        [SERVICE_IMAGE]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider between services */}
                {index < services.categories.length - 1 && (
                  <div className="divider my-8 md:my-12" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-12 bg-ivory">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-subtle shadow-soft">
            <p className="text-ink/60 text-sm leading-relaxed">
              {services.pricingNote}
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-sage/5">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <p className="eyebrow mb-4">Ready to Begin?</p>
            <h2 className="headline-section text-ink mb-4">
              Let&apos;s Create Your Look
            </h2>
            <p className="text-ink/60 mb-8 max-w-lg mx-auto">
              Reach out to schedule a consultation or ask about any of our services.
              We&apos;re here to help you feel your best.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Get in Touch
              </Link>

              <a
                href={`tel:${contact.phoneClean}`}
                className="btn-outline"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call {contact.phoneFormatted}
              </a>
            </div>

            {/* WhatsApp option */}
            <div className="mt-6">
              <a
                href={contact.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sage hover:text-sage-dark transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Or message us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
