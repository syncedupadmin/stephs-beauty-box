/**
 * Admin Availability Settings API
 * ================================
 * Update availability rules and blackout dates
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// PUT - Update availability rules
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const { rules } = body;

    if (!Array.isArray(rules)) {
      return NextResponse.json({ error: 'Rules must be an array' }, { status: 400 });
    }

    // Update each rule
    for (const rule of rules) {
      const { id, start_time, end_time, is_active } = rule;

      const updates: Record<string, unknown> = {};
      if (start_time !== undefined) updates.start_time = start_time;
      if (end_time !== undefined) updates.end_time = end_time;
      if (is_active !== undefined) updates.is_active = is_active;

      await supabase
        .from('availability_rules')
        .update(updates)
        .eq('id', id);
    }

    // Fetch updated rules
    const { data } = await supabase
      .from('availability_rules')
      .select('*')
      .order('day_of_week');

    return NextResponse.json({ rules: data });
  } catch (error) {
    console.error('Availability PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
}

// POST - Add blackout date
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const { date, reason } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blackout_dates')
      .insert({ date, reason })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'This date is already blocked' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ blackout: data }, { status: 201 });
  } catch (error) {
    console.error('Blackout POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add blackout date' },
      { status: 500 }
    );
  }
}

// DELETE - Remove blackout date
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blackout_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blackout DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to remove blackout date' },
      { status: 500 }
    );
  }
}
