import Link from 'next/link';
import Image from 'next/image';
import { brand, contact, hours, services, social, booking } from '@/lib/config/brand';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-glam overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-radial from-gold/5 via-transparent to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-radial from-rose/5 via-transparent to-transparent opacity-60" />
          <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-gradient-radial from-accent/3 via-transparent to-transparent opacity-40" />
        </div>

        <div className="container-luxury relative z-10 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              {/* Overline */}
              <p className="text-sm tracking-[0.2em] uppercase mb-4 animate-fade-in">
                <span className="text-rose">West Park, FL</span>{' '}
                <span className="text-ivory/40">|</span>{' '}
                <span className="text-gold">Beauty Studio</span>
              </p>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-ivory leading-tight mb-4 animate-slide-up">
                {brand.name.split("'")[0]}&apos;s{' '}
                <span className="font-serif italic text-gold">Beauty Box</span>
              </h1>

              {/* Tagline */}
              <p className="text-xl text-rose font-serif italic mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
                {brand.tagline}
              </p>

              {/* Description */}
              <p className="text-lg text-ivory/70 leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
                {brand.description} Book your appointment today and let us help you feel beautiful inside and out.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Link
                  href={booking.primaryUrl || '/book'}
                  className="px-8 py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft hover:shadow-gold transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  Book Now
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 bg-transparent text-gold font-medium rounded-lg border border-gold/50 hover:bg-gold/10 hover:border-gold transition-all duration-300"
                >
                  View Services
                </Link>
              </div>

              {/* Motto */}
              <p className="text-accent font-serif italic text-lg animate-fade-in" style={{ animationDelay: '300ms' }}>
                &ldquo;{brand.motto}&rdquo;
              </p>
            </div>

            {/* Right Content - Logo/Image Display */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-gold/20 via-transparent to-transparent blur-3xl scale-150" />

                {/* Logo display */}
                <div className="relative w-80 h-80 rounded-full border-4 border-gold/30 p-2 animate-pulse-gold">
                  <Image
                    src={brand.logo.main}
                    alt={brand.name}
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>

                {/* Decorative ring */}
                <div className="absolute inset-[-20px] rounded-full border border-rose/20" />
                <div className="absolute inset-[-40px] rounded-full border border-gold/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 md:py-28 bg-bg">
        <div className="container-luxury">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-medium text-ivory mb-4">
              Our <span className="font-serif italic text-gold">Services</span>
            </h2>
            <p className="text-ivory/60 max-w-2xl mx-auto">
              From stunning lash extensions to flawless makeup artistry, we offer a full range of beauty services to make you look and feel your best.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.categories.map((category) => (
              <Link
                key={category.id}
                href={`/services#${category.id}`}
                className="group p-8 bg-bg-card rounded-2xl border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                {/* Icon placeholder */}
                <div className="w-14 h-14 mb-6 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg transition-colors duration-300">
                  <ServiceIcon icon={category.icon} />
                </div>

                <h3 className="text-xl font-medium text-ivory mb-2 group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-ivory/60 mb-4">
                  {category.description}
                </p>
                <span className="text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Services &rarr;
                </span>
              </Link>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-soft transition-colors"
            >
              See All Services
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 bg-bg-soft">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Features */}
            <div>
              <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
                Why Choose Us
              </p>
              <h2 className="text-3xl md:text-4xl font-medium text-ivory mb-8">
                Beauty with <span className="font-serif italic text-gold">Purpose</span>
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ivory mb-1">Faith-Forward Service</h3>
                    <p className="text-ivory/60 text-sm">We believe in serving with love, grace, and excellence in everything we do.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center text-rose">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ivory mb-1">Personalized Experience</h3>
                    <p className="text-ivory/60 text-sm">Every client is unique. We tailor our services to enhance your natural beauty.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ivory mb-1">Quality Products</h3>
                    <p className="text-ivory/60 text-sm">We use only premium products to ensure the best results for your beauty needs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Hours Card */}
            <div className="bg-bg-card rounded-2xl border border-gold/20 p-8 md:p-10">
              <h3 className="text-2xl font-medium text-ivory mb-6">
                Studio <span className="text-gold">Hours</span>
              </h3>

              <div className="space-y-3 mb-8">
                {hours.schedule.map((day) => (
                  <div key={day.day} className="flex justify-between items-center py-2 border-b border-gold/10 last:border-0">
                    <span className={`text-sm ${day.isOpen ? 'text-ivory' : 'text-ivory/40'}`}>
                      {day.day}
                    </span>
                    <span className={`text-sm font-medium ${day.isOpen ? 'text-gold' : 'text-ivory/40'}`}>
                      {day.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${contact.phoneClean}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call {contact.phoneFormatted}
                </a>

                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gold/40 text-gold font-medium rounded-lg hover:bg-gold/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-glam relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose/5 rounded-full blur-3xl" />
        </div>

        <div className="container-luxury relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-ivory mb-4">
              Ready to Feel{' '}
              <span className="font-serif italic text-gold">Beautiful?</span>
            </h2>
            <p className="text-lg text-ivory/60 mb-8 max-w-xl mx-auto">
              Book your appointment today and experience the {brand.name} difference.
            </p>
            <Link
              href={booking.primaryUrl || '/book'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft hover:shadow-gold transition-all duration-300"
            >
              Book Your Appointment
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16 bg-bg border-t border-gold/10">
        <div className="container-luxury text-center">
          <p className="text-ivory/60 mb-4">Follow us on Instagram for the latest looks</p>
          <a
            href={social.instagram?.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-rose hover:text-rose-soft transition-colors text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
            {social.instagram?.handle || '@stephsbeautybox__'}
          </a>
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
