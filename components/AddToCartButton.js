"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { trackEvent } from "@/lib/events";

export default function AddToCartButton({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product);
    trackEvent("add_to_cart", { productId: product.id, title: product.title });
  };

  return (
    <button
      onClick={handleAdd}
      className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-cta px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-textPrimary shadow-subtle transition-all hover:bg-ctaHover active:scale-95"
    >
      <ShoppingBag className="h-4 w-4" />
      Add to collection
    </button>
  );
}
