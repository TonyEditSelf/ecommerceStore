"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { categories } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

const links = [
  ["About Us", "/about"],
  ["Privacy Policy", "/privacy"],
  ["Contact", "/contact"],
];

function CategoryMenu({ compact = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`group relative ${compact ? "shrink-0" : ""}`}>
      <button
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-textSecondary transition hover:text-textPrimary"
      >
        Categories
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`absolute top-full z-50 mt-3 grid rounded-xl border border-borderSoft bg-white p-2 shadow-lg transition-all duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        } ${
          compact
            ? "left-0 w-72"
            : "left-1/2 w-[560px] -translate-x-1/2 grid-cols-2"
        }`}
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm transition hover:bg-background"
          >
            <span className="block font-semibold text-textPrimary">
              {category.name}
            </span>
            <span className="mt-0.5 block text-xs leading-5 text-textSecondary">
              {category.note}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pathname, setPathname] = useState("/");

  const count = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname);

    updatePathname();

    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const result = await res.json();
        if (result.data) setUser(result.data);
        else setUser(null);
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setFetchingUser(false);
      }
    }

    fetchUser();

    // Re-fetch whenever auth changes from anywhere in the app
    window.addEventListener("user-auth-changed", fetchUser);
    window.addEventListener("popstate", updatePathname);
    return () => {
      window.removeEventListener("user-auth-changed", fetchUser);
      window.removeEventListener("popstate", updatePathname);
    };
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.assign("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  async function handleHomeClick(e) {
    if (isAdmin) {
      e.preventDefault();
      await handleLogout();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-borderSoft bg-[#fbf8f1]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex shrink-0 items-center gap-3 mr-10"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cta/60 bg-white text-[10px] font-semibold uppercase tracking-wide text-accentBrown shadow-subtle">
            Logo
          </span>
          <span className="hidden sm:block">
            <span className="block text-base font-bold tracking-wide text-textPrimary">
              Ecommerce Store
            </span>
            <span className="block text-[9px] uppercase tracking-[0.25em] text-primary">
              Premium electronics
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-textSecondary lg:flex">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="transition hover:text-textPrimary"
          >
            Home
          </Link>
          <CategoryMenu />
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="transition hover:text-textPrimary"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Welcome message — desktop only */}
          {!fetchingUser && (
            <span className="hidden text-sm lg:block">
              {user ? (
                <span className="flex flex-col leading-tight">
                  <span className="text-xs text-textSecondary">Welcome</span>
                  <span className="font-semibold text-textPrimary">
                    {user.name}
                  </span>
                </span>
              ) : (
                <span className="flex flex-col leading-tight">
                  <span className="text-xs text-textSecondary">Welcome</span>
                  <span className="font-semibold text-textPrimary">Guest</span>
                </span>
              )}
            </span>
          )}

          <SearchBar />

          {/* Auth button */}
          {user ? (
            <button
              onClick={handleLogout}
              title="Logout"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-borderSoft bg-white text-textPrimary transition hover:bg-red-50 hover:border-red-200 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/googauth"
              title="Sign in"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-borderSoft bg-white text-textPrimary transition hover:bg-highlight/20"
            >
              <UserRound className="h-4 w-4" />
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-textPrimary text-white transition hover:opacity-80"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[10px] font-bold text-textPrimary ring-2 ring-white">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-borderSoft bg-white text-textPrimary lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-borderSoft bg-[#fbf8f1] px-4 pb-4 pt-3 lg:hidden">
          {/* Welcome message on mobile */}
          {!fetchingUser && (
            <p className="mb-3 text-sm font-medium">
              {user ? (
                <span className="flex flex-col leading-tight">
                  <span className="text-xs text-textSecondary">Welcome</span>
                  <span className="font-semibold text-textPrimary">
                    {user.name}
                  </span>
                </span>
              ) : (
                <span className="flex flex-col leading-tight">
                  <span className="text-xs text-textSecondary">Welcome</span>
                  <span className="font-semibold text-textPrimary">Guest</span>
                </span>
              )}
            </p>
          )}
          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => {
                handleHomeClick;
                setMobileOpen(false);
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-textSecondary transition hover:bg-background hover:text-textPrimary"
            >
              Home
            </Link>
            <div>
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-textSecondary transition hover:bg-background hover:text-textPrimary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-textSecondary transition hover:bg-background hover:text-textPrimary"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
