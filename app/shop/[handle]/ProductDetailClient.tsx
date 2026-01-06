'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore, formatPrice } from '@/lib/store/cart';
import type { ProductWithDetails } from '@/types/database';

interface ProductDetailClientProps {
  product: ProductWithDetails;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCartStore();

  // State
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Get selected variant
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const isSoldOut = !selectedVariant || selectedVariant.inventory_quantity <= 0;
  const maxQuantity = selectedVariant?.inventory_quantity || 0;

  // Handle add to cart
  const handleAddToCart = () => {
    if (isSoldOut || !selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productTitle: product.title,
      variantTitle: selectedVariant.title !== 'Default' ? selectedVariant.title : '',
      price: selectedVariant.price_cents,
      quantity,
      image: product.images[0]?.src,
      maxQuantity: selectedVariant.inventory_quantity,
    });

    // Show feedback
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);

    // Reset quantity
    setQuantity(1);
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= maxQuantity) {
      setQuantity(newQty);
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden bg-off-white relative">
              {product.images[activeImageIndex] ? (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.images[activeImageIndex].src})` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ink/20">
                  <span className="font-display text-3xl">No Image</span>
                </div>
              )}

              {/* Sold Out Overlay */}
              {isSoldOut && (
                <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                  <span className="bg-paper px-6 py-3 font-display text-xl text-ink">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden transition-opacity duration-600 ${
                      activeImageIndex === index ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image.src})` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-8">
            {/* Category */}
            {product.product_type && (
              <p className="overline mb-4">{product.product_type}</p>
            )}

            {/* Title */}
            <h1 className="font-display text-display-md text-ink leading-[0.95] mb-6">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mb-8">
              <span className="font-display text-2xl text-botanical">
                {formatPrice(selectedVariant?.price_cents || 0)}
              </span>
              {selectedVariant?.compare_at_price_cents &&
                selectedVariant.compare_at_price_cents > selectedVariant.price_cents && (
                  <span className="ml-3 text-ink/40 line-through text-body-md font-body">
                    {formatPrice(selectedVariant.compare_at_price_cents)}
                  </span>
                )}
            </div>

            {/* Description */}
            {product.description && (
              <div
                className="text-ink/60 text-body-md font-body leading-relaxed mb-8 prose prose-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            <div className="divider-hairline mb-8" />

            {/* Variant Selector */}
            {product.variants.length > 1 && (
              <div className="mb-8">
                <label className="label-editorial mb-3 block">
                  {product.variants[0].option1_name || 'Option'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(variant => {
                    const variantSoldOut = variant.inventory_quantity <= 0;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={variantSoldOut}
                        className={`px-4 py-2 text-body-sm font-body transition-all duration-600 ${
                          selectedVariantId === variant.id
                            ? 'bg-botanical text-off-white'
                            : variantSoldOut
                            ? 'bg-ink/5 text-ink/30 cursor-not-allowed'
                            : 'bg-off-white text-ink hover:bg-botanical/10'
                        }`}
                      >
                        {variant.title}
                        {variantSoldOut && ' (Sold Out)'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {!isSoldOut && (
              <div className="mb-8">
                <label className="label-editorial mb-3 block">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-ink/20">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center text-ink/60 hover:text-ink disabled:opacity-30 transition-colors duration-600"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-body text-ink">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      className="w-12 h-12 flex items-center justify-center text-ink/60 hover:text-ink disabled:opacity-30 transition-colors duration-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-ink/40 text-body-sm font-body">
                    {maxQuantity} available
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart / Inquire */}
            {isSoldOut ? (
              <div className="space-y-4">
                <p className="text-ink/60 text-body-md font-body">
                  This item is currently sold out. Contact us to inquire about availability.
                </p>
                <Link href="/contact" className="cta-primary w-full justify-center">
                  Inquire About Availability
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={addedFeedback}
                  className={`cta-primary w-full justify-center transition-all duration-600 ${
                    addedFeedback ? 'bg-botanical/80' : ''
                  }`}
                >
                  {addedFeedback ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-12 space-y-6">
              {selectedVariant?.sku && (
                <div className="flex justify-between text-body-sm font-body">
                  <span className="text-ink/40">SKU</span>
                  <span className="text-ink/70">{selectedVariant.sku}</span>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-overline uppercase tracking-[0.15em] text-ink/40 bg-off-white px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
