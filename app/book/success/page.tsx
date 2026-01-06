'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * BOOKING SUCCESS PAGE
 * ====================
 * Displayed after successful booking (with or without deposit)
 */

interface BookingDetails {
  serviceName?: string;
  dateTime?: string;
  duration?: number;
  customerName?: string;
  depositPaid?: number;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get('id');
  const sessionId = searchParams.get('session_id'); // From Stripe redirect

  // Fetch booking details
  useEffect(() => {
    if (!bookingId && !sessionId) {
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const endpoint = sessionId
          ? `/api/booking/by-session?session_id=${sessionId}`
          : `/api/booking/${bookingId}`;

        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setBookingDetails(data);
        }
      } catch (err) {
        console.error('Failed to fetch booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, sessionId]);

  // Format date/time for display
  const formattedDateTime = bookingDetails?.dateTime
    ? new Date(bookingDetails.dateTime).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <section className="pt-32 pb-20">
      <div className="container-editorial">
        <div className="max-w-xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-botanical/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-botanical"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="overline mb-4">Appointment Confirmed</p>
          <h1 className="font-display text-display-md text-ink mb-6 leading-[0.95]">
            You&apos;re All<br />
            <span className="font-editorial-italic">Set</span>
          </h1>

          {loading ? (
            <div className="animate-pulse space-y-4 mb-10">
              <div className="h-6 bg-ink/10 w-2/3 mx-auto" />
              <div className="h-4 bg-ink/10 w-1/2 mx-auto" />
            </div>
          ) : bookingDetails ? (
            <div className="bg-off-white/50 p-8 mb-10 text-left">
              <h3 className="font-display text-xl text-ink mb-4">
                {bookingDetails.serviceName || 'Your Appointment'}
              </h3>

              <div className="space-y-3 text-body-md font-body">
                {formattedDateTime && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">When</span>
                    <span className="text-ink">{formattedDateTime}</span>
                  </div>
                )}
                {bookingDetails.duration && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Duration</span>
                    <span className="text-ink">~{bookingDetails.duration} minutes</span>
                  </div>
                )}
                {bookingDetails.depositPaid !== undefined && bookingDetails.depositPaid > 0 && (
                  <>
                    <div className="divider-hairline my-4" />
                    <div className="flex justify-between">
                      <span className="text-ink/60">Deposit Paid</span>
                      <span className="text-botanical">
                        ${(bookingDetails.depositPaid / 100).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-ink/60 text-body-lg font-body mb-10">
              Your appointment has been confirmed. We look forward to seeing you!
            </p>
          )}

          {/* Important Info */}
          <div className="bg-off-white/50 p-6 mb-10 text-left">
            <h4 className="font-display text-lg text-ink mb-3">What&apos;s Next</h4>
            <ul className="text-ink/60 text-body-sm font-body space-y-2">
              <li>
                <span className="text-botanical mr-2">•</span>
                You&apos;ll receive a confirmation email with all the details
              </li>
              <li>
                <span className="text-botanical mr-2">•</span>
                Please arrive 5-10 minutes before your appointment
              </li>
              <li>
                <span className="text-botanical mr-2">•</span>
                Need to reschedule? Contact us at least 24 hours in advance
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="cta-primary">
              Book Another Appointment
            </Link>
            <Link href="/" className="cta-secondary">
              Return Home
            </Link>
          </div>

          {/* Support */}
          <p className="text-ink/40 text-body-sm font-body mt-12">
            Questions about your appointment?{' '}
            <Link href="/contact" className="text-botanical hover:opacity-70">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
