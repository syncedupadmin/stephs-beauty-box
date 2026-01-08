/**
 * Admin Shop Settings API
 * =======================
 * Update shop settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// PUT - Update shop settings
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const {
      shipping_enabled,
      pickup_enabled,
      pickup_address,
      pickup_hours,
      pickup_instructions,
      flat_shipping_rate_cents,
      free_shipping_threshold_cents,
      tax_mode,
      tax_rate_percent,
    } = body;

    // Build update object
    const updates: Record<string, unknown> = {};
    if (shipping_enabled !== undefined) updates.shipping_enabled = shipping_enabled;
    if (pickup_enabled !== undefined) updates.pickup_enabled = pickup_enabled;
    if (pickup_address !== undefined) updates.pickup_address = pickup_address;
    if (pickup_hours !== undefined) updates.pickup_hours = pickup_hours;
    if (pickup_instructions !== undefined) updates.pickup_instructions = pickup_instructions;
    if (flat_shipping_rate_cents !== undefined) updates.flat_shipping_rate_cents = flat_shipping_rate_cents;
    if (free_shipping_threshold_cents !== undefined) updates.free_shipping_threshold_cents = free_shipping_threshold_cents;
    if (tax_mode !== undefined) updates.tax_mode = tax_mode;
    if (tax_rate_percent !== undefined) updates.tax_rate_percent = tax_rate_percent;

    // Get current settings ID
    const { data: current } = await supabase
      .from('shop_settings')
      .select('id')
      .single();

    if (!current) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('shop_settings')
      .update(updates)
      .eq('id', current.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Shop settings PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
