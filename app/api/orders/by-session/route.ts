import { NextRequest, NextResponse } from 'next/server';
import { getOrderByStripeSession } from '@/lib/db/orders';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * GET /api/orders/by-session
 *
 * Returns order details by Stripe session ID
 * Query params:
 *   - session_id: Stripe checkout session ID
 */

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { error: 'Shop not configured' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'session_id is required' },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByStripeSession(sessionId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Return public order info
    return NextResponse.json({
      orderNumber: order.order_number,
      email: order.customer_email,
      fulfillmentMethod: order.fulfillment_method,
      status: order.status,
    });

  } catch (error) {
    console.error('Failed to get order by session:', error);
    return NextResponse.json(
      { error: 'Failed to get order' },
      { status: 500 }
    );
  }
}
