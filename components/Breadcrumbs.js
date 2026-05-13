import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ category, productTitle }) {
  return (
    <nav className="mb-8 flex min-w-0 max-w-full flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-textSecondary/50">
      <Link href="/" className="hover:text-primary transition-colors duration-300">
        <Home className="h-3.5 w-3.5" />
      </Link>
      <ChevronRight className="h-3 w-3 opacity-30" />
      <Link href={`/category/${category}`} className="hover:text-primary transition-colors duration-300">
        {category.replace("-", " ")}
      </Link>
      <ChevronRight className="h-3 w-3 opacity-30" />
      <span className="min-w-0 max-w-[min(200px,100%)] truncate text-textPrimary/80">{productTitle}</span>
    </nav>
  );
}
