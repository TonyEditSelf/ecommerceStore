"use client";

import { useMemo, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import ProductVisual from "@/components/ProductVisual";
import {
  getCategoryFallbackImageUrl,
  getOptimizedImageUrl,
  PLACEHOLDER_IMAGE,
} from "@/lib/images";

export default function ProductGallery({ product }) {
  const images = useMemo(
    () =>
      (product.media || []).filter((item) => item.type === "image").slice(0, 6),
    [product.media],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailFallbackStage, setDetailFallbackStage] = useState("primary");
  const activeImage = images[activeIndex];
  const detailSrc =
    detailFallbackStage === "placeholder"
      ? PLACEHOLDER_IMAGE
      : detailFallbackStage === "category"
        ? getCategoryFallbackImageUrl(product.category, "detail")
        : activeImage?.url
          ? getOptimizedImageUrl(activeImage.url, "detail")
          : getCategoryFallbackImageUrl(product.category, "detail");

  return (
    <section
      className={`grid min-w-0 gap-2 ${images.length > 1 ? "md:grid-cols-[48px_minmax(0,1fr)]" : "grid-cols-1"}`}
    >
      {images.length > 1 && (
        <div className="order-2 grid grid-cols-3 gap-2 md:order-1 md:grid-cols-1">
          {images.map((image, index) => (
            <button
              key={image.publicId || image.url}
              onClick={() => {
                setActiveIndex(index);
                setDetailFallbackStage("primary");
              }}
              className={`group overflow-hidden rounded-xl border bg-white p-1 transition-all duration-300 ${
                activeIndex === index
                  ? "border-primary shadow-subtle ring-1 ring-primary/20 scale-105"
                  : "border-borderSoft/40 hover:border-primary/40"
              }`}
              aria-label={`Show product image ${index + 1}`}
            >
              <img
                src={getOptimizedImageUrl(image.url, "thumbnail")}
                alt={image.alt || product.title}
                loading="lazy"
                className="aspect-square w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(event) => {
                  const image = event.currentTarget;
                  if (image.dataset.fallback !== "category") {
                    image.dataset.fallback = "category";
                    image.src = getCategoryFallbackImageUrl(
                      product.category,
                      "thumbnail",
                    );
                    return;
                  }
                  image.src = PLACEHOLDER_IMAGE;
                }}
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 min-w-0 md:order-2">
        {activeImage ? (
          <div className="group relative aspect-[4/5] w-full max-w-full overflow-hidden rounded-3xl border border-borderSoft/50 bg-white shadow-soft">
            <InnerImageZoom
              key={`${activeImage.publicId || activeImage.url}-${detailFallbackStage}`}
              src={detailSrc}
              zoomSrc={detailSrc}
              zoomType="hover"
              zoomPreload={false}
              className="absolute inset-0 block h-full w-full max-w-full"
              imgAttributes={{
                loading: "lazy",
                alt: activeImage.alt || product.title,
                className:
                  "block h-full w-full max-w-full object-contain transition-transform duration-700",
                onError: () => {
                  setDetailFallbackStage((current) =>
                    current === "primary" ? "category" : "placeholder",
                  );
                },
              }}
            />
          </div>
        ) : (
          <div className="aspect-[4/5] w-full rounded-3xl border border-borderSoft/50 bg-card p-6 shadow-soft">
            <ProductVisual product={product} />
          </div>
        )}
      </div>
    </section>
  );
}
