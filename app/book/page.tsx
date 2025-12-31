import Link from 'next/link';
import { brand, contact, hours, booking, services } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Appointment',
  description: `Book your beauty appointment at ${brand.name}. Lash extensions, makeup, hair styling and more.`,
};

export default function BookPage() {
  // If booking URL is configured, we'll show that
  const hasBookingUrl = booking.primaryUrl !== null;

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-glam">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-rose text-sm tracking-[0.2em] uppercase mb-3">
              Schedule Your Visit
            </p>
            <h1 className="text-4xl md:text-5xl font-medium text-ivory mb-4">
              Book Your <span className="font-serif italic text-gold">Appointment</span>
            </h1>
            <p className="text-lg text-ivory/60">
              Ready to feel beautiful? Schedule your appointment today.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 md:py-24 bg-bg">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto">
            {hasBookingUrl ? (
              // If external booking URL is available
              <div className="text-center">
                <div className="p-8 bg-bg-card rounded-2xl border border-gold/20 mb-8">
                  <h2 className="text-2xl font-medium text-ivory mb-4">
                    Online Booking Available
                  </h2>
                  <p className="text-ivory/60 mb-6">
                    Click below to book your appointment through our online scheduling system.
                  </p>
                  <a
                    href={booking.primaryUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft hover:shadow-gold transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    Book Online
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>

                <p className="text-ivory/50 text-sm">
                  Prefer to call? Reach us at{' '}
                  <a href={`tel:${contact.phoneClean}`} className="text-gold hover:text-gold-soft">
                    {contact.phoneFormatted}
                  </a>
                </p>
              </div>
            ) : (
              // If no external booking, show contact info
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Card */}
                <div className="p-8 bg-bg-card rounded-2xl border border-gold/20">
                  <h2 className="text-2xl font-medium text-ivory mb-6">
                    Book by Phone
                  </h2>
                  <p className="text-ivory/60 mb-6">
                    Call or text us to schedule your appointment. We&apos;ll find the perfect time for you.
                  </p>
                  <a
                    href={`tel:${contact.phoneClean}`}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft hover:shadow-gold transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    Call {contact.phoneFormatted}
                  </a>
                </div>

                {/* Hours Card */}
                <div className="p-8 bg-bg-card rounded-2xl border border-gold/20">
                  <h2 className="text-2xl font-medium text-ivory mb-6">
                    Studio Hours
                  </h2>
                  <div className="space-y-3">
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
                </div>
              </div>
            )}

            {/* What to Expect */}
            <div className="mt-16">
              <h3 className="text-xl font-medium text-ivory mb-6 text-center">
                What to Expect
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <span className="text-lg font-medium">1</span>
                  </div>
                  <h4 className="font-medium text-ivory mb-2">Book</h4>
                  <p className="text-sm text-ivory/60">Schedule your appointment by phone or online</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose/10 flex items-center justify-center text-rose">
                    <span className="text-lg font-medium">2</span>
                  </div>
                  <h4 className="font-medium text-ivory mb-2">Consult</h4>
                  <p className="text-sm text-ivory/60">We&apos;ll discuss your vision and preferences</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <span className="text-lg font-medium">3</span>
                  </div>
                  <h4 className="font-medium text-ivory mb-2">Transform</h4>
                  <p className="text-sm text-ivory/60">Sit back, relax, and let us work our magic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Quick View */}
      <section className="py-16 bg-bg-soft">
        <div className="container-luxury">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-medium text-ivory mb-4">
              Our Services
            </h2>
            <p className="text-ivory/60">
              Not sure what to book? Check out our full service menu.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {services.categories.map((category) => (
              <Link
                key={category.id}
                href={`/services#${category.id}`}
                className="px-6 py-3 bg-bg-card rounded-lg border border-gold/10 text-ivory hover:border-gold/30 hover:text-gold transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
