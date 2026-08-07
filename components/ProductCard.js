import Link from "next/link";
import { Star } from "lucide-react";
import ProductVisual from "@/components/ProductVisual";

const allowedFlags = ["featured", "latest", "bestSelling", "fastSelling"];

export default function ProductCard({ product }) {
  const productId = product.slug || product._id || product.id;
  const title = product.title || product.name;
  const flags = product.flags
    ? allowedFlags.filter((key) => product.flags[key])
    : [];

  return (
    <Link
      href={`/product/${productId}`}
      className="group block overflow-hidden rounded-2xl border border-borderSoft/70 bg-white/80 p-4 shadow-subtle backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <ProductVisual product={product} />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-textPrimary">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-textSecondary/90">
            {product.description}
          </p>
        </div>
        <p className="shrink-0 rounded-full bg-background px-3 py-1.5 text-sm font-semibold text-accentBrown">
          ${product.price}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-textSecondary">
          <Star className="h-3.5 w-3.5 fill-cta text-cta" />
          {product.rating}
        </span>
        <span className="inline-flex items-center rounded-full border border-borderSoft/50 bg-background/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary transition group-hover:border-primary/20 group-hover:text-accentBrown">
          {flags[0] || "View"}
        </span>
      </div>
    </Link>
  );
}
