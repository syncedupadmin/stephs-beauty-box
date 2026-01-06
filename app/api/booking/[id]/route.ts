import { NextRequest, NextResponse } from 'next/server';
import { getBooking } from '@/lib/db/bookings';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * GET /api/booking/[id]
 *
 * Returns booking details by ID
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Booking system not configured' },
      { status: 503 }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Booking ID is required' },
      { status: 400 }
    );
  }

  try {
    const booking = await getBooking(id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Return public booking info
    return NextResponse.json({
      serviceName: booking.service?.name,
      dateTime: booking.start_ts,
      duration: booking.service?.duration_minutes,
      customerName: booking.customer_name,
      depositPaid: booking.deposit_amount_cents || 0,
      status: booking.status,
    });

  } catch (error) {
    console.error('Failed to get booking:', error);
    return NextResponse.json(
      { error: 'Failed to get booking' },
      { status: 500 }
    );
  }
}
