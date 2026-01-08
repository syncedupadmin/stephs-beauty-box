'use client';

/**
 * Products List Page
 * ==================
 * View and manage all products
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable, StatusBadge, ConfirmModal, PageLoading, EmptyState } from '@/components/admin';

interface ProductVariant {
  id: string;
  sku: string | null;
  price_cents: number;
  inventory_quantity: number;
}

interface ProductImage {
  id: string;
  src: string;
  position: number;
}

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  product_type: string | null;
  is_active: boolean;
  is_featured: boolean;
  product_variants: ProductVariant[];
  product_images: ProductImage[];
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !product.is_active }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, is_active: !p.is_active } : p
        )
      );
    } catch (err) {
      console.error('Toggle error:', err);
    }
  }

  async function handleDelete() {
    if (!deleteModal.product) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${deleteModal.product.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.product?.id));
      setDeleteModal({ open: false, product: null });
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

  const getPrice = (product: Product) => {
    const variant = product.product_variants[0];
    return variant ? formatCurrency(variant.price_cents) : '$0.00';
  };

  const getInventory = (product: Product) => {
    return product.product_variants.reduce((sum, v) => sum + v.inventory_quantity, 0);
  };

  const getImage = (product: Product) => {
    const image = product.product_images.find((i) => i.position === 0) || product.product_images[0];
    return image?.src;
  };

  if (loading) {
    return <PageLoading message="Loading products..." />;
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
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-botanical text-paper px-4 py-2 text-body-sm font-body hover:bg-botanical/90 transition-colors duration-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first product to start selling."
          icon={<EmptyState.Icons.Products />}
          action={{
            label: 'Add Product',
            onClick: () => router.push('/admin/products/new'),
          }}
        />
      ) : (
        <DataTable
          columns={[
            {
              key: 'title',
              label: 'Product',
              sortable: true,
              render: (product) => (
                <div className="flex items-center gap-3">
                  {getImage(product) ? (
                    <img
                      src={getImage(product)}
                      alt={product.title}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-ink/5 flex items-center justify-center">
                      <svg className="w-5 h-5 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-body text-ink">{product.title}</p>
                    {product.product_type && (
                      <p className="text-overline text-ink/50">
                        {product.product_type}
                      </p>
                    )}
                  </div>
                </div>
              ),
            },
            {
              key: 'price',
              label: 'Price',
              sortable: true,
              render: (product) => getPrice(product),
            },
            {
              key: 'inventory',
              label: 'Inventory',
              sortable: true,
              render: (product) => {
                const qty = getInventory(product);
                return (
                  <span className={qty === 0 ? 'text-red-600' : qty < 10 ? 'text-clay' : ''}>
                    {qty} in stock
                  </span>
                );
              },
            },
            {
              key: 'is_active',
              label: 'Status',
              render: (product) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleActive(product);
                  }}
                  className="cursor-pointer"
                >
                  <StatusBadge
                    status={product.is_active ? 'success' : 'neutral'}
                    label={product.is_active ? 'Active' : 'Draft'}
                  />
                </button>
              ),
            },
            {
              key: 'actions',
              label: '',
              className: 'w-24',
              render: (product) => (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
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
                      setDeleteModal({ open: true, product });
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
          data={products}
          keyField="id"
          onRowClick={(product) => router.push(`/admin/products/${product.id}`)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
