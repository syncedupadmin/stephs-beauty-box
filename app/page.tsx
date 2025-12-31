import Link from 'next/link';
import Image from 'next/image';
import { brand, contact, hours, services, social } from '@/lib/config/brand';

export default function HomePage() {
  return (
    <>
      {/* =====================================================================
          HERO SECTION - Two Column Editorial Layout
          ===================================================================== */}
      <section className="min-h-screen bg-bg flex items-center">
        <div className="container-luxury w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-0">
            {/* Left Column - Text Content */}
            <div className="max-w-xl">
              {/* Label */}
              <p className="label-caps mb-6">West Park, FL</p>

              {/* Main Headline */}
              <h1 className="headline-hero text-light mb-6">
                Faith, Glam<br />
                <span className="text-gold">&amp; Beauty</span>
              </h1>

              {/* Subheadline */}
              <p className="subheadline mb-10">
                {brand.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/book" className="btn-primary">
                  Book Now
                </Link>
                <Link href="/services" className="btn-secondary">
                  View Services
                </Link>
              </div>

              {/* Motto */}
              <div className="mt-16 pt-8 border-t border-gold/20">
                <p className="text-blush/80 font-serif italic text-lg">
                  &ldquo;{brand.motto}&rdquo;
                </p>
              </div>
            </div>

            {/* Right Column - Image/Logo */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-[400px] h-[400px]">
                <Image
                  src={brand.logo.main}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SERVICES SECTION - 3 Column Grid
          ===================================================================== */}
      <section className="section-spacing bg-bg">
        <div className="container-luxury">
          {/* Section Header */}
          <div className="text-center mb-20">
            <p className="label-caps mb-4">What We Offer</p>
            <h2 className="headline-section text-light">
              Our <span className="text-gold">Services</span>
            </h2>
          </div>

          {/* Services Grid - 3 Columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/services#${category.id}`}
                className="group"
              >
                <div className="p-8 border border-gold/10 hover:border-gold/30 transition-colors duration-300">
                  {/* Icon */}
                  <div className="w-12 h-12 mb-6 text-gold">
                    <ServiceIcon icon={category.icon} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-light mb-3 group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="body-text mb-6">
                    {category.description}
                  </p>

                  {/* Service List */}
                  <ul className="space-y-2">
                    {category.services.slice(0, 3).map((service, idx) => (
                      <li key={idx} className="text-sm text-blush/70">
                        {service.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-16">
            <Link href="/services" className="link-gold caps">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          WHY CHOOSE US - Minimal Feature List
          ===================================================================== */}
      <section className="section-spacing bg-dark/30">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left - Content */}
            <div>
              <p className="label-caps mb-4">Why Choose Us</p>
              <h2 className="headline-section text-light mb-12">
                Beauty with <span className="text-gold">Purpose</span>
              </h2>

              {/* Features */}
              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-semibold text-light mb-2">
                    Faith-Forward Service
                  </h3>
                  <p className="body-text">
                    We believe in serving with love, grace, and excellence in everything we do.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-light mb-2">
                    Personalized Experience
                  </h3>
                  <p className="body-text">
                    Every client is unique. We tailor our services to enhance your natural beauty.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-light mb-2">
                    Premium Quality
                  </h3>
                  <p className="body-text">
                    We use only the highest quality products for stunning, long-lasting results.
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Hours */}
            <div className="p-10 bg-bg border border-gold/10">
              <h3 className="text-2xl font-semibold text-light mb-8">
                Studio <span className="text-gold">Hours</span>
              </h3>

              <div className="space-y-4 mb-10">
                {hours.schedule.map((day) => (
                  <div
                    key={day.day}
                    className="flex justify-between items-center py-2 border-b border-gold/5 last:border-0"
                  >
                    <span className={day.isOpen ? 'text-light' : 'text-light/30'}>
                      {day.day}
                    </span>
                    <span className={day.isOpen ? 'text-gold' : 'text-light/30'}>
                      {day.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <a
                  href={`tel:${contact.phoneClean}`}
                  className="btn-primary w-full text-center"
                >
                  Call {contact.phoneFormatted}
                </a>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CTA SECTION - Simple & Clean
          ===================================================================== */}
      <section className="section-spacing bg-bg">
        <div className="container-luxury">
          <div className="max-w-2xl mx-auto text-center">
            <p className="label-caps mb-4">Book Today</p>
            <h2 className="headline-section text-light mb-6">
              Ready to Feel <span className="text-gold">Beautiful?</span>
            </h2>
            <p className="subheadline mb-10">
              Book your appointment today and experience the {brand.name} difference.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/book" className="btn-primary">
                Book Your Appointment
              </Link>
              <Link href="/beauty-concierge" className="btn-secondary">
                Find Your Look
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          INSTAGRAM CTA - Minimal
          ===================================================================== */}
      <section className="py-16 bg-bg border-t border-gold/10">
        <div className="container-luxury text-center">
          <p className="label-caps mb-4">Follow the Journey</p>
          <a
            href={social.instagram?.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-gold hover:text-blush transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-medium">{social.instagram?.handle}</span>
          </a>
        </div>
      </section>
    </>
  );
}

// Service icon component - minimal SVG icons
function ServiceIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    sparkle: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    scissors: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664" />
      </svg>
    ),
    lipstick: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    eyebrow: (
      <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return icons[icon] || icons.sparkle;
}
