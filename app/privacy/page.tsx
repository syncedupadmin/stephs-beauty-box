import { Metadata } from 'next';
import Link from 'next/link';
import { brand, contact } from '@/lib/config/brand';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy policy for ${brand.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg py-16">
      <div className="container-luxury max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-ivory mb-4">Privacy Policy</h1>
          <p className="text-ivory/60">Last updated: December 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-gold max-w-none space-y-8">
          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">1. Information We Collect</h2>
            <div className="text-ivory/80 leading-relaxed space-y-4">
              <p>We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (phone number)</li>
                <li>Appointment preferences and history</li>
                <li>Service preferences (lash style, skin type, etc.)</li>
                <li>Communications with our team</li>
                <li>Beauty Concierge quiz responses</li>
              </ul>
            </div>
          </section>

          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">2. How We Use Your Information</h2>
            <div className="text-ivory/80 leading-relaxed space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Schedule and manage your appointments</li>
                <li>Send appointment reminders and confirmations</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Personalize your beauty experience</li>
                <li>Send service updates and special offers (with your consent)</li>
                <li>Improve our services</li>
              </ul>
            </div>
          </section>

          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">3. Information Sharing</h2>
            <div className="text-ivory/80 leading-relaxed space-y-4">
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Companies that help us operate our business (appointment scheduling, communications)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </div>
          </section>

          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">4. Data Security</h2>
            <p className="text-ivory/80 leading-relaxed">
              We take reasonable measures to protect your personal information from unauthorized access,
              disclosure, alteration, or destruction. However, no internet transmission is completely secure.
            </p>
          </section>

          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">5. Your Rights</h2>
            <div className="text-ivory/80 leading-relaxed space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{' '}
                <a href={`tel:${contact.phoneClean}`} className="text-gold hover:text-gold-soft">
                  {contact.phoneFormatted}
                </a>
              </p>
            </div>
          </section>

          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">6. Changes to This Policy</h2>
            <p className="text-ivory/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="bg-bg-card border border-gold/10 rounded-xl p-8">
            <h2 className="text-xl font-serif text-gold mb-4">7. Contact Us</h2>
            <div className="text-ivory/80 leading-relaxed">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="mt-4 space-y-2">
                <p>
                  Phone:{' '}
                  <a href={`tel:${contact.phoneClean}`} className="text-gold hover:text-gold-soft">
                    {contact.phoneFormatted}
                  </a>
                </p>
                <p>Location: {contact.address.city}, {contact.address.state}</p>
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
