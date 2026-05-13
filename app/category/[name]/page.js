import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCategory } from "@/data/products";
import { getProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }) {
  const category = getCategory(params.name);
  if (!category) notFound();

  return {
    title: `${category.name} | Ecommerce Store`,
    description: `${category.note} Shop premium ${category.name.toLowerCase()} at Ecommerce Store.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const category = getCategory(params.name);
  if (!category) notFound();
  const page = Number(searchParams?.page || 1);
  const categoryProducts = await getProducts({ category: params.name, page, limit: 24 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Category</p>
          <h1 className="mt-3 text-4xl font-semibold text-textPrimary">{category.name}</h1>
          <p className="mt-4 text-base leading-8 text-textSecondary">{category.note}</p>
        </div>
        <div className="rounded-md border border-borderSoft bg-white px-4 py-3 text-sm text-textSecondary">
          {categoryProducts.total} products
        </div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categoryProducts.items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
