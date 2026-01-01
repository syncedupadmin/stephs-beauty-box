import { Metadata } from 'next';
import Link from 'next/link';
import { brand, contact } from '@/lib/config/brand';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${brand.name}.`,
};

/**
 * PRIVACY PAGE - EDITORIAL LEGAL
 * ===============================
 * Design: Clean editorial typography
 * - No cards, no rounded corners
 * - Hairline dividers
 * - Editorial spacing
 */

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <h1 className="font-display text-display-lg text-ink leading-[0.9] mb-6">
              Privacy Policy
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
              <h2 className="font-display text-xl text-ink mb-4">1. Information We Collect</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="space-y-2 ml-4">
                  <li>Name and contact information (phone number)</li>
                  <li>Appointment preferences and history</li>
                  <li>Service preferences (lash style, skin type, etc.)</li>
                  <li>Communications with our team</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">2. How We Use Your Information</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="space-y-2 ml-4">
                  <li>Schedule and manage your appointments</li>
                  <li>Send appointment reminders and confirmations</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Personalize your beauty experience</li>
                  <li>Send service updates and special offers (with your consent)</li>
                  <li>Improve our services</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">3. Information Sharing</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
                <p>We do not sell your personal information. We may share your information with:</p>
                <ul className="space-y-2 ml-4">
                  <li><strong className="text-ink">Service Providers:</strong> Companies that help us operate our business (appointment scheduling, communications)</li>
                  <li><strong className="text-ink">Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">4. Data Security</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                We take reasonable measures to protect your personal information from unauthorized access,
                disclosure, alteration, or destruction. However, no internet transmission is completely secure.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">5. Your Rights</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed space-y-4">
                <p>You have the right to:</p>
                <ul className="space-y-2 ml-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at{' '}
                  <a href={`tel:${contact.phoneClean}`} className="text-botanical hover:opacity-70 transition-opacity duration-600">
                    {contact.phoneFormatted}
                  </a>
                </p>
              </div>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">6. Changes to This Policy</h2>
              <p className="text-ink/60 text-body-md font-body leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </div>

            <div>
              <div className="divider-hairline mb-6" />
              <h2 className="font-display text-xl text-ink mb-4">7. Contact Us</h2>
              <div className="text-ink/60 text-body-md font-body leading-relaxed">
                <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
                <p>
                  <a href={`tel:${contact.phoneClean}`} className="text-botanical hover:opacity-70 transition-opacity duration-600">
                    {contact.phoneFormatted}
                  </a>
                </p>
                <p className="text-ink/40 mt-2">{contact.address.city}, {contact.address.state}</p>
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
