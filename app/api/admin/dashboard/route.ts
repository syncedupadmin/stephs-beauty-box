/**
 * Admin Dashboard API
 * ===================
 * Returns stats and recent activity for dashboard
 */

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/dal';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Verify admin access
    await requireAdmin();

    const supabase = await createServiceRoleClient();

    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setMonth(monthStart.getMonth() - 1);

    // Execute all queries in parallel for performance
    const [
      // Booking stats
      totalBookingsResult,
      confirmedBookingsResult,
      todayBookingsResult,
      weekBookingsResult,

      // Order stats
      totalOrdersResult,
      pendingOrdersResult,
      paidOrdersResult,
      monthRevenueResult,

      // Service and product counts
      servicesResult,
      productsResult,

      // Recent activity
      recentBookingsResult,
      recentOrdersResult,
    ] = await Promise.all([
      // Total bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true }),

      // Confirmed bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'confirmed'),

      // Today's bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .gte('start_ts', todayStart.toISOString())
        .in('status', ['hold', 'confirmed']),

      // This week's bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .gte('start_ts', weekStart.toISOString())
        .in('status', ['hold', 'confirmed']),

      // Total orders
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true }),

      // Pending orders (need attention)
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'processing', 'needs_attention']),

      // Paid orders this month
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'paid')
        .gte('created_at', monthStart.toISOString()),

      // Revenue this month (sum of paid orders)
      supabase
        .from('orders')
        .select('total_cents')
        .in('status', ['paid', 'processing', 'shipped', 'delivered'])
        .gte('created_at', monthStart.toISOString()),

      // Active services count
      supabase
        .from('services')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),

      // Active products count
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),

      // Recent bookings
      supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          customer_email,
          start_ts,
          status,
          services ( name )
        `)
        .order('created_at', { ascending: false })
        .limit(5),

      // Recent orders
      supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          customer_email,
          total_cents,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    // Calculate month revenue
    const monthRevenue = monthRevenueResult.data?.reduce(
      (sum, order) => sum + (order.total_cents || 0),
      0
    ) || 0;

    return NextResponse.json({
      stats: {
        bookings: {
          total: totalBookingsResult.count || 0,
          confirmed: confirmedBookingsResult.count || 0,
          today: todayBookingsResult.count || 0,
          thisWeek: weekBookingsResult.count || 0,
        },
        orders: {
          total: totalOrdersResult.count || 0,
          pending: pendingOrdersResult.count || 0,
          paidThisMonth: paidOrdersResult.count || 0,
          revenueThisMonth: monthRevenue,
        },
        catalog: {
          services: servicesResult.count || 0,
          products: productsResult.count || 0,
        },
      },
      recentBookings: recentBookingsResult.data || [],
      recentOrders: recentOrdersResult.data || [],
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}
