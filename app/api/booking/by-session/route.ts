import { NextRequest, NextResponse } from 'next/server';
import { getBookingByStripeSession } from '@/lib/db/bookings';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * GET /api/booking/by-session
 *
 * Returns booking details by Stripe session ID
 * Query params:
 *   - session_id: Stripe checkout session ID
 */

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Booking system not configured' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'session_id is required' },
      { status: 400 }
    );
  }

  try {
    const booking = await getBookingByStripeSession(sessionId);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Return public booking info
    return NextResponse.json({
      bookingId: booking.id,
      serviceName: booking.service?.name,
      dateTime: booking.start_ts,
      duration: booking.service?.duration_minutes,
      customerName: booking.customer_name,
      depositPaid: booking.deposit_amount_cents || 0,
      status: booking.status,
    });

  } catch (error) {
    console.error('Failed to get booking by session:', error);
    return NextResponse.json(
      { error: 'Failed to get booking' },
      { status: 500 }
    );
  }
}
