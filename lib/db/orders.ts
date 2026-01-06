// @ts-nocheck
/**
 * Order Database Operations
 * =========================
 * Server-side operations for orders and order items
 *
 * Note: Type checking disabled until database types are properly generated
 */

import { getSupabase } from '@/lib/supabase';
import type { Order, OrderItem, OrderWithItems, FulfillmentMethod, OrderStatus } from '@/types/database';

/**
 * Create a new order
 */
export async function createOrder(order: {
  stripe_checkout_session_id: string;
  customer_email: string;
  customer_name?: string;
  customer_phone?: string;
  fulfillment_method: FulfillmentMethod;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  items: {
    variant_id: string;
    product_title: string;
    variant_title?: string;
    sku?: string;
    quantity: number;
    price_cents: number;
  }[];
}): Promise<OrderWithItems> {
  const supabase = getSupabase(true);

  // Create order
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      stripe_checkout_session_id: order.stripe_checkout_session_id,
      customer_email: order.customer_email,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      fulfillment_method: order.fulfillment_method,
      shipping_address_line1: order.shipping_address_line1,
      shipping_address_line2: order.shipping_address_line2,
      shipping_city: order.shipping_city,
      shipping_state: order.shipping_state,
      shipping_postal_code: order.shipping_postal_code,
      shipping_country: order.shipping_country || 'US',
      subtotal_cents: order.subtotal_cents,
      shipping_cents: order.shipping_cents,
      tax_cents: order.tax_cents,
      total_cents: order.total_cents,
      status: 'pending',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = order.items.map(item => ({
    order_id: newOrder.id,
    variant_id: item.variant_id,
    product_title: item.product_title,
    variant_title: item.variant_title,
    sku: item.sku,
    quantity: item.quantity,
    price_cents: item.price_cents,
    total_cents: item.quantity * item.price_cents,
  }));

  const { data: insertedItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  if (itemsError) throw itemsError;

  return {
    ...newOrder,
    items: insertedItems || [],
  };
}

/**
 * Get order by Stripe checkout session ID
 */
export async function getOrderByStripeSession(sessionId: string): Promise<OrderWithItems | null> {
  const supabase = getSupabase(true);

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_checkout_session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) throw itemsError;

  return {
    ...order,
    items: items || [],
  };
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<OrderWithItems | null> {
  const supabase = getSupabase(true);

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) throw itemsError;

  return {
    ...order,
    items: items || [],
  };
}

/**
 * Get order by order number (for customer lookup)
 */
export async function getOrderByNumber(orderNumber: number): Promise<OrderWithItems | null> {
  const supabase = getSupabase(true);

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  if (itemsError) throw itemsError;

  return {
    ...order,
    items: items || [],
  };
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<Order> {
  const supabase = getSupabase(true);

  const updateData: Partial<Order> = { status };

  if (notes) {
    updateData.status_notes = notes;
  }

  if (status === 'paid') {
    updateData.paid_at = new Date().toISOString();
  }

  if (status === 'shipped' || status === 'delivered') {
    updateData.fulfilled_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark order as paid and decrement inventory
 * Returns list of items that failed to decrement (oversold)
 */
export async function markOrderPaidWithInventory(
  orderId: string,
  stripePaymentIntentId?: string
): Promise<{ success: boolean; failedItems: { variantId: string; productTitle: string }[] }> {
  const supabase = getSupabase(true);

  // Get order with items
  const order = await getOrder(orderId);
  if (!order) throw new Error('Order not found');

  const failedItems: { variantId: string; productTitle: string }[] = [];

  // Decrement inventory for each item
  for (const item of order.items) {
    if (!item.variant_id) continue;

    const { data: decremented } = await supabase.rpc('decrement_inventory_safe', {
      p_variant_id: item.variant_id,
      p_quantity: item.quantity,
    });

    if (!decremented) {
      failedItems.push({
        variantId: item.variant_id,
        productTitle: item.product_title,
      });
    }
  }

  // Update order status
  const newStatus: OrderStatus = failedItems.length > 0 ? 'needs_attention' : 'paid';
  const notes = failedItems.length > 0
    ? `Inventory issue: ${failedItems.map(i => i.productTitle).join(', ')}`
    : undefined;

  await supabase
    .from('orders')
    .update({
      status: newStatus,
      status_notes: notes,
      stripe_payment_intent_id: stripePaymentIntentId,
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  return {
    success: failedItems.length === 0,
    failedItems,
  };
}

/**
 * Get recent orders (for admin)
 */
export async function getRecentOrders(limit = 50): Promise<OrderWithItems[]> {
  const supabase = getSupabase(true);

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  if (!orders?.length) return [];

  const orderIds = orders.map(o => o.id);

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) throw itemsError;

  return orders.map(order => ({
    ...order,
    items: items?.filter(i => i.order_id === order.id) || [],
  }));
}

/**
 * Get orders needing attention
 */
export async function getOrdersNeedingAttention(): Promise<OrderWithItems[]> {
  const supabase = getSupabase(true);

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'needs_attention')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!orders?.length) return [];

  const orderIds = orders.map(o => o.id);

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .in('order_id', orderIds);

  if (itemsError) throw itemsError;

  return orders.map(order => ({
    ...order,
    items: items?.filter(i => i.order_id === order.id) || [],
  }));
}
