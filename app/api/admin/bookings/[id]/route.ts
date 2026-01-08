/**
 * Admin Booking API - Single Booking
 * ====================================
 * GET, PUT for individual booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single booking
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services ( id, name, price_cents, duration_minutes, description )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking: data });
  } catch (error) {
    console.error('Booking GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load booking' },
      { status: 500 }
    );
  }
}

// PUT - Update booking status or notes
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const { status, admin_notes } = body;

    // Build update object
    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;

      // Set timestamps based on status change
      if (status === 'confirmed') {
        updates.confirmed_at = new Date().toISOString();
      } else if (status === 'cancelled') {
        updates.cancelled_at = new Date().toISOString();
      }
    }

    if (admin_notes !== undefined) {
      updates.admin_notes = admin_notes;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        services ( id, name, price_cents, duration_minutes )
      `)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking: data });
  } catch (error) {
    console.error('Booking PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
