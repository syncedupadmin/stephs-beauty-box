'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore, formatPrice } from '@/lib/store/cart';

/**
 * CHECKOUT PAGE - FULFILLMENT SELECTION
 * =====================================
 * Allows customer to choose shipping vs pickup
 * Then redirects to Stripe Checkout
 */

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'shipping'>('pickup');
  const [shopSettings, setShopSettings] = useState<{
    canShip: boolean;
    canPickup: boolean;
    pickupAddress?: string;
    pickupHours?: string;
    shippingRate?: number;
    freeShippingThreshold?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getSubtotal();

  // Fetch shop settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/shop/settings');
        if (response.ok) {
          const data = await response.json();
          setShopSettings(data);

          // Set default fulfillment method
          if (data.canPickup && !data.canShip) {
            setFulfillmentMethod('pickup');
          } else if (data.canShip && !data.canPickup) {
            setFulfillmentMethod('shipping');
          }
        }
      } catch (err) {
        console.error('Failed to fetch shop settings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  // Calculate shipping
  const shippingCost = fulfillmentMethod === 'shipping'
    ? (shopSettings?.freeShippingThreshold && subtotal >= shopSettings.freeShippingThreshold
        ? 0
        : shopSettings?.shippingRate || 0)
    : 0;

  const total = subtotal + shippingCost;

  // Handle checkout
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          fulfillmentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.adjustments) {
          setError('Some items in your cart are no longer available. Please review your cart.');
        } else {
          setError(data.error || 'Checkout failed. Please try again.');
        }
        return;
      }

      // Redirect to Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Empty cart redirect
  if (!isLoading && items.length === 0) {
    return (
      <section className="pt-32 pb-20">
        <div className="container-editorial">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="font-display text-display-md text-ink mb-6">
              Your Cart is Empty
            </h1>
            <p className="text-ink/60 text-body-lg font-body mb-10">
              Add some items to your cart to continue.
            </p>
            <Link href="/shop" className="cta-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-12">
        <div className="container-editorial">
          <div className="max-w-2xl">
            <nav className="flex items-center gap-2 text-body-sm font-body text-ink/40 mb-6">
              <Link href="/shop" className="hover:text-botanical">Shop</Link>
              <span>/</span>
              <span className="text-ink/70">Checkout</span>
            </nav>
            <h1 className="font-display text-display-lg text-ink">
              Checkout
            </h1>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="pb-20">
        <div className="container-editorial">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Fulfillment Selection */}
            <div>
              <h2 className="font-display text-xl text-ink mb-6">
                How would you like to receive your order?
              </h2>

              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-24 bg-ink/5" />
                  <div className="h-24 bg-ink/5" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pickup Option */}
                  {shopSettings?.canPickup && (
                    <button
                      onClick={() => setFulfillmentMethod('pickup')}
                      className={`w-full text-left p-6 border transition-all duration-600 ${
                        fulfillmentMethod === 'pickup'
                          ? 'border-botanical bg-botanical/5'
                          : 'border-ink/20 hover:border-ink/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg text-ink mb-2">
                            In-Store Pickup
                          </h3>
                          <p className="text-ink/60 text-body-sm font-body">
                            Pick up at our salon - Free
                          </p>
                          {shopSettings.pickupAddress && (
                            <p className="text-ink/40 text-body-sm font-body mt-2">
                              {shopSettings.pickupAddress}
                            </p>
                          )}
                          {shopSettings.pickupHours && (
                            <p className="text-ink/40 text-body-sm font-body">
                              {shopSettings.pickupHours}
                            </p>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          fulfillmentMethod === 'pickup'
                            ? 'border-botanical bg-botanical'
                            : 'border-ink/30'
                        }`}>
                          {fulfillmentMethod === 'pickup' && (
                            <div className="w-2 h-2 rounded-full bg-off-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Shipping Option */}
                  {shopSettings?.canShip && (
                    <button
                      onClick={() => setFulfillmentMethod('shipping')}
                      className={`w-full text-left p-6 border transition-all duration-600 ${
                        fulfillmentMethod === 'shipping'
                          ? 'border-botanical bg-botanical/5'
                          : 'border-ink/20 hover:border-ink/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg text-ink mb-2">
                            Ship to Address
                          </h3>
                          <p className="text-ink/60 text-body-sm font-body">
                            {shopSettings.freeShippingThreshold && subtotal >= shopSettings.freeShippingThreshold
                              ? 'Free shipping on this order!'
                              : shopSettings.shippingRate
                                ? `${formatPrice(shopSettings.shippingRate)} flat rate shipping`
                                : 'Shipping calculated at checkout'}
                          </p>
                          {shopSettings.freeShippingThreshold && subtotal < shopSettings.freeShippingThreshold && (
                            <p className="text-botanical text-body-sm font-body mt-2">
                              Add {formatPrice(shopSettings.freeShippingThreshold - subtotal)} more for free shipping
                            </p>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          fulfillmentMethod === 'shipping'
                            ? 'border-botanical bg-botanical'
                            : 'border-ink/30'
                        }`}>
                          {fulfillmentMethod === 'shipping' && (
                            <div className="w-2 h-2 rounded-full bg-off-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-clay/10 border border-clay/30 text-clay text-body-sm font-body">
                  {error}
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:pl-8 lg:border-l lg:border-ink/10">
              <h2 className="font-display text-xl text-ink mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <ul className="space-y-4 mb-8">
                {items.map(item => (
                  <li key={item.variantId} className="flex gap-4">
                    {item.image && (
                      <div
                        className="w-16 h-16 flex-shrink-0 bg-cover bg-center bg-off-white"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-display text-ink text-base">{item.productTitle}</p>
                      {item.variantTitle && (
                        <p className="text-ink/50 text-body-sm font-body">{item.variantTitle}</p>
                      )}
                      <p className="text-ink/50 text-body-sm font-body">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-display text-botanical">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="divider-hairline mb-6" />

              {/* Totals */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-body-md font-body">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body-md font-body">
                  <span className="text-ink/60">Shipping</span>
                  <span className="text-ink">
                    {fulfillmentMethod === 'pickup'
                      ? 'Free'
                      : shippingCost === 0
                        ? 'Free'
                        : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-body-md font-body pt-3 border-t border-ink/10">
                  <span className="text-ink font-medium">Total</span>
                  <span className="font-display text-xl text-botanical">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || isLoading}
                className="cta-primary w-full justify-center disabled:opacity-50"
              >
                {isCheckingOut ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p className="text-ink/40 text-body-sm font-body text-center mt-4">
                You&apos;ll be redirected to our secure payment page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
