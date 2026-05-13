import { notFound } from "next/navigation";
import { Star, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/BuyBox";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getProductByIdOrSlug } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const product = await getProductByIdOrSlug(params.id);
  if (!product) notFound();

  return {
    title: `${product.title} | Ecommerce Store`,
    description: product.description.replace(/<[^>]*>/g, "").slice(0, 155),
    openGraph: {
      title: product.title,
      description: product.description.replace(/<[^>]*>/g, "").slice(0, 155),
      images:
        product.media
          ?.filter((item) => item.type === "image")
          .map((item) => item.url) || [],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProductByIdOrSlug(params.id);
  if (!product) notFound();
  const productImages =
    product.media?.filter((item) => item.type === "image") || [];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description.replace(/<[^>]*>/g, ""),
    image: productImages.map((item) => item.url),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 0,
      reviewCount: 128,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-screen-2xl w-full overflow-x-clip px-4 py-8 sm:px-6 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Breadcrumbs
        category={product.category || "electronics"}
        productTitle={product.title}
      />

      <div className="grid items-start gap-8 lg:gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1.15fr)_minmax(280px,320px)] xl:gap-12 xl:grid-cols-[minmax(300px,400px)_minmax(0,1.2fr)_minmax(300px,340px)]">
        {/* Column 1: Gallery */}
        <div className="min-w-0 w-full max-w-[400px] justify-self-start overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
          <ProductGallery product={product} />
        </div>

        {/* Column 2: Details */}
        <section className="min-w-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                Premium Collection
              </span>
            </div>
            <h1 className="font-serif text-4xl leading-tight text-textPrimary md:text-5xl lg:text-6xl tracking-tight">
              {product.title}
            </h1>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-1 bg-background/50 px-3 py-1.5 rounded-full border border-borderSoft/30 shadow-subtle">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${star <= Math.floor(product.rating) ? "fill-cta text-cta" : "text-borderSoft"}`}
                    />
                  ))}
                </div>
                <span className="ml-1 text-xs font-bold text-textPrimary">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-textSecondary/40 hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary/30 pb-0.5">
                1,284 Collector Reviews
              </span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-borderSoft/50 via-borderSoft/20 to-transparent" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-4 rounded-full bg-cta" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-textPrimary">
                Product Narrative
              </h3>
            </div>
            <div className="font-serif text-lg leading-relaxed text-textSecondary/80 space-y-4 italic">
              {product.description.split("\n").map(
                (para, i) =>
                  para.trim() && (
                    <p key={i} className="relative pl-6">
                      <span className="absolute left-0 top-3 h-px w-4 bg-borderSoft/50" />
                      {para.replace(/<[^>]*>/g, "")}
                    </p>
                  ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-10 sm:grid-cols-4">
            {[
              {
                icon: RefreshCcw,
                label: "7 Day Replacement",
                sub: "Hassle Free",
              },
              { icon: Truck, label: "Free Delivery", sub: "Worldwide" },
              {
                icon: ShieldCheck,
                label: "1 Year Warranty",
                sub: "Global Coverage",
              },
              { icon: ShieldCheck, label: "Top Brand", sub: "Quality Assured" },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center p-4 rounded-2xl border border-borderSoft/30 bg-background/20 transition-all duration-300 hover:bg-white hover:shadow-subtle hover:scale-105"
              >
                <div className="mb-3 rounded-full bg-white p-2.5 shadow-subtle group-hover:text-primary transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-textPrimary mb-0.5">
                  {item.label}
                </span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-textSecondary/40">
                  {item.sub}
                </span>
              </div>
            ))}
          </div>

        </section>

        <aside className="min-w-0 justify-self-end">
          <BuyBox product={product} />
        </aside>
      </div>
    </div>
  );
}
