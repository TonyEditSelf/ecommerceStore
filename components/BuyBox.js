"use client";

import { useEffect } from "react";
import { Check, ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import AddToCartButton from "./AddToCartButton";
import { trackEvent } from "@/lib/events";

export default function BuyBox({ product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleBuyNow = () => {
    addItem(product);
    router.push("/cart");
  };

  useEffect(() => {
    trackEvent("product_view", { productId: product.id, title: product.title });
  }, [product.id, product.title]);

  return (
    <div className="sticky top-24 w-full min-w-0 max-w-full rounded-3xl border border-borderSoft/50 bg-white p-6 shadow-soft animate-in fade-in slide-in-from-right-4 duration-500 sm:p-8">
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Price:</span>
          <span className="font-serif text-4xl text-textPrimary tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
        </div>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-primary">Free expedited shipping</p>
      </div>

      <div className="mb-8">
        {product.stock > 0 ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-green-50 px-4 py-2 border border-green-100 shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-700">In Stock & Ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-2 border border-red-100 shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">Currently Unavailable</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <AddToCartButton product={product} />
        <button 
          onClick={handleBuyNow}
          className="group relative w-full overflow-hidden rounded-2xl bg-dark px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-soft transition-all hover:bg-primary active:scale-95"
        >
          <span className="relative z-10">Purchase Now</span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </div>

      <div className="mt-8 space-y-4 border-t border-borderSoft/30 pt-8">
        <div className="flex items-center gap-4 group cursor-help">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/50 group-hover:bg-primary/10 transition-colors">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">Delivery</span>
            <span className="text-[11px] font-medium text-textPrimary">Verified Courier Service</span>
          </div>
        </div>
        <div className="flex items-center gap-4 group cursor-help">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/50 group-hover:bg-primary/10 transition-colors">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">Protection</span>
            <span className="text-[11px] font-medium text-textPrimary">Extended Luxury Warranty</span>
          </div>
        </div>
      </div>
    </div>
  );
}
