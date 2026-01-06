/**
 * Stripe Integration
 * ==================
 * Client's own Stripe account (keys via env vars)
 */

import Stripe from 'stripe';

// Check if Stripe is configured
export const isStripeConfigured = !!(
  process.env.STRIPE_SECRET_KEY &&
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// Server-side Stripe instance
export const stripe = isStripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null;

/**
 * Get Stripe client (throws if not configured)
 */
export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      'Stripe is not configured. Please set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.'
    );
  }
  return stripe;
}

/**
 * Get Stripe configuration status
 */
export function getStripeStatus() {
  return {
    configured: isStripeConfigured,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...'
      : 'Not set',
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  };
}

// =============================================================================
// SHOP CHECKOUT
// =============================================================================

export interface CreateShopCheckoutParams {
  items: {
    variantId: string;
    productTitle: string;
    variantTitle?: string;
    priceCents: number;
    quantity: number;
    image?: string;
  }[];
  fulfillmentMethod: 'shipping' | 'pickup';
  shippingCents: number;
  taxCents: number;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Create Stripe checkout session for shop orders
 */
export async function createShopCheckout(
  params: CreateShopCheckoutParams
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  // Build line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.variantTitle
          ? `${item.productTitle} - ${item.variantTitle}`
          : item.productTitle,
        images: item.image ? [item.image] : undefined,
        metadata: {
          variant_id: item.variantId,
        },
      },
      unit_amount: item.priceCents,
    },
    quantity: item.quantity,
  }));

  // Add shipping as line item if applicable
  if (params.shippingCents > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: params.shippingCents,
      },
      quantity: 1,
    });
  }

  // Add tax as line item if applicable
  if (params.taxCents > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Tax',
        },
        unit_amount: params.taxCents,
      },
      quantity: 1,
    });
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    line_items: lineItems,
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      type: 'shop_order',
      fulfillment_method: params.fulfillmentMethod,
      ...params.metadata,
    },
    // Collect shipping address if shipping
    shipping_address_collection: params.fulfillmentMethod === 'shipping'
      ? { allowed_countries: ['US'] }
      : undefined,
    // Allow customer to enter phone
    phone_number_collection: {
      enabled: true,
    },
  };

  return stripe.checkout.sessions.create(sessionParams);
}

// =============================================================================
// BOOKING CHECKOUT
// =============================================================================

export interface CreateBookingCheckoutParams {
  bookingId: string;
  serviceName: string;
  depositAmountCents: number;
  serviceDate: string; // Formatted date/time
  customerEmail?: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create Stripe checkout session for booking deposits
 */
export async function createBookingCheckout(
  params: CreateBookingCheckoutParams
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Deposit: ${params.serviceName}`,
            description: `Appointment on ${params.serviceDate}`,
          },
          unit_amount: params.depositAmountCents,
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: {
      type: 'booking_deposit',
      booking_id: params.bookingId,
    },
    phone_number_collection: {
      enabled: true,
    },
  };

  return stripe.checkout.sessions.create(sessionParams);
}

// =============================================================================
// WEBHOOK HANDLING
// =============================================================================

/**
 * Construct and verify Stripe webhook event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Retrieve a checkout session by ID
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'customer_details'],
  });
}

/**
 * Retrieve payment intent by ID
 */
export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

// =============================================================================
// REFUNDS
// =============================================================================

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amountCents?: number,
  reason?: string
): Promise<Stripe.Refund> {
  const stripe = getStripe();

  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amountCents, // If undefined, refunds the full amount
    reason: 'requested_by_customer',
    metadata: {
      reason: reason || 'Refund requested',
    },
  });
}
