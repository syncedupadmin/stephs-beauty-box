import Link from 'next/link';
import Image from 'next/image';
import { brand, shopify, contact } from '@/lib/config/brand';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: `Shop beauty products and essentials at ${brand.name}. Curated items to help you look and feel your best.`,
};

// Demo products for when Shopify is not connected
const demoProducts = [
  {
    id: '1',
    name: 'Hydrating Facial Serum',
    price: 42.00,
    image: null,
    category: 'Skincare',
    description: 'Nourishing serum for all skin types.',
  },
  {
    id: '2',
    name: 'Lash Growth Serum',
    price: 38.00,
    image: null,
    category: 'Lashes',
    description: 'Promote natural lash growth and strength.',
  },
  {
    id: '3',
    name: 'Silk Scrunchie Set',
    price: 24.00,
    image: null,
    category: 'Hair Accessories',
    description: 'Gentle on hair, beautiful in style.',
  },
  {
    id: '4',
    name: 'Rose Lip Oil',
    price: 18.00,
    image: null,
    category: 'Makeup',
    description: 'Hydrating lip oil with a subtle rose tint.',
  },
  {
    id: '5',
    name: 'Makeup Brush Set',
    price: 56.00,
    image: null,
    category: 'Tools',
    description: 'Professional-grade brushes for flawless application.',
  },
  {
    id: '6',
    name: 'Overnight Hair Mask',
    price: 32.00,
    image: null,
    category: 'Hair Care',
    description: 'Deep conditioning treatment while you sleep.',
  },
];

export default function ShopPage() {
  const isShopifyConnected = shopify.enabled;

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding-sm bg-ivory">
        <div className="container-editorial">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">Beauty Essentials</p>
            <h1 className="headline-display text-ink mb-6">
              The Shop
            </h1>
            <p className="body-large text-ink/70 max-w-xl mx-auto">
              Curated products to help you maintain your glow between visits.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Mode Banner */}
      {!isShopifyConnected && (
        <div className="bg-sage/10 border-y border-sage/20">
          <div className="container-editorial py-4">
            <p className="text-center text-sage text-sm font-medium">
              {shopify.demoBannerText}
            </p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="container-editorial">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoProducts.map((product) => (
              <article key={product.id} className="group">
                {/* Product Image */}
                <div className="aspect-square bg-blush/30 rounded-subtle overflow-hidden mb-4 relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <svg
                          className="w-12 h-12 mx-auto text-ink/20 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                        <span className="text-ink/30 text-sm">[PRODUCT_IMAGE]</span>
                      </div>
                    </div>
                  )}

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink text-xs px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-editorial text-xl text-ink group-hover:text-sage transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-ink/60 text-sm">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sage font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      disabled={!isShopifyConnected}
                      className={`text-sm px-4 py-2 rounded-button transition-colors ${
                        isShopifyConnected
                          ? 'bg-sage text-white hover:bg-sage-dark'
                          : 'bg-ink/10 text-ink/40 cursor-not-allowed'
                      }`}
                    >
                      {isShopifyConnected ? 'Add to Cart' : 'Coming Soon'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Shop Info */}
      {!isShopifyConnected && (
        <section className="py-16 bg-ivory">
          <div className="container-editorial">
            <div className="max-w-2xl mx-auto text-center">
              <p className="eyebrow mb-4">Coming Soon</p>
              <h2 className="headline-section text-ink mb-4">
                Online Shop Opening Soon
              </h2>
              <p className="text-ink/60 mb-8">
                We&apos;re curating a collection of our favorite beauty products.
                In the meantime, visit us in person or reach out to ask about products.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary">
                  Contact Us
                </Link>
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Visit Our Salon
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* In-Salon CTA */}
      <section className="section-padding-sm bg-sage/5">
        <div className="container-editorial">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="headline-subsection text-ink mb-2">
                Need Something Specific?
              </h3>
              <p className="text-ink/60">
                We can recommend and source products tailored to your needs.
              </p>
            </div>
            <Link href="/contact" className="btn-outline whitespace-nowrap">
              Ask Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
