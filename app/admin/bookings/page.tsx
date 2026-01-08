'use client';

/**
 * Bookings List Page
 * ==================
 * View and manage all bookings
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataTable, StatusBadge, PageLoading, EmptyState } from '@/components/admin';

interface Service {
  id: string;
  name: string;
  price_cents: number;
  duration_minutes: number;
}

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  start_ts: string;
  end_ts: string;
  status: 'hold' | 'confirmed' | 'cancelled' | 'expired' | 'completed' | 'no_show';
  deposit_amount_cents: number | null;
  deposit_paid: boolean;
  services: Service | null;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Bookings' },
  { value: 'hold', label: 'On Hold' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'expired', label: 'Expired' },
  { value: 'no_show', label: 'No Show' },
];

export default function BookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusFilter = searchParams.get('status') || 'all';

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/admin/bookings?${params}`);
      if (!response.ok) throw new Error('Failed to load bookings');
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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
    router.push(`/admin/bookings?${params}`);
  };

  if (loading) {
    return <PageLoading message="Loading bookings..." />;
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description={
            statusFilter !== 'all'
              ? `No ${statusFilter} bookings.`
              : 'Bookings will appear here once customers start booking.'
          }
          icon={<EmptyState.Icons.Bookings />}
        />
      ) : (
        <DataTable
          columns={[
            {
              key: 'customer_name',
              label: 'Customer',
              sortable: true,
              render: (booking) => (
                <div>
                  <p className="font-body text-ink">{booking.customer_name}</p>
                  <p className="text-overline text-ink/50">
                    {booking.customer_phone}
                  </p>
                </div>
              ),
            },
            {
              key: 'services.name',
              label: 'Service',
              render: (booking) => booking.services?.name || 'Unknown',
            },
            {
              key: 'start_ts',
              label: 'Date & Time',
              sortable: true,
              render: (booking) => (
                <div>
                  <p className="font-body text-ink">{formatDate(booking.start_ts)}</p>
                  <p className="text-overline text-ink/50">
                    {formatTime(booking.start_ts)}
                  </p>
                </div>
              ),
            },
            {
              key: 'deposit',
              label: 'Deposit',
              render: (booking) => {
                if (!booking.deposit_amount_cents) return '—';
                return (
                  <div>
                    <p className="font-body text-ink">
                      {formatCurrency(booking.deposit_amount_cents)}
                    </p>
                    <p className="text-overline text-ink/50">
                      {booking.deposit_paid ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                );
              },
            },
            {
              key: 'status',
              label: 'Status',
              render: (booking) => <StatusBadge status={booking.status} />,
            },
          ]}
          data={bookings}
          keyField="id"
          onRowClick={(booking) => router.push(`/admin/bookings/${booking.id}`)}
        />
      )}
    </div>
  );
}
