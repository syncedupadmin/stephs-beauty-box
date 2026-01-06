import { getServices } from '@/lib/db/bookings';
import { getBookingSettings, isBookingConfigured } from '@/lib/db/bookings';
import { isSupabaseConfigured } from '@/lib/supabase';
import { BookingWizard } from './BookingWizard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your beauty appointment at Steph\'s Beauty Box. Hair, makeup, lashes, and more.',
};

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * BOOKING PAGE - START THE JOURNEY
 * =================================
 * Multi-step booking wizard:
 * 1. Select service
 * 2. Choose date/time
 * 3. Enter contact info
 * 4. Confirm and pay deposit
 */

export default async function BookPage() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured) {
    return <BookingNotConfigured reason="database" />;
  }

  // Check booking configuration
  const bookingStatus = await isBookingConfigured();

  if (!bookingStatus.configured) {
    return (
      <BookingNotConfigured
        reason="settings"
        issues={bookingStatus.issues}
      />
    );
  }

  // Get services and settings
  let services = [];
  let settings = null;

  try {
    [services, settings] = await Promise.all([
      getServices(),
      getBookingSettings(),
    ]);
  } catch (error) {
    console.error('Booking page error:', error);
    return <BookingNotConfigured reason="error" />;
  }

  if (services.length === 0) {
    return <BookingNotConfigured reason="no_services" />;
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Book Now</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-6">
              Start the<br />
              <span className="font-editorial-italic">Journey</span>
            </h1>
            <p className="text-ink/70 text-body-lg font-body leading-relaxed max-w-md">
              Select a service, choose your time, and secure your appointment with a deposit.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Wizard */}
      <section className="pb-20 md:pb-32">
        <div className="container-editorial">
          <BookingWizard
            services={services}
            settings={settings!}
          />
        </div>
      </section>
    </>
  );
}

// =============================================================================
// FALLBACK COMPONENTS
// =============================================================================

function BookingNotConfigured({
  reason,
  issues = [],
}: {
  reason: 'database' | 'settings' | 'error' | 'no_services';
  issues?: string[];
}) {
  const messages = {
    database: 'Our booking system is being set up.',
    settings: 'Booking is temporarily unavailable.',
    error: 'We encountered an issue loading the booking system.',
    no_services: 'No services are currently available for booking.',
  };

  return (
    <>
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Book Now</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-6">
              Start the<br />
              <span className="font-editorial-italic">Journey</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center py-12">
            <h2 className="font-display text-display-sm text-ink mb-6">
              Booking Unavailable
            </h2>
            <p className="text-ink/60 text-body-lg font-body mb-8">
              {messages[reason]}
            </p>

            {issues.length > 0 && (
              <div className="bg-clay/10 border border-clay/30 p-4 mb-8 text-left">
                <p className="text-clay text-body-sm font-body font-medium mb-2">Admin Notice:</p>
                <ul className="text-clay text-body-sm font-body space-y-1">
                  {issues.map((issue, i) => (
                    <li key={i}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="cta-primary">
                Contact Us to Book
              </Link>
              <Link href="/" className="cta-secondary">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
