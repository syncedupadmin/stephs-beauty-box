// @ts-nocheck
/**
 * Settings Database Operations
 * ============================
 * Server-side operations for shop and booking settings
 *
 * Note: Type checking disabled until database types are properly generated
 */

import { getSupabase } from '@/lib/supabase';
import type { ShopSettings, BookingSettings } from '@/types/database';

// =============================================================================
// SHOP SETTINGS
// =============================================================================

/**
 * Get shop settings
 */
export async function getShopSettings(): Promise<ShopSettings | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('shop_settings')
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Update shop settings
 */
export async function updateShopSettings(
  settings: Partial<ShopSettings>
): Promise<ShopSettings> {
  const supabase = getSupabase(true);

  const existing = await getShopSettings();
  if (!existing) throw new Error('Shop settings not initialized');

  const { data, error } = await supabase
    .from('shop_settings')
    .update(settings)
    .eq('id', existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if shop is properly configured for checkout
 */
export async function isShopConfigured(): Promise<{
  configured: boolean;
  canShip: boolean;
  canPickup: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    const settings = await getShopSettings();
    if (!settings) {
      return {
        configured: false,
        canShip: false,
        canPickup: false,
        issues: ['Shop settings not found'],
      };
    }

    const canShip = settings.shipping_enabled && (
      settings.flat_shipping_rate_cents !== null ||
      settings.free_shipping_threshold_cents !== null
    );

    const canPickup = settings.pickup_enabled && !!settings.pickup_address;

    if (!settings.stripe_configured) {
      issues.push('Stripe not configured');
    }

    if (!settings.shipping_enabled && !settings.pickup_enabled) {
      issues.push('Neither shipping nor pickup is enabled');
    }

    if (settings.shipping_enabled && settings.flat_shipping_rate_cents === null) {
      issues.push('Shipping enabled but no rate configured');
    }

    if (settings.pickup_enabled && !settings.pickup_address) {
      issues.push('Pickup enabled but no address configured');
    }

    return {
      configured: issues.length === 0 && (canShip || canPickup),
      canShip,
      canPickup,
      issues,
    };
  } catch (error) {
    return {
      configured: false,
      canShip: false,
      canPickup: false,
      issues: ['Database connection error'],
    };
  }
}

/**
 * Calculate shipping cost based on settings
 */
export async function calculateShipping(subtotalCents: number): Promise<number> {
  const settings = await getShopSettings();
  if (!settings || !settings.shipping_enabled) return 0;

  // Check for free shipping threshold
  if (
    settings.free_shipping_threshold_cents &&
    subtotalCents >= settings.free_shipping_threshold_cents
  ) {
    return 0;
  }

  return settings.flat_shipping_rate_cents || 0;
}

/**
 * Calculate tax based on settings
 */
export async function calculateTax(subtotalCents: number): Promise<number> {
  const settings = await getShopSettings();
  if (!settings || settings.tax_mode === 'none' || !settings.tax_rate_percent) {
    return 0;
  }

  // Calculate tax (round to nearest cent)
  return Math.round(subtotalCents * (settings.tax_rate_percent / 100));
}

// =============================================================================
// BOOKING SETTINGS
// =============================================================================

/**
 * Get booking settings (exported from bookings.ts, but also available here)
 */
export async function getBookingSettings(): Promise<BookingSettings | null> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('booking_settings')
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data;
}

/**
 * Update booking settings
 */
export async function updateBookingSettings(
  settings: Partial<BookingSettings>
): Promise<BookingSettings> {
  const supabase = getSupabase(true);

  const existing = await getBookingSettings();
  if (!existing) throw new Error('Booking settings not initialized');

  const { data, error } = await supabase
    .from('booking_settings')
    .update(settings)
    .eq('id', existing.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =============================================================================
// COMBINED STATUS CHECK
// =============================================================================

/**
 * Get overall system configuration status
 */
export async function getSystemStatus(): Promise<{
  shop: {
    configured: boolean;
    canShip: boolean;
    canPickup: boolean;
    issues: string[];
  };
  booking: {
    configured: boolean;
    issues: string[];
  };
  stripe: boolean;
  email: boolean;
}> {
  const shopStatus = await isShopConfigured();

  // Check booking configuration
  const bookingSettings = await getBookingSettings();
  const bookingIssues: string[] = [];

  if (!bookingSettings) {
    bookingIssues.push('Booking settings not found');
  } else if (bookingSettings.deposits_enabled && !bookingSettings.stripe_configured) {
    bookingIssues.push('Deposits enabled but Stripe not configured');
  }

  // Check Stripe
  const stripeConfigured = !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );

  // Check email (Resend)
  const emailConfigured = !!(
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM
  );

  return {
    shop: shopStatus,
    booking: {
      configured: bookingIssues.length === 0,
      issues: bookingIssues,
    },
    stripe: stripeConfigured,
    email: emailConfigured,
  };
}

// =============================================================================
// DEPOSIT CALCULATION
// =============================================================================

/**
 * Calculate deposit amount for a service
 */
export async function calculateDeposit(
  servicePriceCents: number,
  serviceId?: string
): Promise<number | null> {
  const supabase = getSupabase();
  const settings = await getBookingSettings();

  if (!settings?.deposits_enabled) {
    return null; // No deposit required
  }

  // Check for service-specific deposit
  if (serviceId) {
    const { data: serviceDeposit } = await supabase
      .from('service_deposits')
      .select('*')
      .eq('service_id', serviceId)
      .single();

    if (serviceDeposit) {
      if (serviceDeposit.deposit_type === 'flat') {
        return Math.round(serviceDeposit.deposit_value * 100); // Convert to cents
      } else {
        return Math.round(servicePriceCents * serviceDeposit.deposit_value / 100);
      }
    }
  }

  // Use default deposit
  if (settings.default_deposit_type === 'flat') {
    return Math.round(settings.default_deposit_value * 100);
  } else {
    return Math.round(servicePriceCents * settings.default_deposit_value / 100);
  }
}
