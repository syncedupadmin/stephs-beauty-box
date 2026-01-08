'use client';

/**
 * Admin Dashboard Page
 * ====================
 * Main dashboard with stats and recent activity
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard, StatusBadge, PageLoading, CardSkeleton } from '@/components/admin';

interface DashboardData {
  stats: {
    bookings: {
      total: number;
      confirmed: number;
      today: number;
      thisWeek: number;
    };
    orders: {
      total: number;
      pending: number;
      paidThisMonth: number;
      revenueThisMonth: number;
    };
    catalog: {
      services: number;
      products: number;
    };
  };
  recentBookings: Array<{
    id: string;
    customer_name: string;
    customer_email: string;
    start_ts: string;
    status: string;
    services: { name: string } | null;
  }>;
  recentOrders: Array<{
    id: string;
    order_number: number;
    customer_name: string;
    customer_email: string;
    total_cents: number;
    status: string;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to load dashboard');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <PageLoading message="Loading dashboard..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 p-6 text-center">
        <p className="text-red-700 font-body">{error || 'Failed to load dashboard'}</p>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Bookings"
          value={data.stats.bookings.today}
          subtitle={`${data.stats.bookings.thisWeek} this week`}
          icon={<CalendarIcon />}
        />
        <StatsCard
          title="Pending Orders"
          value={data.stats.orders.pending}
          subtitle={`${data.stats.orders.total} total orders`}
          icon={<OrdersIcon />}
        />
        <StatsCard
          title="Month Revenue"
          value={formatCurrency(data.stats.orders.revenueThisMonth)}
          subtitle={`${data.stats.orders.paidThisMonth} orders paid`}
          icon={<RevenueIcon />}
        />
        <StatsCard
          title="Active Services"
          value={data.stats.catalog.services}
          subtitle={`${data.stats.catalog.products} products`}
          icon={<CatalogIcon />}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-off-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
            <h2 className="font-display text-lg text-ink">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-body-sm font-body text-botanical hover:text-botanical/80 transition-colors duration-600"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink/5">
            {data.recentBookings.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-body-sm font-body text-ink/50">No bookings yet</p>
              </div>
            ) : (
              data.recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block px-6 py-4 hover:bg-ink/[0.02] transition-colors duration-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-body text-ink truncate">
                        {booking.customer_name}
                      </p>
                      <p className="text-overline text-ink/50 mt-1">
                        {booking.services?.name || 'Unknown service'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={booking.status as 'confirmed' | 'hold' | 'cancelled' | 'expired' | 'completed' | 'no_show'} />
                      <span className="text-overline text-ink/40">
                        {formatDate(booking.start_ts)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-off-white">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
            <h2 className="font-display text-lg text-ink">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-body-sm font-body text-botanical hover:text-botanical/80 transition-colors duration-600"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink/5">
            {data.recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-body-sm font-body text-ink/50">No orders yet</p>
              </div>
            ) : (
              data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block px-6 py-4 hover:bg-ink/[0.02] transition-colors duration-600"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-body text-ink truncate">
                        #{order.order_number} - {order.customer_name || order.customer_email}
                      </p>
                      <p className="text-overline text-ink/50 mt-1">
                        {formatCurrency(order.total_cents)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={order.status as 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'refunded' | 'needs_attention'} />
                      <span className="text-overline text-ink/40">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/services/new"
          className="flex items-center gap-3 bg-off-white px-6 py-4 hover:bg-ink/[0.02] transition-colors duration-600"
        >
          <div className="w-10 h-10 bg-botanical/10 text-botanical flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-body-sm font-body text-ink">Add Service</p>
            <p className="text-overline text-ink/40">Create new service</p>
          </div>
        </Link>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-3 bg-off-white px-6 py-4 hover:bg-ink/[0.02] transition-colors duration-600"
        >
          <div className="w-10 h-10 bg-botanical/10 text-botanical flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="text-body-sm font-body text-ink">Add Product</p>
            <p className="text-overline text-ink/40">Create new product</p>
          </div>
        </Link>

        <Link
          href="/admin/settings/availability"
          className="flex items-center gap-3 bg-off-white px-6 py-4 hover:bg-ink/[0.02] transition-colors duration-600"
        >
          <div className="w-10 h-10 bg-botanical/10 text-botanical flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-body-sm font-body text-ink">Set Hours</p>
            <p className="text-overline text-ink/40">Update availability</p>
          </div>
        </Link>

        <Link
          href="/admin/settings/shop"
          className="flex items-center gap-3 bg-off-white px-6 py-4 hover:bg-ink/[0.02] transition-colors duration-600"
        >
          <div className="w-10 h-10 bg-botanical/10 text-botanical flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-body-sm font-body text-ink">Shop Settings</p>
            <p className="text-overline text-ink/40">Shipping & tax</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Dashboard Icons
function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  );
}
