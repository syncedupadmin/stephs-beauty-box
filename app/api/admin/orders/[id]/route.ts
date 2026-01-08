/**
 * Admin Order API - Single Order
 * ===============================
 * GET, PUT for individual order
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single order with items
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_title,
          variant_title,
          sku,
          quantity,
          price_cents,
          total_cents
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load order' },
      { status: 500 }
    );
  }
}

// PUT - Update order status, tracking, notes
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const { status, status_notes, tracking_number, tracking_url } = body;

    // Build update object
    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;

      // Set timestamps based on status change
      if (status === 'paid') {
        updates.paid_at = new Date().toISOString();
      } else if (status === 'delivered' || status === 'shipped') {
        updates.fulfilled_at = new Date().toISOString();
      }
    }

    if (status_notes !== undefined) {
      updates.status_notes = status_notes;
    }

    if (tracking_number !== undefined) {
      updates.tracking_number = tracking_number;
    }

    if (tracking_url !== undefined) {
      updates.tracking_url = tracking_url;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        order_items (
          id,
          product_title,
          variant_title,
          sku,
          quantity,
          price_cents,
          total_cents
        )
      `)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
