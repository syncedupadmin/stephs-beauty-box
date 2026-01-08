/**
 * Admin Settings API
 * ==================
 * Get and update shop & booking settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET - Get all settings
export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const [shopResult, bookingResult, availabilityResult, blackoutsResult] = await Promise.all([
      supabase.from('shop_settings').select('*').single(),
      supabase.from('booking_settings').select('*').single(),
      supabase.from('availability_rules').select('*').order('day_of_week'),
      supabase.from('blackout_dates').select('*').order('date'),
    ]);

    return NextResponse.json({
      shop: shopResult.data,
      booking: bookingResult.data,
      availability: availabilityResult.data || [],
      blackouts: blackoutsResult.data || [],
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}
