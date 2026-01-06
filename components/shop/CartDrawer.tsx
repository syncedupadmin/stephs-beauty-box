'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore, formatPrice } from '@/lib/store/cart';

/**
 * CART DRAWER - EDITORIAL MINIMAL
 * ================================
 * Design: Slide-out drawer with editorial typography
 * - No icons, text-only buttons
 * - Hairline dividers
 * - Luxury transitions
 */

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, setCartOpen]);

  // Handle checkout
  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout/shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to checkout selection page
      window.location.href = data.redirectUrl || '/checkout';
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-paper shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-ink/10">
          <h2 className="font-display text-xl text-ink">
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 text-ink/40 text-body-sm font-body">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-overline uppercase tracking-[0.15em] text-ink/60 hover:text-ink transition-colors duration-600"
          >
            Close
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ink/40 text-body-md font-body mb-6">
                Your cart is empty
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="editorial-link text-body-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map(item => (
                <li key={item.variantId} className="flex gap-4">
                  {/* Image */}
                  {item.image && (
                    <div
                      className="w-20 h-20 flex-shrink-0 bg-cover bg-center bg-off-white"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-ink text-base mb-1 truncate">
                      {item.productTitle}
                    </h3>
                    {item.variantTitle && (
                      <p className="text-ink/50 text-body-sm font-body mb-2">
                        {item.variantTitle}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-body-sm font-body">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 flex items-center justify-center text-ink/40 hover:text-ink disabled:opacity-30 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-display text-botanical">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-ink/30 text-body-sm font-body hover:text-clay transition-colors duration-600 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-ink/10 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-ink/60 text-body-md font-body">Subtotal</span>
              <span className="font-display text-xl text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="text-ink/40 text-body-sm font-body">
              Shipping and taxes calculated at checkout.
            </p>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="cta-primary w-full justify-center disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-center text-ink/40 text-body-sm font-body hover:text-ink transition-colors duration-600"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Cart Toggle Button for Header
 */
export function CartButton({ className = '' }: { className?: string }) {
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className={`relative text-overline uppercase tracking-[0.15em] transition-opacity duration-600 hover:opacity-60 ${className}`}
    >
      Cart
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-4 w-5 h-5 bg-botanical text-off-white text-xs flex items-center justify-center rounded-full">
          {itemCount}
        </span>
      )}
    </button>
  );
}
