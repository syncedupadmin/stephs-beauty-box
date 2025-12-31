import Link from 'next/link';
import { brand, contact, policies } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms and conditions for ${brand.name} beauty services.`,
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding-sm bg-ivory">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="headline-display text-ink mb-4">Terms of Service</h1>
            <p className="text-ink/60">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">1. Agreement to Terms</h2>
              <p className="text-ink/70 leading-relaxed">
                By booking an appointment with {brand.name}, you agree to be bound by these Terms of Service
                and our studio policies. If you do not agree to these terms, please do not book our services.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">2. Services</h2>
              <div className="text-ink/70 leading-relaxed space-y-4">
                <p>
                  {brand.name} provides beauty services including but not limited to lash extensions,
                  makeup artistry, hair styling, and brow services. Service availability and pricing
                  may vary and are subject to change without notice.
                </p>
                <p>
                  Results may vary based on individual factors including natural lash condition, skin type,
                  and hair texture. We will discuss expectations during your consultation.
                </p>
              </div>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">3. Appointments & Cancellations</h2>
              <div className="text-ink/70 leading-relaxed space-y-4">
                <p>
                  By booking an appointment, you agree to arrive on time and provide at least{' '}
                  <span className="text-sage font-medium">{policies.cancellation.notice}</span> notice
                  for cancellations or reschedules.
                </p>
                {policies.cancellation.fee && (
                  <p>
                    Late cancellations or no-shows may be subject to a fee of {policies.cancellation.fee}.
                  </p>
                )}
                <p>
                  {policies.lateness.policy}
                </p>
              </div>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">4. Health & Safety</h2>
              <div className="text-ink/70 leading-relaxed space-y-4">
                <p>
                  It is your responsibility to inform us of any allergies, sensitivities, medical conditions,
                  or medications that may affect your service. If you experience any adverse reactions,
                  please contact us immediately.
                </p>
                <p>
                  We maintain high standards of hygiene and sanitation. All tools and equipment are properly
                  sterilized between clients.
                </p>
              </div>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">5. Payment</h2>
              <div className="text-ink/70 leading-relaxed space-y-4">
                <p>
                  Full payment is due at the time of service unless otherwise arranged. We accept cash
                  and major payment methods.
                </p>
                {policies.deposits.required && (
                  <p>
                    A deposit of {policies.deposits.amount} may be required for certain services and
                    will be applied to your service total.
                  </p>
                )}
                <p>
                  Prices are subject to change. You will be informed of any price changes before your service.
                </p>
              </div>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">6. Satisfaction</h2>
              <p className="text-ink/70 leading-relaxed">
                Your satisfaction is important to us. If you are not completely happy with your service,
                please let us know during your appointment so we can make adjustments. Contact us within
                48 hours if you have any concerns after your service.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">7. Photos & Social Media</h2>
              <p className="text-ink/70 leading-relaxed">
                With your permission, we may photograph your completed look for our portfolio and social media.
                You may opt out at any time. We will not share any personal information without your consent.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">8. Limitation of Liability</h2>
              <p className="text-ink/70 leading-relaxed">
                {brand.name} shall not be liable for any indirect, incidental, or consequential damages
                arising from our services. Our total liability shall not exceed the amount paid for
                the service in question.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">9. Changes to Terms</h2>
              <p className="text-ink/70 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting. Your continued booking of services constitutes acceptance
                of any modified terms.
              </p>
            </div>

            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="font-editorial text-xl text-sage mb-4">10. Contact Information</h2>
              <div className="text-ink/70 leading-relaxed">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p>
                    Phone:{' '}
                    <a href={`tel:${contact.phoneClean}`} className="text-sage hover:text-sage-dark">
                      {contact.phoneFormatted}
                    </a>
                  </p>
                  <p>Location: {contact.address.full}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-ivory">
        <div className="container-editorial text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ink/60 hover:text-sage transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
