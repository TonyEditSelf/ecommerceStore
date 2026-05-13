"use client";

import Image from "next/image";
import { useState } from "react";
import { getCategoryFallbackImageUrl, getOptimizedImageUrl, PLACEHOLDER_IMAGE } from "@/lib/images";

export default function OptimizedImage({
  src,
  alt,
  usage = "card",
  fallbackCategory,
  className = "",
  sizes = "100vw",
  fill = true,
}) {
  const [fallbackStage, setFallbackStage] = useState("primary");
  const imageSrc =
    fallbackStage === "placeholder"
      ? PLACEHOLDER_IMAGE
      : fallbackStage === "category"
        ? getCategoryFallbackImageUrl(fallbackCategory, usage)
        : src
          ? getOptimizedImageUrl(src, usage)
          : fallbackCategory
            ? getCategoryFallbackImageUrl(fallbackCategory, usage)
            : PLACEHOLDER_IMAGE;

  // Skip next/image optimization for non-Unsplash URLs (ImageKit, etc already optimized)
  const isExternal = src && !src.includes("images.unsplash.com") && src.startsWith("http");

  return (
    <Image
      src={imageSrc}
      alt={alt || ""}
      fill={fill}
      sizes={sizes}
      loading="lazy"
      unoptimized={isExternal}
      className={className}
      onError={() => {
        setFallbackStage((current) => {
          if (current === "primary" && fallbackCategory) return "category";
          return "placeholder";
        });
      }}
    />
  );
}

