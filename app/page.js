import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Testimonials from "@/components/Testimonials";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  const [featured, latest, bestSelling, fastSelling, collection] = await Promise.all([
    getProducts({ flag: "featured", limit: 4 }),
    getProducts({ flag: "latest", limit: 4 }),
    getProducts({ flag: "bestSelling", limit: 4 }),
    getProducts({ flag: "fastSelling", limit: 4 }),
    getProducts({ limit: 4 }),
  ]);
  const spotlightStats = [
    { label: "Featured picks", value: featured.items.length },
    { label: "Latest arrivals", value: latest.items.length },
    { label: "Best sellers", value: bestSelling.items.length },
  ];

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-borderSoft/50 bg-white/75 p-6 shadow-subtle backdrop-blur-sm md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Portfolio view
            </p>
            <h2 className="mt-3 font-serif text-3xl text-textPrimary md:text-4xl">
              Curated like a showroom, paced like a portfolio.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-textSecondary">
              The layout keeps the same theme and typography, but gives the page more
              breathing room, clearer hierarchy, and a more editorial rhythm.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {spotlightStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-borderSoft/50 bg-background/70 px-4 py-4 text-center"
              >
                <p className="text-2xl font-serif text-textPrimary md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-textSecondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProductSection title="Featured Products" products={featured.items} />
      <ProductSection title="Latest Products" products={latest.items} />
      <ProductSection title="Best Selling" products={bestSelling.items} />
      <ProductSection title="Fast Selling" products={fastSelling.items} />
      <ProductSection title="Complete Collection" products={collection.items} />
      <Testimonials />
    </>
  );
}
