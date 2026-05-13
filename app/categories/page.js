import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/products";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Categories</p>
        <h1 className="mt-3 text-4xl font-semibold text-textPrimary">Electronics organized for elegant discovery</h1>
        <p className="mt-4 text-base leading-8 text-textSecondary">
          Browse the full database-backed category system.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <CategoryCard key={category.slug} category={category} index={index} />
        ))}
      </div>
    </div>
  );
}
