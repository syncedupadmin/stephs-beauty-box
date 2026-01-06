import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/db/bookings';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * GET /api/booking/available-slots
 *
 * Returns available time slots for a service on a specific date
 * Query params:
 *   - serviceId: UUID of the service
 *   - date: Date string (YYYY-MM-DD)
 */

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Booking system not configured', slots: [] },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('serviceId');
  const date = searchParams.get('date');

  if (!serviceId) {
    return NextResponse.json(
      { error: 'serviceId is required', slots: [] },
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json(
      { error: 'date is required', slots: [] },
      { status: 400 }
    );
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD', slots: [] },
      { status: 400 }
    );
  }

  try {
    // Convert string date to Date object
    const dateObj = new Date(date + 'T00:00:00');
    const slots = await getAvailableSlots(serviceId, dateObj);

    return NextResponse.json({ slots });

  } catch (error) {
    console.error('Failed to get available slots:', error);
    return NextResponse.json(
      { error: 'Failed to get available slots', slots: [] },
      { status: 500 }
    );
  }
}
