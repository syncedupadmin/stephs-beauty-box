import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductByHandle, getProducts } from '@/lib/db/products';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ProductDetailClient } from './ProductDetailClient';
import type { Metadata } from 'next';

interface PageProps {
  params: { handle: string };
}

// Generate static paths for all products
export async function generateStaticParams() {
  if (!isSupabaseConfigured) return [];

  try {
    const products = await getProducts();
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isSupabaseConfigured) {
    return { title: 'Product' };
  }

  try {
    const product = await getProductByHandle(params.handle);
    if (!product) {
      return { title: 'Product Not Found' };
    }

    return {
      title: product.seo_title || product.title,
      description: product.seo_description || product.description?.replace(/<[^>]*>/g, '').substring(0, 160),
      openGraph: {
        title: product.title,
        description: product.description?.replace(/<[^>]*>/g, '').substring(0, 160),
        images: product.images[0]?.src ? [product.images[0].src] : undefined,
      },
    };
  } catch {
    return { title: 'Product' };
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * PRODUCT DETAIL PAGE (PDP) - EDITORIAL LAYOUT
 * =============================================
 * Design: Asymmetric editorial layout
 * - Large product image gallery
 * - Variant selector (if multiple)
 * - Add to cart with inventory awareness
 * - Sold Out state with Inquire link
 */

export default async function ProductDetailPage({ params }: PageProps) {
  if (!isSupabaseConfigured) {
    return <ProductNotAvailable />;
  }

  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-28 md:pt-32">
        <div className="container-editorial">
          <nav className="flex items-center gap-2 text-body-sm font-body text-ink/40">
            <Link href="/shop" className="hover:text-botanical transition-colors duration-600">
              Shop
            </Link>
            <span>/</span>
            <span className="text-ink/70">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail - Client Component for interactivity */}
      <ProductDetailClient product={product} />

      {/* Related Products CTA */}
      <section className="section-editorial-sm bg-off-white/50">
        <div className="container-editorial text-center">
          <p className="overline mb-6">Continue Shopping</p>
          <h3 className="font-display text-display-sm text-ink mb-8">
            Explore More Products
          </h3>
          <Link href="/shop" className="cta-secondary">
            Back to Shop
          </Link>
        </div>
      </section>
    </>
  );
}

function ProductNotAvailable() {
  return (
    <>
      <section className="pt-32 pb-20">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center">
            <p className="overline mb-6">Unavailable</p>
            <h1 className="font-display text-display-md text-ink mb-6">
              Product Not Available
            </h1>
            <p className="text-ink/60 text-body-lg font-body mb-10">
              This product is currently unavailable. Please check back later or contact us.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/shop" className="cta-primary">
                Back to Shop
              </Link>
              <Link href="/contact" className="cta-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
