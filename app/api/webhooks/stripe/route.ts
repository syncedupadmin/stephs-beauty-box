import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, getCheckoutSession } from '@/lib/stripe';
import { createOrder, markOrderPaidWithInventory, getOrderByStripeSession } from '@/lib/db/orders';
import { confirmBookingHold, getBookingByStripeSession } from '@/lib/db/bookings';
import { sendOrderConfirmation, sendBookingConfirmation, sendAdminAlert } from '@/lib/email';
import type Stripe from 'stripe';

/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events:
 * - checkout.session.completed (shop orders and booking deposits)
 */

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Stripe webhook: Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (error) {
    console.error('Stripe webhook: Invalid signature', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const type = metadata.type;

  console.log(`Checkout completed: ${session.id}, type: ${type}`);

  if (type === 'shop_order') {
    await handleShopOrder(session);
  } else if (type === 'booking_deposit') {
    await handleBookingDeposit(session);
  } else {
    console.warn(`Unknown checkout type: ${type}`);
  }
}

/**
 * Handle shop order completion
 */
async function handleShopOrder(session: Stripe.Checkout.Session) {
  // Check if order already exists
  const existingOrder = await getOrderByStripeSession(session.id);
  if (existingOrder) {
    console.log(`Order already exists for session ${session.id}`);
    return;
  }

  // Get full session details
  const fullSession = await getCheckoutSession(session.id);
  const customerDetails = fullSession.customer_details;
  const shippingDetails = fullSession.shipping_details;
  const lineItems = fullSession.line_items?.data || [];

  // Build order items from line items
  const orderItems = lineItems
    .filter(item => item.description !== 'Shipping' && item.description !== 'Tax')
    .map(item => {
      // Extract variant_id from product metadata if available
      const product = item.price?.product;
      const variantId = typeof product === 'object' && product && 'metadata' in product
        ? (product.metadata as Record<string, string>)?.variant_id || ''
        : '';

      return {
        variant_id: variantId,
        product_title: item.description || 'Unknown Product',
        variant_title: undefined,
        sku: undefined,
        quantity: item.quantity || 1,
        price_cents: item.amount_total || 0,
      };
    });

  // Get fulfillment method from metadata
  const fulfillmentMethod = (session.metadata?.fulfillment_method || 'pickup') as 'shipping' | 'pickup';

  // Calculate totals
  const subtotalCents = parseInt(session.metadata?.subtotal_cents || '0', 10);
  const shippingLine = lineItems.find(item => item.description === 'Shipping');
  const taxLine = lineItems.find(item => item.description === 'Tax');
  const shippingCents = shippingLine?.amount_total || 0;
  const taxCents = taxLine?.amount_total || 0;
  const totalCents = session.amount_total || 0;

  // Create order
  const order = await createOrder({
    stripe_checkout_session_id: session.id,
    customer_email: customerDetails?.email || session.customer_email || '',
    customer_name: customerDetails?.name || undefined,
    customer_phone: customerDetails?.phone || undefined,
    fulfillment_method: fulfillmentMethod,
    shipping_address_line1: shippingDetails?.address?.line1 || undefined,
    shipping_address_line2: shippingDetails?.address?.line2 || undefined,
    shipping_city: shippingDetails?.address?.city || undefined,
    shipping_state: shippingDetails?.address?.state || undefined,
    shipping_postal_code: shippingDetails?.address?.postal_code || undefined,
    shipping_country: shippingDetails?.address?.country || 'US',
    subtotal_cents: subtotalCents,
    shipping_cents: shippingCents,
    tax_cents: taxCents,
    total_cents: totalCents,
    items: orderItems,
  });

  console.log(`Order created: ${order.order_number}`);

  // Mark as paid and decrement inventory
  const inventoryResult = await markOrderPaidWithInventory(
    order.id,
    session.payment_intent as string
  );

  // Send emails
  try {
    await sendOrderConfirmation(order);

    // If inventory issues, alert admin
    if (!inventoryResult.success) {
      await sendAdminAlert({
        type: 'inventory_issue',
        orderId: order.id,
        orderNumber: order.order_number,
        message: `Inventory issue with order #${order.order_number}. Items: ${inventoryResult.failedItems.map(i => i.productTitle).join(', ')}`,
      });
    }
  } catch (emailError) {
    console.error('Failed to send order emails:', emailError);
    // Don't fail the webhook - order is already created
  }
}

/**
 * Handle booking deposit completion
 */
async function handleBookingDeposit(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.booking_id;

  if (!bookingId) {
    console.error('No booking_id in session metadata');
    return;
  }

  // Confirm the booking hold
  const confirmed = await confirmBookingHold(
    bookingId,
    session.id,
    session.payment_intent as string
  );

  if (!confirmed) {
    console.error(`Failed to confirm booking ${bookingId} - hold may have expired`);

    // Alert admin
    await sendAdminAlert({
      type: 'booking_issue',
      bookingId,
      message: `Booking hold expired before payment completed. Session: ${session.id}`,
    });

    return;
  }

  console.log(`Booking confirmed: ${bookingId}`);

  // Get booking details and send confirmation
  try {
    const booking = await getBookingByStripeSession(session.id);
    if (booking) {
      await sendBookingConfirmation(booking);
    }
  } catch (emailError) {
    console.error('Failed to send booking confirmation:', emailError);
  }
}

/**
 * Handle expired checkout sessions
 */
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const type = session.metadata?.type;

  // Booking holds will auto-expire via the janitor function
  // No action needed here, but we could log it
  console.log(`Checkout session expired: ${session.id}, type: ${type}`);
}
