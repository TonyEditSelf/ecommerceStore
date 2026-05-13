"use client";

import OptimizedImage from "@/components/OptimizedImage";

export default function ProductVisual({ product, compact = false, imageUsage = "card" }) {
  const media = product.media?.find((item) => item.type === "image");
  const [base, accent, metal] = product.colors || ["#EFE7DC", "#8A9A7B", "#C8A97E"];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-borderSoft/50 bg-white ${
        compact ? "h-14 w-14" : "aspect-[4/3] w-full"
      }`}
      style={{
        background: `radial-gradient(circle at 20% 18%, ${metal}55, transparent 28%), linear-gradient(135deg, ${base}, #fff 55%, ${accent}66)`,
      }}
    >
      {media ? (
        <OptimizedImage
          src={media.url}
          alt={media.alt || product.title || product.name}
          usage={compact ? "thumbnail" : imageUsage}
          fallbackCategory={product.category}
          sizes={
            compact
              ? "56px"
              : imageUsage === "hero"
                ? "(min-width: 1024px) 45vw, 100vw"
                : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover"
        />
      ) : (
        <OptimizedImage
          src={null}
          alt={product.title || product.name}
          usage={compact ? "thumbnail" : imageUsage}
          fallbackCategory={product.category}
          sizes={compact ? "56px" : "100vw"}
          className="object-cover"
        />
      )}
    </div>
  );
}
