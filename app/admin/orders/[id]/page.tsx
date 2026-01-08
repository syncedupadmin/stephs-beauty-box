'use client';

/**
 * Order Details Page
 * ==================
 * View and manage a single order
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge, PageLoading, ConfirmModal } from '@/components/admin';

interface OrderItem {
  id: string;
  product_title: string;
  variant_title: string | null;
  sku: string | null;
  quantity: number;
  price_cents: number;
  total_cents: number;
}

interface Order {
  id: string;
  order_number: number;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  fulfillment_method: 'shipping' | 'pickup';
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'needs_attention';
  status_notes: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
  paid_at: string | null;
  fulfilled_at: string | null;
  order_items: OrderItem[];
}

const STATUS_ACTIONS: Record<string, { label: string; value: string; variant?: 'danger' }[]> = {
  pending: [
    { label: 'Mark as Paid', value: 'paid' },
    { label: 'Cancel Order', value: 'cancelled', variant: 'danger' },
  ],
  paid: [
    { label: 'Start Processing', value: 'processing' },
    { label: 'Mark as Shipped', value: 'shipped' },
    { label: 'Refund', value: 'refunded', variant: 'danger' },
  ],
  processing: [
    { label: 'Mark as Shipped', value: 'shipped' },
    { label: 'Cancel Order', value: 'cancelled', variant: 'danger' },
  ],
  shipped: [
    { label: 'Mark Delivered', value: 'delivered' },
  ],
  delivered: [],
  cancelled: [],
  refunded: [],
  needs_attention: [
    { label: 'Mark as Paid', value: 'paid' },
    { label: 'Cancel Order', value: 'cancelled', variant: 'danger' },
  ],
};

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusModal, setStatusModal] = useState<{ open: boolean; status: string; label: string } | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      if (response.status === 404) {
        setError('Order not found');
        return;
      }
      if (!response.ok) throw new Error('Failed to load order');

      const data = await response.json();
      setOrder(data.order);
      setTrackingNumber(data.order.tracking_number || '');
      setTrackingUrl(data.order.tracking_url || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!order) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order');

      const data = await response.json();
      setOrder(data.order);
      setStatusModal(null);
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTracking() {
    if (!order) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracking_number: trackingNumber || null,
          tracking_url: trackingUrl || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to save tracking');

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      console.error('Save tracking error:', err);
      alert('Failed to save tracking information');
    } finally {
      setSaving(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
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

  if (loading) {
    return <PageLoading message="Loading order..." />;
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-xl text-ink mb-2">{error || 'Order not found'}</h2>
        <Link
          href="/admin/orders"
          className="inline-flex px-4 py-2 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const actions = STATUS_ACTIONS[order.status] || [];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-xl text-ink">Order #{order.order_number}</h2>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-body-sm font-body text-ink/60">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="text-body-sm font-body text-ink/60 hover:text-ink transition-colors duration-600"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-off-white p-6">
          <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
            Items
          </h3>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-start justify-between">
                <div>
                  <p className="text-body-sm font-body text-ink">{item.product_title}</p>
                  {item.variant_title && item.variant_title !== 'Default' && (
                    <p className="text-overline text-ink/50">{item.variant_title}</p>
                  )}
                  {item.sku && (
                    <p className="text-overline text-ink/40">SKU: {item.sku}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-body-sm font-body text-ink">
                    {formatCurrency(item.price_cents)} × {item.quantity}
                  </p>
                  <p className="text-body-sm font-body text-ink/70">
                    {formatCurrency(item.total_cents)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-ink/10 mt-6 pt-4 space-y-2">
            <div className="flex justify-between text-body-sm font-body">
              <span className="text-ink/60">Subtotal</span>
              <span className="text-ink">{formatCurrency(order.subtotal_cents)}</span>
            </div>
            {order.shipping_cents > 0 && (
              <div className="flex justify-between text-body-sm font-body">
                <span className="text-ink/60">Shipping</span>
                <span className="text-ink">{formatCurrency(order.shipping_cents)}</span>
              </div>
            )}
            {order.tax_cents > 0 && (
              <div className="flex justify-between text-body-sm font-body">
                <span className="text-ink/60">Tax</span>
                <span className="text-ink">{formatCurrency(order.tax_cents)}</span>
              </div>
            )}
            <div className="flex justify-between text-body-sm font-body font-medium pt-2 border-t border-ink/10">
              <span className="text-ink">Total</span>
              <span className="text-ink">{formatCurrency(order.total_cents)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-off-white p-6">
            <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
              Customer
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Name</p>
                <p className="text-body-sm font-body text-ink">{order.customer_name || 'Guest'}</p>
              </div>
              <div>
                <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Email</p>
                <a
                  href={`mailto:${order.customer_email}`}
                  className="text-body-sm font-body text-botanical hover:text-botanical/80"
                >
                  {order.customer_email}
                </a>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Phone</p>
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="text-body-sm font-body text-botanical hover:text-botanical/80"
                  >
                    {order.customer_phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shipping/Pickup */}
          <div className="bg-off-white p-6">
            <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
              {order.fulfillment_method === 'shipping' ? 'Shipping Address' : 'Pickup'}
            </h3>
            {order.fulfillment_method === 'shipping' && order.shipping_address_line1 ? (
              <div className="text-body-sm font-body text-ink space-y-1">
                <p>{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                <p>
                  {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                </p>
                <p>{order.shipping_country}</p>
              </div>
            ) : (
              <p className="text-body-sm font-body text-ink/60">
                Customer will pick up at store
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tracking Information (for shipped orders) */}
      {(order.status === 'shipped' || order.status === 'delivered' || order.fulfillment_method === 'shipping') && (
        <div className="bg-off-white p-6">
          <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
            Tracking Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                placeholder="e.g., 1Z999AA10123456784"
              />
            </div>
            <div>
              <label className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
                Tracking URL
              </label>
              <input
                type="url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSaveTracking}
              disabled={saving}
              className="px-4 py-2 bg-ink text-paper text-body-sm font-body hover:bg-ink/90 transition-colors duration-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Tracking'}
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="bg-off-white p-6">
          <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
            Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <button
                key={action.value}
                onClick={() => setStatusModal({ open: true, status: action.value, label: action.label })}
                className={`px-4 py-2 text-body-sm font-body transition-colors duration-600 ${
                  action.variant === 'danger'
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-botanical text-paper hover:bg-botanical/90'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {statusModal && (
        <ConfirmModal
          isOpen={statusModal.open}
          onClose={() => setStatusModal(null)}
          onConfirm={() => handleStatusChange(statusModal.status)}
          title={statusModal.label}
          message={`Are you sure you want to ${statusModal.label.toLowerCase()} for order #${order.order_number}?`}
          confirmLabel={statusModal.label}
          variant={
            statusModal.status === 'cancelled' || statusModal.status === 'refunded'
              ? 'danger'
              : 'default'
          }
          loading={saving}
        />
      )}
    </div>
  );
}
