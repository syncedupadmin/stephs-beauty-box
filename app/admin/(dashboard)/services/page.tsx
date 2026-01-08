'use client';

/**
 * Services List Page
 * ==================
 * View and manage all services
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, StatusBadge, ConfirmModal, PageLoading, EmptyState } from '@/components/admin';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  image_url: string | null;
  is_active: boolean;
  position: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; service: Service | null }>({
    open: false,
    service: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Failed to load services');
      const data = await response.json();
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(service: Service) {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !service.is_active }),
      });

      if (!response.ok) throw new Error('Failed to update service');

      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, is_active: !s.is_active } : s
        )
      );
    } catch (err) {
      console.error('Toggle error:', err);
    }
  }

  async function handleDelete() {
    if (!deleteModal.service) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/services/${deleteModal.service.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete service');
      }

      setServices((prev) => prev.filter((s) => s.id !== deleteModal.service?.id));
      setDeleteModal({ open: false, service: null });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  if (loading) {
    return <PageLoading message="Loading services..." />;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-body-sm font-body text-ink/60">
          {services.length} service{services.length !== 1 ? 's' : ''}
        </p>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-botanical text-paper px-4 py-2 text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Service
        </Link>
      </div>

      {/* Services Table */}
      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Create your first service to start accepting bookings."
          icon={<EmptyState.Icons.Services />}
          action={{
            label: 'Add Service',
            onClick: () => router.push('/admin/services/new'),
          }}
        />
      ) : (
        <DataTable
          columns={[
            {
              key: 'name',
              label: 'Service',
              sortable: true,
              render: (service) => (
                <div className="flex items-center gap-3">
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-ink/5 flex items-center justify-center">
                      <svg className="w-5 h-5 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-body text-ink">{service.name}</p>
                    {service.description && (
                      <p className="text-overline text-ink/50 truncate max-w-[200px]">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'duration_minutes',
              label: 'Duration',
              sortable: true,
              render: (service) => formatDuration(service.duration_minutes),
            },
            {
              key: 'price_cents',
              label: 'Price',
              sortable: true,
              render: (service) => formatCurrency(service.price_cents),
            },
            {
              key: 'is_active',
              label: 'Status',
              render: (service) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleActive(service);
                  }}
                  className="cursor-pointer"
                >
                  <StatusBadge
                    status={service.is_active ? 'success' : 'neutral'}
                    label={service.is_active ? 'Active' : 'Inactive'}
                  />
                </button>
              ),
            },
            {
              key: 'actions',
              label: '',
              className: 'w-24',
              render: (service) => (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/services/${service.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-ink/40 hover:text-ink transition-colors duration-600"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ open: true, service });
                    }}
                    className="p-2 text-ink/40 hover:text-red-600 transition-colors duration-600"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              ),
            },
          ]}
          data={services}
          keyField="id"
          onRowClick={(service) => router.push(`/admin/services/${service.id}`)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, service: null })}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteModal.service?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
