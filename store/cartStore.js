"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

function normalizeProduct(product) {
  return {
    id: String(product._id || product.id),
    slug: product.slug,
    title: product.title || product.name,
    name: product.title || product.name,
    description: product.description,
    price: product.price,
    media: product.media || [],
    colors: product.colors,
    rating: product.rating,
  };
}

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const normalized = normalizeProduct(product);
          const existing = state.items.find((item) => item.id === normalized.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === normalized.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { items: [...state.items, { ...normalized, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "ecommerce-store-cart" }
  )
);
