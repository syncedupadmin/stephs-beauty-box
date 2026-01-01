import Link from 'next/link';
import { brand, shopify, contact } from '@/lib/config/brand';
import { getImage } from '@/lib/config/images';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: `Shop beauty products and essentials at ${brand.name}. Curated items to help you look and feel your best.`,
};

/**
 * SHOP PAGE - EDITORIAL PRODUCT GRID
 * ===================================
 * Design: Minimal grid with real campaign images
 * - No icons, no rounded cards
 * - Editorial typography
 * - Luxury transitions
 */

// Demo products with real images (using looping from manifest)
const demoProducts = [
  {
    id: '1',
    name: 'Hydrating Facial Serum',
    price: 42.00,
    image: getImage(11),
    category: 'Skincare',
    description: 'Nourishing serum for all skin types.',
  },
  {
    id: '2',
    name: 'Lash Growth Serum',
    price: 38.00,
    image: getImage(3),
    category: 'Lashes',
    description: 'Promote natural lash growth and strength.',
  },
  {
    id: '3',
    name: 'Silk Scrunchie Set',
    price: 24.00,
    image: getImage(5),
    category: 'Hair Accessories',
    description: 'Gentle on hair, beautiful in style.',
  },
  {
    id: '4',
    name: 'Rose Lip Oil',
    price: 18.00,
    image: getImage(4),
    category: 'Makeup',
    description: 'Hydrating lip oil with a subtle rose tint.',
  },
  {
    id: '5',
    name: 'Makeup Brush Set',
    price: 56.00,
    image: getImage(9),
    category: 'Tools',
    description: 'Professional-grade brushes for flawless application.',
  },
  {
    id: '6',
    name: 'Overnight Hair Mask',
    price: 32.00,
    image: getImage(7),
    category: 'Hair Care',
    description: 'Deep conditioning treatment while you sleep.',
  },
];

export default function ShopPage() {
  const isShopifyConnected = shopify.enabled;

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

      {/* Demo Mode Banner - Subtle */}
      {!isShopifyConnected && (
        <div className="container-editorial pb-8">
          <div className="divider-hairline mb-4" />
          <p className="text-ink/40 text-body-sm font-body">
            {shopify.demoBannerText}
          </p>
        </div>
      )}

      {/* Products Grid - Editorial */}
      <section className="pb-20 md:pb-32">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {demoProducts.map((product) => (
              <article key={product.id} className="group">
                {/* Product Image */}
                <div className="aspect-square mb-6 overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-600 ease-luxury group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  {/* Category - Subtle */}
                  <span className="absolute top-4 left-4 text-overline uppercase tracking-[0.15em] text-off-white/60">
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="font-display text-xl text-ink mb-2 group-hover:text-botanical transition-colors duration-600">
                    {product.name}
                  </h3>
                  <p className="text-ink/50 text-body-sm font-body mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg text-botanical">
                      ${product.price.toFixed(2)}
                    </span>
                    {isShopifyConnected ? (
                      <button className="cta-primary text-sm py-2 px-4">
                        Add to Cart
                      </button>
                    ) : (
                      <span className="text-ink/30 text-body-sm font-body">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Coming Soon - Editorial */}
      {!isShopifyConnected && (
        <section className="section-editorial bg-off-white/50">
          <div className="container-editorial">
            <div className="max-w-2xl mx-auto text-center">
              <p className="overline mb-6">Coming Soon</p>
              <h2 className="font-display text-display-md text-ink mb-6 leading-[0.9]">
                Online Shop<br />
                <span className="font-editorial-italic">Opening Soon</span>
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
      )}

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
