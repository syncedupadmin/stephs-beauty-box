import { Metadata } from 'next';
import Link from 'next/link';
import { brand, contact, social, booking, services, policies, hours } from '@/lib/config/brand';

export const metadata: Metadata = {
  title: 'Client Info Needed',
  description: 'Information needed from client to complete the website',
  robots: 'noindex, nofollow', // Don't index this page
};

export default function ClientInfoPage() {
  // Calculate what's missing
  const missingItems = {
    booking: !booking.primaryUrl,
    cashApp: !booking.cashApp,
    zelle: !booking.zelle,
    tiktok: !social.tiktok,
    facebook: !social.facebook,
    googleReviews: !brand, // placeholder
    cancellationFee: !policies.cancellation.fee,
    depositRequired: policies.deposits.required === null,
    depositAmount: !policies.deposits.amount,
  };

  // Count services without prices
  const servicesWithoutPrices = services.categories.flatMap(cat =>
    cat.services.filter(s => s.price === null)
  );

  return (
    <div className="min-h-screen bg-bg py-16">
      <div className="container-luxury max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/10 border border-rose/20 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-rose">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="text-sm text-rose font-medium">Internal Page</span>
          </div>
          <h1 className="text-4xl font-serif text-ivory mb-4">
            Client Information <span className="text-gold">Needed</span>
          </h1>
          <p className="text-ivory/60">
            The following information is needed from the client to complete the website.
          </p>
        </div>

        {/* Priority Items */}
        <div className="space-y-8">
          {/* High Priority */}
          <section className="bg-bg-card border border-rose/20 rounded-xl p-8">
            <h2 className="text-xl font-medium text-rose mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              High Priority
            </h2>

            <div className="space-y-4">
              {/* Booking URL */}
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${missingItems.booking ? 'bg-rose/20 text-rose' : 'bg-green-500/20 text-green-400'}`}>
                  {missingItems.booking ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Online Booking URL</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    Booksy, Square, or other booking platform link (e.g., booksy.com/en-us/stephsbeautybox)
                  </p>
                  {!missingItems.booking && <p className="text-sm text-green-400 mt-2">Current: {booking.primaryUrl}</p>}
                </div>
              </div>

              {/* Service Prices */}
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${servicesWithoutPrices.length > 0 ? 'bg-rose/20 text-rose' : 'bg-green-500/20 text-green-400'}`}>
                  {servicesWithoutPrices.length > 0 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Service Pricing</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    {servicesWithoutPrices.length} services need prices
                  </p>
                  <div className="mt-3 text-sm text-ivory/50">
                    <p className="font-medium mb-2">Services missing prices:</p>
                    <ul className="grid grid-cols-2 gap-1">
                      {servicesWithoutPrices.slice(0, 10).map((s, i) => (
                        <li key={i} className="text-xs">- {s.name}</li>
                      ))}
                      {servicesWithoutPrices.length > 10 && (
                        <li className="text-xs text-rose">...and {servicesWithoutPrices.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gallery Photos */}
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-rose/20 text-rose">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Gallery Photos</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    High-quality photos of work (lashes, hair, makeup, brows)
                  </p>
                  <p className="text-xs text-ivory/40 mt-2">
                    Recommended: 10-20 best photos, at least 1080x1080px
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Medium Priority */}
          <section className="bg-bg-card border border-gold/20 rounded-xl p-8">
            <h2 className="text-xl font-medium text-gold mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Medium Priority
            </h2>

            <div className="space-y-4">
              {/* Payment Methods */}
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${(missingItems.cashApp || missingItems.zelle) ? 'bg-gold/20 text-gold' : 'bg-green-500/20 text-green-400'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Payment Methods</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    Cash App, Zelle, Venmo usernames for deposits/payments
                  </p>
                </div>
              </div>

              {/* Policies */}
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gold/20 text-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Policy Details</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    Confirm or update these policies:
                  </p>
                  <ul className="text-xs text-ivory/50 mt-2 space-y-1">
                    <li>- Cancellation fee amount (currently: not set)</li>
                    <li>- Deposit required? Amount?</li>
                    <li>- Late arrival grace period (currently: 15 min)</li>
                  </ul>
                </div>
              </div>

              {/* Testimonials */}
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gold/20 text-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Client Testimonials</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    3-5 client reviews to feature on homepage
                  </p>
                  <p className="text-xs text-ivory/40 mt-2">
                    Include: client first name, service received, review text
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Nice to Have */}
          <section className="bg-bg-card border border-ivory/10 rounded-xl p-8">
            <h2 className="text-xl font-medium text-ivory/70 mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
              Nice to Have
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-ivory/10 text-ivory/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Additional Social Media</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    TikTok, Facebook, or other platform handles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-ivory/10 text-ivory/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Google Business Link</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    Link to Google Business profile for reviews
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-ivory/10 text-ivory/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Custom Domain</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    Domain to connect (e.g., stephsbeautybox.com)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-bg rounded-lg border border-gold/10">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-ivory/10 text-ivory/50">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-ivory">Additional Logo Formats</h3>
                  <p className="text-sm text-ivory/60 mt-1">
                    Light version, icon/favicon, transparent PNG
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Have */}
          <section className="bg-bg-card border border-green-500/20 rounded-xl p-8">
            <h2 className="text-xl font-medium text-green-400 mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Already Configured
            </h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Business Name:</span>
                <span className="text-ivory ml-2">{brand.name}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Phone:</span>
                <span className="text-ivory ml-2">{contact.phoneFormatted}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Email:</span>
                <span className="text-ivory ml-2">{contact.email}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Address:</span>
                <span className="text-ivory ml-2">{contact.address.full}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Hours:</span>
                <span className="text-ivory ml-2">{hours.summary}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Instagram:</span>
                <span className="text-ivory ml-2">{social.instagram?.handle}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">Threads:</span>
                <span className="text-ivory ml-2">{social.threads?.handle}</span>
              </div>
              <div className="p-3 bg-bg rounded-lg">
                <span className="text-ivory/60">YouTube:</span>
                <span className="text-ivory ml-2">{social.youtube?.handle}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ivory/60 hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
