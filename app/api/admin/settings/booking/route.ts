/**
 * Admin Booking Settings API
 * ==========================
 * Update booking settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// PUT - Update booking settings
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const {
      timezone,
      min_notice_minutes,
      buffer_minutes,
      max_days_out,
      hold_minutes,
      deposits_enabled,
      default_deposit_type,
      default_deposit_value,
    } = body;

    // Build update object
    const updates: Record<string, unknown> = {};
    if (timezone !== undefined) updates.timezone = timezone;
    if (min_notice_minutes !== undefined) updates.min_notice_minutes = min_notice_minutes;
    if (buffer_minutes !== undefined) updates.buffer_minutes = buffer_minutes;
    if (max_days_out !== undefined) updates.max_days_out = max_days_out;
    if (hold_minutes !== undefined) updates.hold_minutes = hold_minutes;
    if (deposits_enabled !== undefined) updates.deposits_enabled = deposits_enabled;
    if (default_deposit_type !== undefined) updates.default_deposit_type = default_deposit_type;
    if (default_deposit_value !== undefined) updates.default_deposit_value = default_deposit_value;

    // Get current settings ID
    const { data: current } = await supabase
      .from('booking_settings')
      .select('id')
      .single();

    if (!current) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('booking_settings')
      .update(updates)
      .eq('id', current.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Booking settings PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
