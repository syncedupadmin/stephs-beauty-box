'use client';

/**
 * Booking Details Page
 * ====================
 * View and manage a single booking
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge, PageLoading, ConfirmModal } from '@/components/admin';

interface Service {
  id: string;
  name: string;
  price_cents: number;
  duration_minutes: number;
  description: string | null;
}

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_notes: string | null;
  admin_notes: string | null;
  start_ts: string;
  end_ts: string;
  status: 'hold' | 'confirmed' | 'cancelled' | 'expired' | 'completed' | 'no_show';
  hold_expires_at: string | null;
  deposit_amount_cents: number | null;
  deposit_paid: boolean;
  stripe_checkout_session_id: string | null;
  services: Service | null;
  created_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
}

const STATUS_ACTIONS: Record<string, { label: string; value: string; variant?: 'danger' }[]> = {
  hold: [
    { label: 'Confirm Booking', value: 'confirmed' },
    { label: 'Cancel', value: 'cancelled', variant: 'danger' },
  ],
  confirmed: [
    { label: 'Mark Completed', value: 'completed' },
    { label: 'Mark No-Show', value: 'no_show', variant: 'danger' },
    { label: 'Cancel', value: 'cancelled', variant: 'danger' },
  ],
  expired: [
    { label: 'Restore & Confirm', value: 'confirmed' },
  ],
  cancelled: [
    { label: 'Restore & Confirm', value: 'confirmed' },
  ],
  completed: [],
  no_show: [
    { label: 'Restore & Confirm', value: 'confirmed' },
  ],
};

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusModal, setStatusModal] = useState<{ open: boolean; status: string; label: string } | null>(null);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  async function fetchBooking() {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`);
      if (response.status === 404) {
        setError('Booking not found');
        return;
      }
      if (!response.ok) throw new Error('Failed to load booking');

      const data = await response.json();
      setBooking(data.booking);
      setAdminNotes(data.booking.admin_notes || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!booking) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update booking');

      const data = await response.json();
      setBooking(data.booking);
      setStatusModal(null);
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotes() {
    if (!booking) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (!response.ok) throw new Error('Failed to save notes');

      const data = await response.json();
      setBooking(data.booking);
    } catch (err) {
      console.error('Save notes error:', err);
      alert('Failed to save notes');
    } finally {
      setSaving(false);
    }
  }

  const formatDateTime = (dateString: string) => {
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
    return <PageLoading message="Loading booking..." />;
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-xl text-ink mb-2">{error || 'Booking not found'}</h2>
        <Link
          href="/admin/bookings"
          className="inline-flex px-4 py-2 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const actions = STATUS_ACTIONS[booking.status] || [];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-xl text-ink">{booking.customer_name}</h2>
            <StatusBadge status={booking.status} />
          </div>
          <p className="text-body-sm font-body text-ink/60">
            Booked on {new Date(booking.created_at).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="text-body-sm font-body text-ink/60 hover:text-ink transition-colors duration-600"
        >
          ← Back
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Details */}
        <div className="bg-off-white p-6 space-y-4">
          <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2">
            Appointment
          </h3>

          <div>
            <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Service</p>
            <p className="text-body-sm font-body text-ink">
              {booking.services?.name || 'Unknown Service'}
            </p>
            {booking.services && (
              <p className="text-overline text-ink/50">
                {booking.services.duration_minutes} min • {formatCurrency(booking.services.price_cents)}
              </p>
            )}
          </div>

          <div>
            <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Date & Time</p>
            <p className="text-body-sm font-body text-ink">
              {formatDateTime(booking.start_ts)}
            </p>
          </div>

          {booking.deposit_amount_cents && (
            <div>
              <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Deposit</p>
              <p className="text-body-sm font-body text-ink">
                {formatCurrency(booking.deposit_amount_cents)}
                <span className={`ml-2 ${booking.deposit_paid ? 'text-botanical' : 'text-clay'}`}>
                  ({booking.deposit_paid ? 'Paid' : 'Pending'})
                </span>
              </p>
            </div>
          )}

          {booking.customer_notes && (
            <div>
              <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Customer Notes</p>
              <p className="text-body-sm font-body text-ink/70 italic">
                "{booking.customer_notes}"
              </p>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className="bg-off-white p-6 space-y-4">
          <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2">
            Customer
          </h3>

          <div>
            <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Name</p>
            <p className="text-body-sm font-body text-ink">{booking.customer_name}</p>
          </div>

          <div>
            <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Phone</p>
            <a
              href={`tel:${booking.customer_phone}`}
              className="text-body-sm font-body text-botanical hover:text-botanical/80"
            >
              {booking.customer_phone}
            </a>
          </div>

          {booking.customer_email && (
            <div>
              <p className="text-overline uppercase tracking-[0.15em] text-ink/50 mb-1">Email</p>
              <a
                href={`mailto:${booking.customer_email}`}
                className="text-body-sm font-body text-botanical hover:text-botanical/80"
              >
                {booking.customer_email}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-off-white p-6">
        <h3 className="font-display text-lg text-ink border-b border-ink/10 pb-2 mb-4">
          Admin Notes
        </h3>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-paper border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20 resize-none"
          placeholder="Add internal notes about this booking..."
        />
        <div className="mt-3">
          <button
            onClick={handleSaveNotes}
            disabled={saving || adminNotes === (booking.admin_notes || '')}
            className="px-4 py-2 bg-ink text-paper text-body-sm font-body hover:bg-ink/90 transition-colors duration-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </div>

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
          message={`Are you sure you want to ${statusModal.label.toLowerCase()} for ${booking.customer_name}?`}
          confirmLabel={statusModal.label}
          variant={statusModal.status === 'cancelled' || statusModal.status === 'no_show' ? 'danger' : 'default'}
          loading={saving}
        />
      )}
    </div>
  );
}
