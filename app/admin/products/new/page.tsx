'use client';

/**
 * Add Product Page
 * ================
 * Create a new product
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product_type: '',
    vendor: '',
    price: '',
    compare_at_price: '',
    sku: '',
    inventory_quantity: 0,
    image_url: '',
    is_active: true,
    is_featured: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert prices to cents
      const price_cents = Math.round(parseFloat(formData.price) * 100);
      const compare_at_price_cents = formData.compare_at_price
        ? Math.round(parseFloat(formData.compare_at_price) * 100)
        : null;

      if (isNaN(price_cents) || price_cents < 0) {
        throw new Error('Please enter a valid price');
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          product_type: formData.product_type || null,
          vendor: formData.vendor || null,
          price_cents,
          compare_at_price_cents,
          sku: formData.sku || null,
          inventory_quantity: formData.inventory_quantity,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
          is_featured: formData.is_featured,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 p-4">
            <p className="text-red-700 text-body-sm font-body">{error}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
            placeholder="e.g., Hydrating Face Serum"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20 resize-none"
            placeholder="Describe the product..."
          />
        </div>

        {/* Product Type & Vendor */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="product_type" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Product Type
            </label>
            <input
              type="text"
              id="product_type"
              value={formData.product_type}
              onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
              className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
              placeholder="e.g., Skincare"
            />
          </div>

          <div>
            <label htmlFor="vendor" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Vendor / Brand
            </label>
            <input
              type="text"
              id="vendor"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
              placeholder="e.g., Glow Labs"
            />
          </div>
        </div>

        {/* Price & Compare At */}
        <div className="grid grid-cols-2 gap-6">
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

          <div>
            <label htmlFor="compare_at_price" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Compare at Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 font-body">$</span>
              <input
                type="number"
                id="compare_at_price"
                min="0"
                step="0.01"
                value={formData.compare_at_price}
                onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                className="w-full pl-8 pr-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
                placeholder="Original price"
              />
            </div>
            <p className="mt-1 text-overline text-ink/40">
              For showing sale prices
            </p>
          </div>
        </div>

        {/* SKU & Inventory */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="sku" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
              placeholder="e.g., HFS-001"
            />
          </div>

          <div>
            <label htmlFor="inventory" className="block text-overline uppercase tracking-[0.15em] text-ink/50 mb-2">
              Inventory Quantity
            </label>
            <input
              type="number"
              id="inventory"
              min="0"
              value={formData.inventory_quantity}
              onChange={(e) => setFormData({ ...formData, inventory_quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-off-white border-0 text-body-sm font-body text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-botanical/20"
            />
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
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-8">
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
              {formData.is_active ? 'Active' : 'Draft'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
              className={`relative w-12 h-6 transition-colors duration-600 ${
                formData.is_featured ? 'bg-botanical' : 'bg-ink/20'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-paper transition-transform duration-600 ${
                  formData.is_featured ? 'left-7' : 'left-1'
                }`}
                style={{ borderRadius: '9999px' }}
              />
            </button>
            <span className="text-body-sm font-body text-ink">
              Featured
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-botanical text-paper text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 text-body-sm font-body text-ink/60 hover:text-ink transition-colors duration-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
