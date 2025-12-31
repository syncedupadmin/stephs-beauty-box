import Image from 'next/image';
import Link from 'next/link';
import { brand, contact, hours, social } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about ${brand.name} — a welcoming beauty space in West Park, FL where everyone belongs.`,
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding bg-ivory">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Content */}
            <div>
              <p className="eyebrow mb-4">Our Story</p>
              <h1 className="headline-display text-ink mb-6">
                About {brand.name}
              </h1>
              <p className="body-large text-ink/70 mb-6">
                {brand.description}
              </p>
              <p className="font-editorial-italic text-sage text-xl">
                {brand.faithMessage}
              </p>
            </div>

            {/* Image placeholder */}
            <div className="aspect-[4/5] bg-blush/30 rounded-subtle relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-ink/30 text-sm">[OWNER_PORTRAIT]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="eyebrow mb-4">What We Believe</p>
            <h2 className="headline-section text-ink mb-6">
              {brand.tagline}
            </h2>
            <p className="text-ink/60 leading-relaxed">
              Beauty isn&apos;t just about looking good—it&apos;s about feeling confident,
              cared for, and celebrated exactly as you are. We believe in nurturing
              both your outer glow and your inner radiance.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Value 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="font-editorial text-2xl text-ink mb-3">Everyone Belongs</h3>
              <p className="text-ink/60 text-sm leading-relaxed">
                We welcome all ages, backgrounds, and identities.
                Our space is designed for you to feel comfortable, respected, and celebrated.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </div>
              <h3 className="font-editorial text-2xl text-ink mb-3">Quality & Care</h3>
              <p className="text-ink/60 text-sm leading-relaxed">
                Every service is performed with attention to detail, using quality products
                and techniques tailored to your unique needs.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sage/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="font-editorial text-2xl text-ink mb-3">Inner & Outer Beauty</h3>
              <p className="text-ink/60 text-sm leading-relaxed">
                True beauty radiates from within. We strive to help you feel as beautiful
                on the inside as you look on the outside.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="section-padding bg-sage/5">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Location */}
            <div>
              <p className="eyebrow mb-4">Visit Us</p>
              <h2 className="headline-subsection text-ink mb-6">
                Our Location
              </h2>

              <address className="not-italic text-ink/70 leading-relaxed mb-6">
                <p className="text-lg">
                  {contact.address.street}<br />
                  {contact.address.unit}<br />
                  {contact.address.city}, {contact.address.state} {contact.address.zip}
                </p>
              </address>

              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Get Directions
              </a>
            </div>

            {/* Hours */}
            <div>
              <p className="eyebrow mb-4">Hours</p>
              <h2 className="headline-subsection text-ink mb-6">
                When We&apos;re Open
              </h2>

              <ul className="space-y-3 mb-6">
                {hours.schedule.map((day) => (
                  <li key={day.day} className="flex justify-between">
                    <span className={day.isOpen ? 'text-ink' : 'text-ink/40'}>
                      {day.day}
                    </span>
                    <span className={day.isOpen ? 'text-sage font-medium' : 'text-ink/40'}>
                      {day.hours}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-ink/50 text-sm">
                {hours.closedDays}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Connect */}
      <section className="py-16 bg-white">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center">
            <p className="eyebrow mb-4">Stay Connected</p>
            <h2 className="headline-subsection text-ink mb-6">
              Follow Along
            </h2>
            <p className="text-ink/60 mb-8">
              Get inspired, see our latest work, and stay updated on new services.
            </p>

            <div className="flex justify-center gap-4">
              {social.instagram && (
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage hover:bg-sage hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              )}

              {social.threads && (
                <a
                  href={social.threads.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage hover:bg-sage hover:text-white transition-colors"
                  aria-label="Threads"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.088-1.146 3.6-1.242 1.02-.064 1.973-.013 2.86.152-.1-.628-.314-1.14-.652-1.55-.47-.57-1.18-.859-2.107-.859h-.045c-.767.007-1.512.234-2.036.622l-1.23-1.63c.89-.674 2.04-1.038 3.318-1.053 1.5.013 2.71.524 3.6 1.523.783.875 1.24 2.005 1.364 3.362.435.199.84.44 1.206.72 1.044.8 1.792 1.86 2.165 3.065.493 1.59.388 3.603-1.09 5.49-1.848 2.36-4.71 3.212-8.187 3.212zm-.09-5.894c1.143-.066 1.96-.47 2.43-1.202.478-.745.67-1.77.573-3.05l-.028-.016c-.78-.167-1.636-.236-2.572-.181-1.104.069-1.96.358-2.478.837-.476.44-.683.977-.648 1.598.045.793.396 1.4 1.015 1.752.588.336 1.308.33 1.708.262z"/>
                  </svg>
                </a>
              )}

              {social.youtube && (
                <a
                  href={social.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-sage hover:bg-sage hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-ivory">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="headline-section text-ink mb-4">
              Ready to Begin Your Beauty Journey?
            </h2>
            <p className="text-ink/60 mb-8">
              Whether you have questions or are ready to book, we&apos;d love to hear from you.
            </p>
            <Link href="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
