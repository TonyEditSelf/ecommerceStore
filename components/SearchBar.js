"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import ProductVisual from "@/components/ProductVisual";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`, {
          signal: controller.signal,
        });
        const payload = await response.json();
        setSuggestions(payload.data?.items || []);
      } catch (error) {
        if (error.name !== "AbortError") setSuggestions([]);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-borderSoft bg-white/85 text-textPrimary shadow-subtle transition hover:bg-card"
        aria-label="Open search"
      >
        {open ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </button>
      <div
        className={`absolute right-0 top-full z-50 mt-3 w-[min(86vw,390px)] rounded-md border border-borderSoft bg-white p-3 shadow-soft transition ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 rounded-md border border-borderSoft bg-background px-4 py-3">
          <Search className="h-4 w-4 text-primary" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent text-sm text-textPrimary outline-none placeholder:text-textSecondary"
            autoFocus={open}
          />
        </div>
        <div className="mt-3 grid gap-1">
          {suggestions.map((product) => (
            <Link
              href={`/product/${product.slug || product._id}`}
              key={product._id || product.id}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md p-2 transition hover:bg-background"
            >
              <ProductVisual product={product} compact />
              <div>
                <p className="text-sm font-medium text-textPrimary">{product.title || product.name}</p>
                <p className="text-xs text-textSecondary">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
