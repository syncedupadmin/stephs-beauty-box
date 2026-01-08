'use server';

/**
 * Auth Server Actions
 * ===================
 * Login, logout, and admin user management
 */

import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Login admin user
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResult> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Login failed' };
  }

  // Use service role client to bypass RLS for admin check
  const serviceClient = await createServiceRoleClient();

  // Fetch all admin users and filter in JS (workaround for Supabase .eq() UUID issue)
  const { data: allAdmins } = await serviceClient
    .from('admin_users')
    .select('id, auth_id, is_active');

  const adminUser = allAdmins?.find(
    (admin) => admin.auth_id === data.user.id && admin.is_active === true
  );

  if (!adminUser) {
    // Sign out if not an admin
    await supabase.auth.signOut();
    return { success: false, error: 'Access denied. Not an admin user.' };
  }

  // Update last login
  await serviceClient
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('auth_id', data.user.id);

  revalidatePath('/admin', 'layout');
  return { success: true };
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath('/admin', 'layout');
  redirect('/admin/login');
}

/**
 * Create a new admin user (requires existing admin)
 */
export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: string = 'admin'
): Promise<{ success: boolean; error?: string; userId?: string }> {
  const supabase = await createServiceRoleClient();

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || 'Failed to create user' };
  }

  // Create admin_users record
  const { error: adminError } = await supabase.from('admin_users').insert({
    auth_id: authData.user.id,
    email,
    name,
    role,
    is_active: true,
  });

  if (adminError) {
    // Rollback: delete auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { success: false, error: adminError.message };
  }

  return { success: true, userId: authData.user.id };
}

/**
 * Update admin user password
 */
export async function updateAdminPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServiceRoleClient();

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
