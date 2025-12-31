import Link from 'next/link';
import { brand, policies, contact } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Policies',
  description: `Studio policies and guidelines for ${brand.name}.`,
};

export default function PoliciesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding-sm bg-ivory">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">Studio Guidelines</p>
            <h1 className="headline-display text-ink mb-6">
              Our Policies
            </h1>
            <p className="body-large text-ink/70 max-w-xl mx-auto">
              Please review our policies to ensure a smooth experience.
            </p>
          </div>
        </div>
      </section>

      {/* Policies Content */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Cancellation Policy */}
            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="headline-subsection text-ink mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cancellation Policy
              </h2>
              <p className="text-ink/70 leading-relaxed">
                We understand that life happens and schedules change. However, when you book an appointment,
                we reserve that time specifically for you. Please provide at least{' '}
                <span className="text-sage font-medium">{policies.cancellation.notice}</span> notice
                if you need to cancel or reschedule your appointment.
              </p>
              {policies.cancellation.fee && (
                <p className="text-ink/50 mt-4 text-sm">
                  Late cancellations or no-shows may be subject to a fee of {policies.cancellation.fee}.
                </p>
              )}
            </div>

            {/* Late Arrival Policy */}
            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="headline-subsection text-ink mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Late Arrival
              </h2>
              <p className="text-ink/70 leading-relaxed">
                We strive to keep all appointments running on time. {policies.lateness.policy}
              </p>
              <p className="text-ink/50 mt-4 text-sm">
                Please plan to arrive a few minutes early to get settled and ensure you receive
                your full service time.
              </p>
            </div>

            {/* Deposits */}
            {policies.deposits.required && (
              <div className="p-8 bg-ivory rounded-subtle">
                <h2 className="headline-subsection text-ink mb-4 flex items-center gap-3">
                  <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  Deposits
                </h2>
                <p className="text-ink/70 leading-relaxed">
                  A deposit of <span className="text-sage font-medium">{policies.deposits.amount}</span> may
                  be required at the time of booking for certain services. This deposit will be applied
                  to your service total.
                </p>
              </div>
            )}

            {/* General Guidelines */}
            <div className="p-8 bg-ivory rounded-subtle">
              <h2 className="headline-subsection text-ink mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                General Guidelines
              </h2>
              <ul className="space-y-3 text-ink/70">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Please come with clean, product-free lashes/hair for lash and hair services.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>For makeup services, please arrive with a clean, moisturized face.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Reference photos are always welcome and encouraged!</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Children are welcome but must be supervised at all times.</span>
                </li>
              </ul>
            </div>

            {/* Contact for Questions */}
            <div className="text-center p-8 bg-sage/5 rounded-subtle">
              <p className="text-ink/60 mb-4">
                Have questions about our policies?
              </p>
              <a
                href={`tel:${contact.phoneClean}`}
                className="inline-flex items-center gap-2 text-sage hover:text-sage-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call us at {contact.phoneFormatted}
              </a>
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
