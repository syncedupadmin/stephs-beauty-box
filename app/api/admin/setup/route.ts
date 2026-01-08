/**
 * Admin Setup API
 * ================
 * One-time endpoint to create the initial admin user
 * Requires a setup key for security
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { setup_key, email, password, name } = body;

    // Verify setup key (use a secret from env vars)
    const expectedKey = process.env.ADMIN_SETUP_KEY || 'StephsBeautyBox2024!';
    if (setup_key !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid setup key' },
        { status: 403 }
      );
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if any admin already exists
    const { count } = await supabase
      .from('admin_users')
      .select('id', { count: 'exact', head: true });

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Admin user already exists. Use the admin panel to add more users.' },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create auth user' },
        { status: 500 }
      );
    }

    // Create admin_users record
    const { error: adminError } = await supabase.from('admin_users').insert({
      auth_id: authData.user.id,
      email,
      name,
      role: 'owner',
      is_active: true,
    });

    if (adminError) {
      // Rollback: delete auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.error('Admin record error:', adminError);
      return NextResponse.json(
        { error: adminError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully. You can now log in at /admin/login',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed' },
      { status: 500 }
    );
  }
}
