/**
 * Supabase Client Configuration
 * =============================
 * Server and client Supabase instances for Steph's Beauty Box
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Client-side Supabase instance (limited permissions via RLS)
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null;

// Server-side Supabase instance (full permissions via service role)
export const supabaseAdmin = isSupabaseConfigured && supabaseServiceKey
  ? createClient<Database>(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Get the appropriate Supabase client based on context
 * @param useServiceRole - Whether to use service role (server-side only)
 */
export function getSupabase(useServiceRole = false) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  if (useServiceRole) {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY.');
    }
    return supabaseAdmin;
  }

  return supabase!;
}

/**
 * Configuration status for admin warnings
 */
export function getSupabaseStatus() {
  return {
    configured: isSupabaseConfigured,
    hasServiceRole: !!supabaseServiceKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'Not set',
  };
}
