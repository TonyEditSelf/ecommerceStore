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

  return (
    <>
      <Hero />
      <ProductSection title="Featured Products" products={featured.items} />
      <ProductSection title="Latest Products" products={latest.items} />
      <ProductSection title="Best Selling" products={bestSelling.items} />
      <ProductSection title="Fast Selling" products={fastSelling.items} />
      <ProductSection title="Complete Collection" products={collection.items} />
      <Testimonials />
    </>
  );
}
