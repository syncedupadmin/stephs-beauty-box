/**
 * Debug Auth Endpoint - TEMPORARY
 * ================================
 * Diagnoses admin login issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {},
  };

  try {
    const { email, password } = await request.json();

    // Check 1: Environment variables
    results.checks = {
      ...results.checks as object,
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      },
    };

    // Create service role client (bypasses RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Check 2: Can we query admin_users at all?
    const { data: allAdmins, error: listError } = await supabase
      .from('admin_users')
      .select('id, email, auth_id, is_active, role, name')
      .limit(10);

    results.checks = {
      ...results.checks as object,
      adminUsersTable: {
        success: !listError,
        error: listError?.message || null,
        count: allAdmins?.length || 0,
        records: allAdmins?.map(a => ({
          id: a.id,
          email: a.email,
          auth_id: a.auth_id,
          is_active: a.is_active,
          role: a.role,
          name: a.name,
        })) || [],
      },
    };

    // Check 3: Try to authenticate
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    results.checks = {
      ...results.checks as object,
      authSignIn: {
        success: !authError,
        error: authError?.message || null,
        userId: authData?.user?.id || null,
        userEmail: authData?.user?.email || null,
      },
    };

    if (authData?.user) {
      // Check 4: Look for matching admin_users record (without .single())
      const { data: adminMatch, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_id', authData.user.id);

      // Also try text comparison
      const { data: textMatch, error: textError } = await supabase
        .from('admin_users')
        .select('*')
        .filter('auth_id', 'eq', authData.user.id);

      // Raw SQL check
      const { data: rawMatch, error: rawError } = await supabase
        .rpc('check_admin_auth_id', { p_auth_id: authData.user.id })
        .maybeSingle();

      results.checks = {
        ...results.checks as object,
        adminMatch: {
          success: !adminError,
          error: adminError?.message || null,
          count: adminMatch?.length || 0,
          records: adminMatch || [],
          queryUserId: authData.user.id,
          queryUserIdType: typeof authData.user.id,
        },
        textMatch: {
          success: !textError,
          error: textError?.message || null,
          count: textMatch?.length || 0,
        },
        rawMatch: {
          error: rawError?.message || 'Function may not exist',
          data: rawMatch,
        },
      };

      // Check 5: Try with is_active filter (no .single())
      const { data: activeMatch, error: activeError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .eq('is_active', true);

      results.checks = {
        ...results.checks as object,
        activeAdminMatch: {
          success: !activeError,
          error: activeError?.message || null,
          count: activeMatch?.length || 0,
          records: activeMatch || [],
        },
      };

      // Sign out
      await supabase.auth.signOut();
    }

    // Check 6: List all auth users
    const { data: authUsers, error: authListError } = await supabase.auth.admin.listUsers();

    results.checks = {
      ...results.checks as object,
      authUsers: {
        success: !authListError,
        error: authListError?.message || null,
        count: authUsers?.users?.length || 0,
        users: authUsers?.users?.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
        })) || [],
      },
    };

  } catch (err) {
    results.error = err instanceof Error ? err.message : 'Unknown error';
  }

  return NextResponse.json(results, { status: 200 });
}
