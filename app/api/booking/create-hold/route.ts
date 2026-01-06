import { NextRequest, NextResponse } from 'next/server';
import { createBookingHold, getServiceById, getBookingSettings, confirmBookingHold } from '@/lib/db/bookings';
import { calculateDeposit } from '@/lib/db/settings';
import { createBookingCheckout } from '@/lib/stripe';
import { isSupabaseConfigured } from '@/lib/supabase';
import { sendSimpleBookingConfirmation } from '@/lib/email';

/**
 * POST /api/booking/create-hold
 *
 * Creates a booking hold for a time slot.
 * If deposits are enabled, creates a Stripe checkout session.
 *
 * Body:
 *   - serviceId: UUID of the service
 *   - startTime: ISO timestamp of the slot start
 *   - customerName: string
 *   - customerPhone: string
 *   - customerEmail?: string
 *   - customerNotes?: string
 */

interface CreateHoldBody {
  serviceId: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNotes?: string;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { success: false, error: 'Booking system not configured' },
      { status: 503 }
    );
  }

  let body: CreateHoldBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { serviceId, startTime, customerName, customerPhone, customerEmail, customerNotes } = body;

  // Validate required fields
  if (!serviceId || !startTime || !customerName || !customerPhone) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: serviceId, startTime, customerName, customerPhone' },
      { status: 400 }
    );
  }

  try {
    // Get service and settings
    const [service, settings] = await Promise.all([
      getServiceById(serviceId),
      getBookingSettings(),
    ]);

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Booking settings not configured' },
        { status: 503 }
      );
    }

    // Calculate end time based on service duration
    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.duration_minutes * 60 * 1000);

    // Calculate deposit amount (async function that checks service-specific and default settings)
    const depositAmount = await calculateDeposit(service.price_cents, serviceId) || 0;

    // Create the booking hold
    const holdResult = await createBookingHold({
      serviceId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      customerName,
      customerPhone,
      customerEmail,
      customerNotes,
      depositAmountCents: depositAmount,
      holdMinutes: settings.hold_minutes,
    });

    if (!holdResult.success || !holdResult.bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: holdResult.error || 'Failed to create booking hold',
          errorMessage: holdResult.error || 'This time slot is no longer available. Please select another time.',
        },
        { status: 409 }
      );
    }

    // If no deposit required, confirm the booking immediately
    if (depositAmount === 0) {
      await confirmBookingHold(holdResult.bookingId);

      // Send confirmation email (non-blocking)
      if (customerEmail) {
        sendSimpleBookingConfirmation({
          to: customerEmail,
          customerName,
          serviceName: service.name,
          dateTime: start,
          duration: service.duration_minutes,
          depositPaid: 0,
        }).catch(err => console.error('Failed to send booking confirmation:', err));
      }

      return NextResponse.json({
        success: true,
        bookingId: holdResult.bookingId,
        depositRequired: false,
      });
    }

    // Format date for display
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const formattedDate = dateFormatter.format(start);

    // Build URLs
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${siteUrl}/book/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteUrl}/book`;

    // Create Stripe checkout for deposit
    try {
      const checkoutSession = await createBookingCheckout({
        bookingId: holdResult.bookingId,
        serviceName: service.name,
        depositAmountCents: depositAmount,
        serviceDate: formattedDate,
        customerEmail: customerEmail || undefined,
        customerName,
        successUrl,
        cancelUrl,
      });

      if (!checkoutSession.url) {
        throw new Error('No checkout URL returned');
      }

      return NextResponse.json({
        success: true,
        bookingId: holdResult.bookingId,
        depositRequired: true,
        depositAmount,
        checkoutUrl: checkoutSession.url,
      });
    } catch (stripeError) {
      console.error('Stripe checkout error:', stripeError);
      // Note: The hold will auto-expire
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create payment session',
          errorMessage: 'Unable to process payment. Please try again.',
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Failed to create booking hold:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
        errorMessage: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
