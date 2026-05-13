import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#3a3028] bg-[#1E1A15] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-cta/60 bg-white text-[10px] font-semibold uppercase tracking-wide text-accentBrown">
              Logo
            </span>
            <div>
              <p className="text-lg font-semibold text-white">
                Ecommerce Store
              </p>
              <p className="font-serif text-sm italic text-cta">
                Premium Electronics
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-md text-sm leading-7 text-white/60">
            A premium frontend experience for curated electronics, built for
            future commerce integrations.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Shop</p>
          <div className="mt-3 grid gap-2 text-sm text-white/68">
            <Link href="/category/projectors">Projectors</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <div className="mt-3 grid gap-2 text-sm text-white/68">
            <Link href="/about">About Us</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
