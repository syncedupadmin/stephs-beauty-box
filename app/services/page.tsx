import Link from 'next/link';
import { brand, services, booking, contact } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: `Explore our full range of beauty services including lashes, hair, makeup, and more at ${brand.name} in West Park, FL.`,
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-glam">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
              What We Offer
            </p>
            <h1 className="text-4xl md:text-5xl font-medium text-ivory mb-4">
              Our <span className="font-serif italic text-gold">Services</span>
            </h1>
            <p className="text-lg text-ivory/60">
              From lash extensions to full glam makeup, we offer personalized beauty services
              tailored to enhance your natural beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="container-luxury">
          <div className="space-y-16">
            {services.categories.map((category, index) => (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-24"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <ServiceIcon icon={category.icon} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-medium text-ivory">
                      {category.name}
                    </h2>
                    <p className="text-ivory/60">{category.description}</p>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service, serviceIndex) => (
                    <div
                      key={service.name}
                      className="p-6 bg-bg-card rounded-xl border border-gold/10 hover:border-gold/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-ivory mb-1">
                            {service.name}
                          </h3>
                          {service.duration && (
                            <p className="text-sm text-ivory/50">
                              {service.duration}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {service.price !== null ? (
                            <span className="text-lg font-medium text-gold">
                              ${service.price}
                            </span>
                          ) : (
                            <span className="text-sm text-rose">
                              Consult
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider between categories */}
                {index < services.categories.length - 1 && (
                  <div className="mt-12 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="mt-16 p-6 bg-bg-soft rounded-xl border border-gold/10 text-center">
            <p className="text-ivory/60 text-sm">
              {services.pricingNote}
            </p>
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-16 md:py-20 bg-bg-soft">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-ivory mb-4">
              Ready to Book?
            </h2>
            <p className="text-ivory/60 mb-8">
              Contact us to schedule your appointment or get a consultation on pricing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={booking.primaryUrl || '/book'}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft hover:shadow-gold transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Book Online
              </Link>

              <a
                href={`tel:${contact.phoneClean}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold/50 text-gold font-medium rounded-lg hover:bg-gold/10 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call {contact.phoneFormatted}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// Service icon component
function ServiceIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkle: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    scissors: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
      </svg>
    ),
    lipstick: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    eyebrow: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return icons[icon] || icons.sparkle;
}
