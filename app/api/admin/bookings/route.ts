/**
 * Admin Bookings API
 * ==================
 * List and manage bookings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET - List all bookings with filtering
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        services ( id, name, price_cents, duration_minutes )
      `)
      .order('start_ts', { ascending: true });

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Filter by date range
    if (from) {
      query = query.gte('start_ts', from);
    }
    if (to) {
      query = query.lte('start_ts', to);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ bookings: data });
  } catch (error) {
    console.error('Bookings GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load bookings' },
      { status: 500 }
    );
  }
}
