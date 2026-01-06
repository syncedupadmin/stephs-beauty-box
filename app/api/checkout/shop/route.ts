import { NextRequest, NextResponse } from 'next/server';
import { getVariants, validateCartInventory } from '@/lib/db/products';
import { getShopSettings, isShopConfigured, calculateShipping, calculateTax } from '@/lib/db/settings';
import { createShopCheckout, isStripeConfigured } from '@/lib/stripe';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * POST /api/checkout/shop
 *
 * Creates a Stripe Checkout session for shop orders.
 * Validates inventory before creating session.
 */

interface CheckoutItem {
  variantId: string;
  quantity: number;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  fulfillmentMethod?: 'shipping' | 'pickup';
}

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { error: 'Shop is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Payment processing is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Check shop configuration
    const shopStatus = await isShopConfigured();
    if (!shopStatus.configured) {
      return NextResponse.json(
        { error: `Checkout is disabled: ${shopStatus.issues.join(', ')}` },
        { status: 503 }
      );
    }

    // Parse request
    const body: CheckoutRequest = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of body.items) {
      if (!item.variantId || typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Invalid cart items' },
          { status: 400 }
        );
      }
    }

    // Validate inventory
    const inventoryValidation = await validateCartInventory(body.items);
    if (!inventoryValidation.valid) {
      return NextResponse.json(
        {
          error: 'Some items are no longer available in the requested quantity',
          adjustments: inventoryValidation.adjustments,
        },
        { status: 409 }
      );
    }

    // Get variant details
    const variantIds = body.items.map(i => i.variantId);
    const variants = await getVariants(variantIds);

    // Get shop settings
    const settings = await getShopSettings();

    // Determine fulfillment method
    let fulfillmentMethod: 'shipping' | 'pickup' = body.fulfillmentMethod || 'pickup';

    // If only one method is available, use that
    if (shopStatus.canShip && !shopStatus.canPickup) {
      fulfillmentMethod = 'shipping';
    } else if (shopStatus.canPickup && !shopStatus.canShip) {
      fulfillmentMethod = 'pickup';
    }

    // If no fulfillment method specified and both available, redirect to selection
    if (!body.fulfillmentMethod && shopStatus.canShip && shopStatus.canPickup) {
      // Store items in session and redirect to fulfillment selection
      return NextResponse.json({
        requiresFulfillmentSelection: true,
        redirectUrl: '/checkout',
        availableMethods: {
          shipping: shopStatus.canShip,
          pickup: shopStatus.canPickup,
        },
      });
    }

    // Build line items with product data
    const lineItems = body.items.map(item => {
      const variant = variants.find(v => v.id === item.variantId);
      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }

      return {
        variantId: variant.id,
        productTitle: variant.title, // Will be enhanced with product title from join
        variantTitle: variant.title !== 'Default' ? variant.title : undefined,
        priceCents: variant.price_cents,
        quantity: item.quantity,
      };
    });

    // Calculate totals
    const subtotalCents = lineItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
    const shippingCents = fulfillmentMethod === 'shipping' ? await calculateShipping(subtotalCents) : 0;
    const taxCents = await calculateTax(subtotalCents);

    // Create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${request.headers.get('host')}`;

    const session = await createShopCheckout({
      items: lineItems,
      fulfillmentMethod,
      shippingCents,
      taxCents,
      successUrl: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/shop`,
      metadata: {
        type: 'shop_order',
        item_count: body.items.length.toString(),
        subtotal_cents: subtotalCents.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
