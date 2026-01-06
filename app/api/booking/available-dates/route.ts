import { NextRequest, NextResponse } from 'next/server';
import { getAvailableDates, getBookingSettings } from '@/lib/db/bookings';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * GET /api/booking/available-dates
 *
 * Returns available dates for booking a service
 * Query params:
 *   - serviceId: UUID of the service
 */

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Booking system not configured', dates: [] },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');

  if (!serviceId) {
    return NextResponse.json(
      { error: 'serviceId is required', dates: [] },
      { status: 400 }
    );
  }

  try {
    const settings = await getBookingSettings();

    if (!settings) {
      return NextResponse.json(
        { error: 'Booking settings not configured', dates: [] },
        { status: 503 }
      );
    }

    const dates = await getAvailableDates(serviceId, settings.max_days_out);

    return NextResponse.json({ dates });

  } catch (error) {
    console.error('Failed to get available dates:', error);
    return NextResponse.json(
      { error: 'Failed to get available dates', dates: [] },
      { status: 500 }
    );
  }
}
