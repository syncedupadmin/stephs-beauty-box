/**
 * Auth Data Access Layer
 * ======================
 * Secure session verification at every data access point
 * Defense-in-depth: Never rely solely on middleware
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

/**
 * Verify the current session and get user
 * ALWAYS use getUser() not getSession() on server
 */
export const verifySession = cache(async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, isAuthenticated: false };
  }

  return { user, isAuthenticated: true };
});

/**
 * Require admin authentication - redirects if not authenticated
 * Use this in Server Components and Server Actions
 */
export async function requireAdmin(): Promise<AdminUser> {
  const { user, isAuthenticated } = await verifySession();

  if (!isAuthenticated || !user) {
    redirect('/admin/login');
  }

  // Get admin user details from admin_users table
  const supabase = await createServerSupabaseClient();
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role')
    .eq('auth_id', user.id)
    .eq('is_active', true)
    .single();

  if (error || !adminUser) {
    // User is authenticated but not an admin
    redirect('/admin/login?error=not_admin');
  }

  return adminUser as AdminUser;
}

/**
 * Get admin user if authenticated (doesn't redirect)
 * Use this for conditional UI
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const { user, isAuthenticated } = await verifySession();

  if (!isAuthenticated || !user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, email, name, role')
    .eq('auth_id', user.id)
    .eq('is_active', true)
    .single();

  return adminUser as AdminUser | null;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const admin = await getAdminUser();
  if (!admin) return false;
  return admin.role === role || admin.role === 'super_admin';
}
