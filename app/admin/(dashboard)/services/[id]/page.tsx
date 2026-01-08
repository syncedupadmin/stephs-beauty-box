'use client';

/**
 * Edit Service Page
 * =================
 * Edit an existing service
 */

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { PageLoading } from '@/components/admin';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  image_url: string | null;
  is_active: boolean;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_minutes: 60,
    price: '',
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(`/api/admin/services/${id}`);
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) throw new Error('Failed to load service');

        const data = await response.json();
        const service: Service = data.service;

        setFormData({
          name: service.name,
          description: service.description || '',
          duration_minutes: service.duration_minutes,
          price: (service.price_cents / 100).toFixed(2),
          image_url: service.image_url || '',
          is_active: service.is_active,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Convert price to cents
      const price_cents = Math.round(parseFloat(formData.price) * 100);

      if (isNaN(price_cents) || price_cents < 0) {
        throw new Error('Please enter a valid price');
      }

      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          duration_minutes: formData.duration_minutes,
          price_cents,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update service');
      }

      router.push('/admin/services');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoading message="Loading service..." />;
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <h2 className="font-display text-xl text-ink mb-2">Service not found</h2>
        <p className="text-body-sm font-body text-ink/60 mb-6">
          This service may have been deleted.
        </p>
        <Link
          href="/admin/services"
          className="inline-flex px-4 py-2 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4">
            <p className="text-red-700 text-body-sm font-body">{error}</p>
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
            Service Name *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
            placeholder="e.g., Classic Manicure"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20 resize-none"
            placeholder="Describe the service..."
          />
        </div>

        {/* Duration & Price */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="duration" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Duration *
            </label>
            <select
              id="duration"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink focus:outline-none focus:ring-2 focus:ring-botanical/20"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={75}>1 hr 15 min</option>
              <option value={90}>1 hr 30 min</option>
              <option value={120}>2 hours</option>
              <option value={150}>2 hr 30 min</option>
              <option value={180}>3 hours</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-body">$</span>
              <input
                type="number"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-8 pr-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="image_url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
            placeholder="https://..."
          />
          <p className="mt-1 text-overline text-ink/40">
            Leave blank to use default placeholder
          </p>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            className={`relative w-12 h-6 transition-colors duration-600 ${
              formData.is_active ? 'bg-botanical' : 'bg-ink/20'
            }`}
            style={{ borderRadius: '9999px' }}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-paper transition-transform duration-600 ${
                formData.is_active ? 'left-7' : 'left-1'
              }`}
              style={{ borderRadius: '9999px' }}
            />
          </button>
          <span className="text-body-sm font-body text-ink">
            {formData.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/admin/services"
            className="px-6 py-3 text-body-sm font-body text-ink/60 hover:text-ink transition-colors duration-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
