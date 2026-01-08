'use client';

/**
 * Orders List Page
 * ================
 * View and manage all orders
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable, StatusBadge, PageLoading, EmptyState } from '@/components/admin';

interface OrderItem {
  id: string;
  product_title: string;
  variant_title: string | null;
  quantity: number;
  price_cents: number;
  total_cents: number;
}

interface Order {
  id: string;
  order_number: number;
  customer_name: string | null;
  customer_email: string;
  fulfillment_method: 'shipping' | 'pickup';
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'needs_attention';
  created_at: string;
  order_items: OrderItem[];
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'needs_attention', label: 'Needs Attention' },
];

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusFilter = searchParams.get('status') || 'all';

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params}`);
      if (!response.ok) throw new Error('Failed to load orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/admin/orders?${params}`);
  };

  if (loading) {
    return <PageLoading message="Loading orders..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 text-center">
        <p className="text-red-700 font-body">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-1.5 text-body-sm font-body transition-colors duration-600 ${
                statusFilter === option.value
                  ? 'bg-botanical text-paper'
                  : 'bg-off-white text-ink/60 hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-body-sm font-body text-ink/60">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description={
            statusFilter !== 'all'
              ? `No ${statusFilter} orders.`
              : 'Orders will appear here once customers start purchasing.'
          }
          icon={<EmptyState.Icons.Orders />}
        />
      ) : (
        <DataTable
          columns={[
            {
              key: 'order_number',
              label: 'Order',
              sortable: true,
              render: (order) => (
                <div>
                  <p className="font-body text-ink">#{order.order_number}</p>
                  <p className="text-overline text-ink/50">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              ),
            },
            {
              key: 'customer_name',
              label: 'Customer',
              sortable: true,
              render: (order) => (
                <div>
                  <p className="font-body text-ink">{order.customer_name || 'Guest'}</p>
                  <p className="text-overline text-ink/50 truncate max-w-[150px]">
                    {order.customer_email}
                  </p>
                </div>
              ),
            },
            {
              key: 'items',
              label: 'Items',
              render: (order) => (
                <span className="text-ink/70">
                  {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              ),
            },
            {
              key: 'fulfillment_method',
              label: 'Fulfillment',
              render: (order) => (
                <span className="capitalize text-ink/70">
                  {order.fulfillment_method}
                </span>
              ),
            },
            {
              key: 'total_cents',
              label: 'Total',
              sortable: true,
              render: (order) => formatCurrency(order.total_cents),
            },
            {
              key: 'status',
              label: 'Status',
              render: (order) => <StatusBadge status={order.status} />,
            },
          ]}
          data={orders}
          keyField="id"
          onRowClick={(order) => router.push(`/admin/orders/${order.id}`)}
        />
      )}
    </div>
  );
}
