import Link from 'next/link';
import { brand, contact, hours, social, booking } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${brand.name}. Located at ${contact.address.full}. Open ${hours.summary}.`,
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-glam">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
              Get In Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-medium text-ivory mb-4">
              Contact <span className="font-serif italic text-gold">Us</span>
            </h1>
            <p className="text-lg text-ivory/60">
              Have questions or ready to book? We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Phone Card */}
              <a
                href={`tel:${contact.phoneClean}`}
                className="block p-6 bg-bg-card rounded-xl border border-gold/10 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-bg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ivory mb-1">Call Us</h3>
                    <p className="text-gold text-lg">{contact.phoneFormatted}</p>
                    <p className="text-ivory/50 text-sm mt-1">Tap to call</p>
                  </div>
                </div>
              </a>

              {/* Location Card */}
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-bg-card rounded-xl border border-gold/10 hover:border-gold/30 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose/10 flex items-center justify-center text-rose group-hover:bg-rose group-hover:text-bg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-ivory mb-1">Visit Us</h3>
                    <p className="text-ivory/80">
                      {contact.address.street}<br />
                      {contact.address.unit}<br />
                      {contact.address.city}, {contact.address.state} {contact.address.zip}
                    </p>
                    <p className="text-rose text-sm mt-2">Get Directions &rarr;</p>
                  </div>
                </div>
              </a>

              {/* Social Media Card */}
              <div className="p-6 bg-bg-card rounded-xl border border-gold/10">
                <h3 className="text-lg font-medium text-ivory mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {social.instagram && (
                    <a
                      href={social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-bg-soft rounded-lg hover:bg-rose/10 transition-colors group"
                    >
                      <svg className="w-5 h-5 text-ivory/60 group-hover:text-rose transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-ivory/80 group-hover:text-rose transition-colors">Instagram</span>
                    </a>
                  )}
                  {social.youtube && (
                    <a
                      href={social.youtube.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-bg-soft rounded-lg hover:bg-rose/10 transition-colors group"
                    >
                      <svg className="w-5 h-5 text-ivory/60 group-hover:text-rose transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="text-sm text-ivory/80 group-hover:text-rose transition-colors">YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Hours & Book Card */}
            <div className="bg-bg-card rounded-2xl border border-gold/20 p-8 md:p-10 h-fit">
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

              <Link
                href={booking.primaryUrl || '/book'}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft hover:shadow-gold transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                Book Your Appointment
              </Link>

              <p className="mt-6 text-center text-accent font-serif italic text-sm">
                &ldquo;{brand.motto}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Embed Placeholder */}
      <section className="bg-bg-soft">
        <div className="container-luxury py-8">
          <div className="aspect-video md:aspect-[21/9] bg-bg-card rounded-xl border border-gold/10 overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(contact.address.full)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Location"
            />
          </div>
        </div>
      </section>
    </>
  );
}
