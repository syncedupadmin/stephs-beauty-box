/**
 * Cart Store (Zustand)
 * ====================
 * Client-side cart state management with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/database';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;

  // Computed
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);

          if (existing) {
            // Update quantity (respect max)
            const newQty = Math.min(
              existing.quantity + item.quantity,
              item.maxQuantity
            );
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: newQty }
                  : i
              ),
              isOpen: true, // Open cart when adding
            };
          }

          // Add new item
          return {
            items: [...state.items, item],
            isOpen: true,
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.maxQuantity) }
              : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setCartOpen: (open) => {
        set({ isOpen: open });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'sbb-cart', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

/**
 * Format price in cents to display string
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Check if variant is in cart
 */
export function isInCart(variantId: string): boolean {
  return useCartStore.getState().items.some((i) => i.variantId === variantId);
}

/**
 * Get quantity of variant in cart
 */
export function getCartQuantity(variantId: string): number {
  const item = useCartStore.getState().items.find((i) => i.variantId === variantId);
  return item?.quantity || 0;
}
