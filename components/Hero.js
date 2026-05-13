import { getHeroContent, getProducts } from "@/lib/catalog";
import HeroCarousel from "@/components/HeroCarousel";

export default async function Hero() {
  const [slides, products] = await Promise.all([
    getHeroContent(),
    getProducts({ flag: "featured", limit: 10 }),
  ]);
  const heroSlides = slides.length
    ? slides.map((slide, index) => ({
        title: slide.title,
        copy: slide.subtitle,
        product: products.items[index] || products.items[0],
        media: slide.images?.[0] ? [{ ...slide.images[0], type: "image" }] : [],
      }))
    : products.items.map((product) => ({
        title: product.title,
        copy: product.description.replace(/<[^>]*>/g, "").slice(0, 120),
        product,
        media: product.media,
      }));

  return (
    <section className="overflow-hidden border-b border-borderSoft">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <HeroCarousel slides={heroSlides.slice(0, 10)} />
      </div>
    </section>
  );
}
