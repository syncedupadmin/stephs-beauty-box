'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';

/**
 * CHECKOUT SUCCESS PAGE
 * =====================
 * Displayed after successful payment
 */

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [orderDetails, setOrderDetails] = useState<{
    orderNumber?: number;
    email?: string;
    fulfillmentMethod?: string;
  } | null>(null);

  const sessionId = searchParams.get('session_id');

  // Clear cart and fetch order details
  useEffect(() => {
    // Clear the cart
    clearCart();

    // Fetch order details if we have a session ID
    if (sessionId) {
      fetch(`/api/orders/by-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.orderNumber) {
            setOrderDetails(data);
          }
        })
        .catch(console.error);
    }
  }, [sessionId, clearCart]);

  return (
    <section className="pt-32 pb-20">
      <div className="container-editorial">
        <div className="max-w-xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-botanical/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-botanical"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="overline mb-4">Order Confirmed</p>
          <h1 className="font-display text-display-md text-ink mb-6 leading-[0.95]">
            Thank You for<br />
            <span className="font-editorial-italic">Your Order</span>
          </h1>

          {orderDetails?.orderNumber && (
            <p className="text-ink/60 text-body-lg font-body mb-4">
              Order #{orderDetails.orderNumber}
            </p>
          )}

          <p className="text-ink/60 text-body-md font-body mb-8 max-w-md mx-auto">
            We&apos;ve received your order and sent a confirmation to{' '}
            {orderDetails?.email ? (
              <strong className="text-ink">{orderDetails.email}</strong>
            ) : (
              'your email'
            )}.
          </p>

          {/* Fulfillment Info */}
          {orderDetails?.fulfillmentMethod === 'pickup' ? (
            <div className="bg-off-white/50 p-6 mb-10 text-left">
              <h3 className="font-display text-lg text-ink mb-2">Pickup Information</h3>
              <p className="text-ink/60 text-body-sm font-body">
                We&apos;ll notify you when your order is ready for pickup.
                Please bring your order confirmation email or ID.
              </p>
            </div>
          ) : (
            <div className="bg-off-white/50 p-6 mb-10 text-left">
              <h3 className="font-display text-lg text-ink mb-2">Shipping</h3>
              <p className="text-ink/60 text-body-sm font-body">
                We&apos;ll send you tracking information once your order ships.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="cta-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="cta-secondary">
              Return Home
            </Link>
          </div>

          {/* Support */}
          <p className="text-ink/40 text-body-sm font-body mt-12">
            Questions about your order?{' '}
            <Link href="/contact" className="text-botanical hover:opacity-70">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
