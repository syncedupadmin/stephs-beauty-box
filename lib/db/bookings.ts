// @ts-nocheck
/**
 * Booking Database Operations
 * ===========================
 * Server-side operations for services, availability, and bookings
 *
 * Note: Type checking disabled until database types are properly
 * generated from the live Supabase schema using:
 * npx supabase gen types typescript --project-id <project-id> > types/database.ts
 */

import { getSupabase } from '@/lib/supabase';
import type {
  Service,
  ServiceWithDeposit,
  ServiceDeposit,
  AvailabilityRule,
  BlackoutDate,
  Booking,
  BookingWithService,
  BookingSettings,
  AvailableSlot,
} from '@/types/database';

// Type helpers for Supabase query results
type SupabaseError = { code?: string; message: string } | null;
type QueryResult<T> = { data: T | null; error: SupabaseError };

// =============================================================================
// SERVICES
// =============================================================================

/**
 * Get all active services with deposit info
 */
export async function getServices(): Promise<ServiceWithDeposit[]> {
  const supabase = getSupabase();

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('position') as { data: Service[] | null; error: Error | null };

  if (error) throw error;
  if (!services?.length) return [];

  // Get deposit overrides
  const serviceIds = services.map(s => s.id);
  const { data: deposits, error: depositsError } = await supabase
    .from('service_deposits')
    .select('*')
    .in('service_id', serviceIds) as QueryResult<ServiceDeposit[]>;

  if (depositsError) throw depositsError;

  return services.map(service => ({
    ...service,
    deposit: deposits?.find(d => d.service_id === service.id),
  }));
}

/**
 * Get all active services grouped by category
 */
export async function getServicesGroupedByCategory(): Promise<{
  category: string;
  services: Service[];
}[]> {
  const supabase = getSupabase();

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('position') as { data: Service[] | null; error: Error | null };

  if (error) throw error;
  if (!services?.length) return [];

  // Group by category
  const grouped: Record<string, Service[]> = {};
  for (const service of services) {
    const cat = service.category || 'Other Services';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(service);
  }

  // Convert to array and sort by first service position in each category
  return Object.entries(grouped)
    .map(([category, services]) => ({ category, services }))
    .sort((a, b) => (a.services[0]?.position || 0) - (b.services[0]?.position || 0));
}

/**
 * Get a single service by ID
 */
export async function getServiceById(serviceId: string): Promise<ServiceWithDeposit | null> {
  return getService(serviceId);
}

export async function getService(serviceId: string): Promise<ServiceWithDeposit | null> {
  const supabase = getSupabase();

  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .eq('is_active', true)
    .single() as QueryResult<Service>;

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!service) return null;

  const { data: deposit } = await supabase
    .from('service_deposits')
    .select('*')
    .eq('service_id', serviceId)
    .single() as QueryResult<ServiceDeposit>;

  return {
    ...service,
    deposit: deposit || undefined,
  };
}

// =============================================================================
// AVAILABILITY
// =============================================================================

/**
 * Get all availability rules
 */
export async function getAvailabilityRules(): Promise<AvailabilityRule[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .order('day_of_week');

  if (error) throw error;
  return data || [];
}

/**
 * Get blackout dates
 */
export async function getBlackoutDates(
  startDate: Date,
  endDate: Date
): Promise<BlackoutDate[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('blackout_dates')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0]);

  if (error) throw error;
  return data || [];
}

/**
 * Get available slots for a service on a date
 */
export async function getAvailableSlots(
  serviceId: string,
  date: Date
): Promise<AvailableSlot[]> {
  const supabase = getSupabase();

  const dateStr = date.toISOString().split('T')[0];

  const { data, error } = await supabase.rpc('get_available_slots', {
    p_service_id: serviceId,
    p_date: dateStr,
  });

  if (error) throw error;
  if (!data?.length) return [];

  // Get booking settings for timezone
  const settings = await getBookingSettings();

  return data.map(slot => {
    const start = new Date(slot.slot_start);
    const end = new Date(slot.slot_end);

    // Format time in configured timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: settings?.timezone || 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return {
      start,
      end,
      formatted: formatter.format(start),
    };
  });
}

/**
 * Get available dates for a service (dates that have at least one slot)
 * @param serviceId - The service ID
 * @param maxDaysOut - Number of days to look ahead (from settings)
 * @returns Array of date strings in YYYY-MM-DD format
 */
export async function getAvailableDates(
  serviceId: string,
  maxDaysOut: number
): Promise<string[]> {
  const availableDates: string[] = [];
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + maxDaysOut);

  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const slots = await getAvailableSlots(serviceId, current);
    if (slots.length > 0) {
      availableDates.push(current.toISOString().split('T')[0]);
    }
    current.setDate(current.getDate() + 1);
  }

  return availableDates;
}

// =============================================================================
// BOOKINGS
// =============================================================================

/**
 * Create a booking hold
 */
export async function createBookingHold(params: {
  serviceId: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerNotes?: string;
  depositAmountCents?: number;
  holdMinutes?: number;
}): Promise<{
  success: boolean;
  bookingId?: string;
  error?: string;
  holdExpiresAt?: Date;
}> {
  const supabase = getSupabase(true);

  // Call the RPC function to atomically create the hold
  const { data, error } = await supabase.rpc('create_booking_hold', {
    p_service_id: params.serviceId,
    p_start_ts: params.startTime,
    p_customer_name: params.customerName,
    p_customer_phone: params.customerPhone,
    p_customer_email: params.customerEmail || null,
    p_customer_notes: params.customerNotes || null,
  });

  if (error) {
    console.error('Error creating booking hold:', error);
    return { success: false, error: error.message };
  }

  const result = data?.[0];
  if (!result) {
    return { success: false, error: 'Unknown error creating booking' };
  }

  if (!result.success) {
    return {
      success: false,
      error: result.error_message || 'Time slot not available',
    };
  }

  // Update booking with additional info (deposit amount, end time)
  if (result.booking_id) {
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        end_ts: params.endTime,
        deposit_amount_cents: params.depositAmountCents || 0,
      })
      .eq('id', result.booking_id);

    if (updateError) {
      console.error('Error updating booking with deposit info:', updateError);
    }
  }

  return {
    success: true,
    bookingId: result.booking_id || undefined,
    holdExpiresAt: result.hold_expires_at ? new Date(result.hold_expires_at) : undefined,
  };
}

/**
 * Confirm a booking hold (after payment or for no-deposit bookings)
 */
export async function confirmBookingHold(
  bookingId: string,
  stripeSessionId?: string,
  stripePaymentIntentId?: string
): Promise<boolean> {
  const supabase = getSupabase(true);

  // If we have Stripe info, use the RPC function
  if (stripeSessionId) {
    const { data, error } = await supabase.rpc('confirm_booking_hold', {
      p_booking_id: bookingId,
      p_stripe_session_id: stripeSessionId,
      p_stripe_payment_intent_id: stripePaymentIntentId || null,
    });

    if (error) throw error;
    return data;
  }

  // For no-deposit bookings, just update status directly
  const { error } = await supabase
    .from('bookings')
    .update({
      status: 'confirmed',
      hold_expires_at: null,
      deposit_paid: true,
      confirmed_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .eq('status', 'hold');

  if (error) throw error;
  return true;
}

/**
 * Get booking by ID
 */
export async function getBooking(bookingId: string): Promise<BookingWithService | null> {
  const supabase = getSupabase(true);

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  let service: Service | null = null;
  if (booking.service_id) {
    const { data: serviceData } = await supabase
      .from('services')
      .select('*')
      .eq('id', booking.service_id)
      .single();
    service = serviceData;
  }

  return {
    ...booking,
    service,
  };
}

/**
 * Get booking by Stripe session ID
 */
export async function getBookingByStripeSession(sessionId: string): Promise<BookingWithService | null> {
  const supabase = getSupabase(true);

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('stripe_checkout_session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  let service: Service | null = null;
  if (booking.service_id) {
    const { data: serviceData } = await supabase
      .from('services')
      .select('*')
      .eq('id', booking.service_id)
      .single();
    service = serviceData;
  }

  return {
    ...booking,
    service,
  };
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  adminNotes?: string
): Promise<Booking> {
  const supabase = getSupabase(true);

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      admin_notes: adminNotes,
      cancelled_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Release expired holds
 */
export async function releaseExpiredHolds(): Promise<number> {
  const supabase = getSupabase(true);

  const { data, error } = await supabase.rpc('release_expired_holds');

  if (error) throw error;
  return data;
}

/**
 * Get upcoming bookings (for admin)
 */
export async function getUpcomingBookings(limit = 50): Promise<BookingWithService[]> {
  const supabase = getSupabase(true);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .in('status', ['confirmed', 'hold'])
    .gte('start_ts', new Date().toISOString())
    .order('start_ts')
    .limit(limit);

  if (error) throw error;
  if (!bookings?.length) return [];

  // Get services
  const serviceIds = [...new Set(bookings.map(b => b.service_id).filter(Boolean))];
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .in('id', serviceIds);

  return bookings.map(booking => ({
    ...booking,
    service: services?.find(s => s.id === booking.service_id) || null,
  }));
}

/**
 * Get bookings for a specific date range
 */
export async function getBookingsInRange(
  startDate: Date,
  endDate: Date
): Promise<BookingWithService[]> {
  const supabase = getSupabase(true);

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('start_ts', startDate.toISOString())
    .lte('start_ts', endDate.toISOString())
    .order('start_ts');

  if (error) throw error;
  if (!bookings?.length) return [];

  const serviceIds = [...new Set(bookings.map(b => b.service_id).filter(Boolean))];
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .in('id', serviceIds);

  return bookings.map(booking => ({
    ...booking,
    service: services?.find(s => s.id === booking.service_id) || null,
  }));
}

// =============================================================================
// SETTINGS
// =============================================================================

/**
 * Get booking settings
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

  // Get existing settings to get ID
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

/**
 * Check if booking system is properly configured
 */
export async function isBookingConfigured(): Promise<{
  configured: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    const settings = await getBookingSettings();
    if (!settings) {
      issues.push('Booking settings not found');
      return { configured: false, issues };
    }

    if (settings.deposits_enabled && !settings.stripe_configured) {
      issues.push('Deposits enabled but Stripe not configured');
    }

    // Check if any services exist
    const services = await getServices();
    if (services.length === 0) {
      issues.push('No services configured');
    }

    // Check availability rules
    const rules = await getAvailabilityRules();
    const activeRules = rules.filter(r => r.is_active);
    if (activeRules.length === 0) {
      issues.push('No availability rules configured');
    }

    return {
      configured: issues.length === 0,
      issues,
    };
  } catch (error) {
    issues.push('Database connection error');
    return { configured: false, issues };
  }
}
