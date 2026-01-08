/**
 * Admin Services API
 * ==================
 * CRUD operations for services
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET - List all services
export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ services: data });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load services' },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createServiceRoleClient();

    const body = await request.json();
    const { name, description, duration_minutes, price_cents, image_url, is_active } = body;

    // Validate required fields
    if (!name || !duration_minutes || price_cents === undefined) {
      return NextResponse.json(
        { error: 'Name, duration, and price are required' },
        { status: 400 }
      );
    }

    // Get next position
    const { data: maxPos } = await supabase
      .from('services')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const position = (maxPos?.position || 0) + 1;

    const { data, error } = await supabase
      .from('services')
      .insert({
        name,
        description,
        duration_minutes,
        price_cents,
        image_url,
        is_active: is_active ?? true,
        position,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ service: data }, { status: 201 });
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
