"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductVisual from "@/components/ProductVisual";

export default function HeroCarousel({ slides }) {
  const [active, setActive] = useState(0);
  const valuePoints = ["Curated selection", "Premium presentation", "Built to convert"];

  if (!slides.length) return null;

  function nextSlide() {
    setActive((current) => (current + 1) % slides.length);
  }

  function previousSlide() {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#3a3028] bg-[#1E1A15] shadow-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(200,169,126,0.16),transparent_35%),radial-gradient(circle_at_100%_100%,rgba(122,140,110,0.18),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div
        className="relative z-10 flex w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide) => {
          const product = slide.product;
          return (
            <div
              key={slide.title}
              className="grid min-w-full gap-10 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10 lg:p-14"
            >
              <div className="flex min-h-[390px] flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cta">
                  Ecommerce Store
                </p>
                <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-tight text-white md:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
                  {slide.copy}
                </p>
                {product && (
                  <div className="mt-8">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/product/${product.slug || product._id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-cta px-6 py-3 text-sm font-semibold text-[#1E1A15] transition hover:bg-ctaHover"
                      >
                        Shop featured <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/category/projectors"
                        className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                      >
                        Browse projectors
                      </Link>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {valuePoints.map((point) => (
                        <div
                          key={point}
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 backdrop-blur-sm"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                            Why it stands out
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-6">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className="zoom-shell w-full">
                  <div className="zoom-image">
                    <ProductVisual
                      product={
                        product
                          ? {
                              ...product,
                              media: slide.media?.length
                                ? slide.media
                                : product.media,
                            }
                          : { title: slide.title, media: slide.media }
                      }
                      imageUsage="hero"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:flex"
        aria-label="Previous hero slide"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:flex"
        aria-label="Next hero slide"
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${active === index ? "w-8 bg-cta" : "w-3 bg-white/30"}`}
            aria-label={`Show hero slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
