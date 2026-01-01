import Link from 'next/link';
import { brand, contact, policies } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms and conditions for ${brand.name} beauty services.`,
};

/**
 * TERMS PAGE - EDITORIAL LEGAL
 * =============================
 * Design: Clean editorial typography
 * - No cards, no rounded corners
 * - Hairline dividers
 * - Editorial spacing
 */

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <h1 className="font-display text-display-lg text-ink leading-[0.9] mb-6">
              Terms of Service
            </h1>
            <p className="text-ink/50 text-body-sm font-body">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 md:pb-32">
        <div className="container-editorial">
          <div className="max-w-2xl space-y-12">
            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">1. Agreement to Terms</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                By booking an appointment with {brand.name}, you agree to be bound by these Terms of Service
                and our studio policies. If you do not agree to these terms, please do not book our services.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">2. Services</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
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

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">3. Appointments & Cancellations</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
                <p>
                  By booking an appointment, you agree to arrive on time and provide at least{' '}
                  <span className="text-botanical">{policies.cancellation.notice}</span> notice
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

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">4. Health & Safety</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
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

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">5. Payment</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
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

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">6. Satisfaction</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                Your satisfaction is important to us. If you are not completely happy with your service,
                please let us know during your appointment so we can make adjustments. Contact us within
                48 hours if you have any concerns after your service.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">7. Photos & Social Media</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                With your permission, we may photograph your completed look for our portfolio and social media.
                You may opt out at any time. We will not share any personal information without your consent.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">8. Limitation of Liability</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                {brand.name} shall not be liable for any indirect, incidental, or consequential damages
                arising from our services. Our total liability shall not exceed the amount paid for
                the service in question.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">9. Changes to Terms</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective
                immediately upon posting. Your continued booking of services constitutes acceptance
                of any modified terms.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">10. Contact Information</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed">
                <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
                <p>
                  <a href={`tel:${contact.phoneClean}`} className="text-botanical hover:opacity-70 transition-opacity duration-600">
                    {contact.phoneFormatted}
                  </a>
                </p>
                <p className="text-ink/40 mt-2">{contact.address.full}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="pb-16">
        <div className="container-editorial">
          <Link href="/" className="editorial-link text-body-md">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
