import Link from 'next/link';
import { brand, contact } from '@/lib/config/brand';
import { getProducts } from '@/lib/db/products';
import { getShopSettings, isShopConfigured } from '@/lib/db/settings';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatPrice } from '@/lib/store/cart';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: `Shop beauty products and essentials at ${brand.name}. Curated items to help you look and feel your best.`,
};

// Revalidate every 60 seconds
export const revalidate = 60;

/**
 * SHOP PAGE - EDITORIAL PRODUCT GRID
 * ===================================
 * Design: Minimal grid with real product images
 * - No icons, no rounded cards
 * - Editorial typography
 * - Luxury transitions
 * - Real inventory from Supabase
 */

export default async function ShopPage() {
  // Check if Supabase is configured
  if (!isSupabaseConfigured) {
    return <ShopNotConfigured reason="database" />;
  }

  // Get shop settings and products
  let products = [];
  let settings = null;
  let shopStatus = { configured: false, canShip: false, canPickup: false, issues: [] as string[] };

  try {
    [products, settings, shopStatus] = await Promise.all([
      getProducts(),
      getShopSettings(),
      isShopConfigured(),
    ]);
  } catch (error) {
    console.error('Shop page error:', error);
    return <ShopNotConfigured reason="error" />;
  }

  // No products yet
  if (products.length === 0) {
    return <ShopEmpty />;
  }

  return (
    <>
      {/* Hero Section - Editorial */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Beauty Essentials</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
              The<br />
              <span className="font-editorial-italic">Shop</span>
            </h1>
            <p className="text-ink/70 text-body-lg font-body leading-relaxed max-w-md">
              Curated products to help you maintain your glow between visits.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Warning if not fully configured */}
      {!shopStatus.configured && (
        <div className="container-editorial pb-8">
          <div className="bg-clay/10 border border-clay/30 px-6 py-4 text-clay text-body-sm font-body">
            <strong>Admin Notice:</strong> Shop checkout is disabled.
            {shopStatus.issues.map((issue, i) => (
              <span key={i}> {issue}.</span>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid - Editorial */}
      <section className="pb-20 md:pb-32">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {products.map((product) => {
              const firstVariant = product.variants[0];
              const firstImage = product.images[0];
              const isSoldOut = !firstVariant || firstVariant.inventory_quantity <= 0;
              const hasMultipleVariants = product.variants.length > 1;

              // Get price range if multiple variants
              const prices = product.variants.map(v => v.price_cents);
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              const priceDisplay = minPrice === maxPrice
                ? formatPrice(minPrice)
                : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;

              return (
                <article key={product.id} className="group">
                  <Link href={`/shop/${product.handle}`} className="block">
                    {/* Product Image */}
                    <div className="aspect-square mb-6 overflow-hidden relative bg-off-white">
                      {firstImage ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-600 ease-luxury group-hover:scale-[1.03]"
                          style={{ backgroundImage: `url(${firstImage.src})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-ink/20">
                          <span className="font-display text-2xl">No Image</span>
                        </div>
                      )}

                      {/* Category Badge - Subtle */}
                      {product.product_type && (
                        <span className="absolute top-4 left-4 text-overline uppercase tracking-[0.15em] text-charcoal/60 bg-paper/80 px-2 py-1">
                          {product.product_type}
                        </span>
                      )}

                      {/* Sold Out Badge */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                          <span className="bg-paper px-4 py-2 text-overline uppercase tracking-[0.15em] text-ink">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <h3 className="font-display text-xl text-ink mb-2 group-hover:text-botanical transition-colors duration-600">
                        {product.title}
                      </h3>

                      {product.description && (
                        <p className="text-ink/50 text-body-sm font-body mb-4 line-clamp-2">
                          {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-botanical">
                          {priceDisplay}
                        </span>

                        {isSoldOut ? (
                          <span className="text-ink/30 text-body-sm font-body">
                            Inquire
                          </span>
                        ) : hasMultipleVariants ? (
                          <span className="text-ink/50 text-body-sm font-body">
                            {product.variants.length} options
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-Salon CTA - Editorial */}
      <section className="section-editorial-sm bg-botanical">
        <div className="container-editorial text-center">
          <h3 className="font-display text-display-sm text-off-white mb-4">
            Need Something Specific?
          </h3>
          <p className="text-off-white/60 text-body-md font-body mb-8 max-w-md mx-auto">
            We can recommend and source products tailored to your needs.
          </p>
          <Link
            href="/contact"
            className="cta-primary bg-off-white text-botanical hover:bg-off-white/90"
          >
            Ask Us
          </Link>
        </div>
      </section>
    </>
  );
}

// =============================================================================
// FALLBACK COMPONENTS
// =============================================================================

function ShopNotConfigured({ reason }: { reason: 'database' | 'error' }) {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Beauty Essentials</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
              The<br />
              <span className="font-editorial-italic">Shop</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center py-16">
            <p className="overline mb-6">Coming Soon</p>
            <h2 className="font-display text-display-md text-ink mb-6 leading-[0.9]">
              Online Shop<br />
              <span className="font-editorial-italic">Opening Soon</span>
            </h2>
            <p className="text-ink/60 text-body-lg font-body mb-10">
              {reason === 'database'
                ? 'Our online shop is being set up. In the meantime, visit us in person or reach out.'
                : 'We encountered an issue loading products. Please try again later.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="cta-primary">
                Contact Us
              </Link>
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Visit Our Salon
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ShopEmpty() {
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <p className="overline mb-6">Beauty Essentials</p>
            <h1 className="font-display text-display-hero text-ink leading-[0.9] mb-8">
              The<br />
              <span className="font-editorial-italic">Shop</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="section-editorial bg-off-white/50">
        <div className="container-editorial">
          <div className="max-w-2xl mx-auto text-center">
            <p className="overline mb-6">Coming Soon</p>
            <h2 className="font-display text-display-md text-ink mb-6 leading-[0.9]">
              Products Are<br />
              <span className="font-editorial-italic">On The Way</span>
            </h2>
            <p className="text-ink/60 text-body-lg font-body mb-10 max-w-md mx-auto">
              We&apos;re curating a collection of our favorite beauty products.
              In the meantime, visit us in person or reach out to ask about products.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="cta-primary">
                Contact Us
              </Link>
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Visit Our Salon
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
