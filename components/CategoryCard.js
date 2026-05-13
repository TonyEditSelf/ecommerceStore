import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCard({ category, index = 0 }) {
  const tones = ["bg-card", "bg-white", "bg-highlight/45"];

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`${tones[index % tones.length]} group min-h-44 rounded-md border border-borderSoft p-5 shadow-subtle transition hover:-translate-y-1 hover:shadow-soft`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-background text-sm font-semibold text-accentBrown">
          {String(index + 1).padStart(2, "0")}
        </div>
        <ArrowUpRight className="h-5 w-5 text-primary transition group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
      <h3 className="mt-8 text-lg font-semibold text-textPrimary">{category.name}</h3>
      <p className="mt-2 text-sm leading-6 text-textSecondary">{category.note}</p>
    </Link>
  );
}
