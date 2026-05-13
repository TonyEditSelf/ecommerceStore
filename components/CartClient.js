"use client";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import ProductVisual from "@/components/ProductVisual";
import CheckoutButton from "@/components/CheckoutButton";

export default function CartClient() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Your bag
        </p>
        <h1 className="mt-3 font-serif text-4xl text-textPrimary">
          Calm and empty
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-textSecondary">
          Add a few refined electronics and they will appear here.
        </p>
        <Link
          href="/category/projectors"
          className="mt-8 inline-flex rounded-full bg-cta px-6 py-3 text-sm font-semibold text-dark transition hover:bg-ctaHover"
        >
          Shop projectors
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
      <section>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Your bag
          </p>
          <h1 className="mt-1 font-serif text-4xl text-textPrimary">Cart</h1>
        </div>
        <div className="mt-8 grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 rounded-xl border border-borderSoft bg-white p-5 shadow-subtle transition hover:shadow-soft sm:grid-cols-[110px_1fr_auto]"
            >
              <Link
                href={`/product/${item.slug || item.id}`}
                className="overflow-hidden rounded-lg"
              >
                <ProductVisual product={item} />
              </Link>
              <div className="flex flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.slug || item.id}`}
                    className="font-semibold text-textPrimary transition hover:text-primary"
                  >
                    {item.title || item.name}
                  </Link>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-textSecondary">
                    {item.description?.replace?.(/<[^>]*>/g, "") ||
                      item.description}
                  </p>
                </div>
                <p className="mt-3 font-serif text-lg text-accentBrown">
                  ${item.price}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
                <div className="flex items-center overflow-hidden rounded-full border border-borderSoft bg-background">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-2 transition hover:text-textPrimary"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-2 transition hover:text-textPrimary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-borderSoft bg-background text-textSecondary transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-xl border border-cta/30 bg-white p-6 shadow-soft">
        <div className="border-b border-borderSoft pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Summary
          </p>
          <h2 className="mt-1 font-serif text-2xl text-textPrimary">
            Order total
          </h2>
        </div>
        <div className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between text-textSecondary">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-textSecondary">
            <span>Shipping</span>
            <span>Calculated later</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-borderSoft pt-4 text-base font-semibold text-textPrimary">
            <span>Total</span>
            <span className="font-serif text-lg text-accentBrown">
              ${subtotal}
            </span>
          </div>
        </div>
        <CheckoutButton />
        <button
          onClick={clearCart}
          className="mt-3 w-full rounded-full border border-borderSoft px-5 py-3 text-sm font-medium text-textSecondary transition hover:border-red-200 hover:text-red-500"
        >
          Clear cart
        </button>
      </aside>
    </div>
  );
}
