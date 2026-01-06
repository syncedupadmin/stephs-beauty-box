import { NextResponse } from 'next/server';
import { getShopSettings, isShopConfigured } from '@/lib/db/settings';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * GET /api/shop/settings
 *
 * Returns public shop settings for checkout flow
 */

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { canShip: false, canPickup: false },
      { status: 200 }
    );
  }

  try {
    const [settings, status] = await Promise.all([
      getShopSettings(),
      isShopConfigured(),
    ]);

    return NextResponse.json({
      canShip: status.canShip,
      canPickup: status.canPickup,
      pickupAddress: settings?.pickup_address || undefined,
      pickupHours: settings?.pickup_hours || undefined,
      shippingRate: settings?.flat_shipping_rate_cents || undefined,
      freeShippingThreshold: settings?.free_shipping_threshold_cents || undefined,
    });

  } catch (error) {
    console.error('Failed to get shop settings:', error);
    return NextResponse.json(
      { canShip: false, canPickup: false },
      { status: 200 }
    );
  }
}
