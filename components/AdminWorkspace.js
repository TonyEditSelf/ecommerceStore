"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeroManager from "@/components/AdminHeroManager";
import AdminProductForm from "@/components/AdminProductForm";
import AdminSidebar from "@/components/AdminSidebar";
import AdminCRM from "@/components/AdminCRM";
import ProductVisual from "@/components/ProductVisual";
import { categories } from "@/data/products";

export default function AdminWorkspace({ initialProducts, stats }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState("products");
  const [products, setProducts] = useState(initialProducts);
  const [adminStats, setAdminStats] = useState(stats);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [productTotal, setProductTotal] = useState(stats.totalProducts);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef(null);

  const activeTitle = useMemo(() => {
    if (activeView === "products") return "Products";
    if (activeView === "add-product") return "Add Product";
    if (activeView === "hero-images") return "Hero Images";
    if (activeView === "crm") return "CRM & Lead Tracking";
    if (activeView === "analytics") return "Analytics";
    if (activeView === "edit-product") return "Edit Product";
    return "Admin";
  }, [activeView]);

  function openProduct(product) {
    setSelectedProduct(product);
    setActiveView("edit-product");
  }

  function updateProduct(product) {
    setProducts((current) => current.map((item) => (item._id === product._id ? product : item)));
    setSelectedProduct(product);
    router.refresh();
  }

  function addProduct(product) {
    setProducts((current) => [product, ...current]);
    setAdminStats((current) => ({ ...current, totalProducts: current.totalProducts + 1 }));
    const productMatchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const productMatchesSearch =
      !normalizedQuery ||
      product.title?.toLowerCase().includes(normalizedQuery) ||
      product.description?.toLowerCase().includes(normalizedQuery) ||
      product.category?.toLowerCase().includes(normalizedQuery);
    if (productMatchesCategory && productMatchesSearch) {
      setProductTotal((current) => current + 1);
    }
    router.refresh();
  }

  function removeProduct(id) {
    setProducts((current) => current.filter((item) => item._id !== id));
    setAdminStats((current) => ({ ...current, totalProducts: Math.max(0, current.totalProducts - 1) }));
    setProductTotal((current) => Math.max(0, current - 1));
    setSelectedProduct(null);
    setActiveView("products");
    router.refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function loadMoreProducts() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: "20",
    });
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    const response = await fetch(`/api/products?${params.toString()}`);
    const result = await response.json();
    if (response.ok) {
      setProducts((current) => [...current, ...(result.data?.items || [])]);
      setPage(nextPage);
    }
    setLoadingMore(false);
  }

  async function fetchProducts({ category = selectedCategory, query = searchQuery, nextPage = 1 } = {}) {
    setSearching(true);
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: "20",
    });
    if (category !== "all") params.set("category", category);
    if (query.trim()) params.set("q", query.trim());

    const response = await fetch(`/api/products?${params.toString()}`);
    const result = await response.json();
    if (response.ok) {
      setProducts(result.data?.items || []);
      setProductTotal(result.data?.total || 0);
      setSelectedProduct(null);
      setPage(nextPage);
    }
    setSearching(false);
  }

  function changeCategory(category) {
    setSelectedCategory(category);
    fetchProducts({ category, query: searchQuery, nextPage: 1 });
  }

  function changeSearch(query) {
    setSearchQuery(query);
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => {
      fetchProducts({ category: selectedCategory, query, nextPage: 1 });
    }, 220);
  }

  return (
    <div className={`mx-auto grid max-w-[1600px] gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:gap-8 ${activeView === 'hero-images' ? 'grid-cols-1' : 'lg:grid-cols-[280px_minmax(0,1fr)]'}`}>
      {activeView !== "hero-images" && (
        <AdminSidebar activeView={activeView} onChangeView={setActiveView} onLogout={logout} />
      )}
      <div className="grid min-w-0 gap-8">
        <div className={activeView === "hero-images" ? "hidden" : "rounded-[2rem] border border-borderSoft/50 bg-white/80 p-6 shadow-soft"}>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">Management Console</p>
          <h1 className="font-serif mt-3 text-4xl text-textPrimary lg:text-5xl">{activeTitle}</h1>
        </div>

        {activeView === "products" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[2rem] border border-borderSoft/50 bg-white/85 p-6 shadow-soft sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Products", adminStats.totalProducts],
                ["Active Orders", adminStats.totalOrders],
                ["Customer Base", adminStats.totalCustomers],
                ["Total Revenue", `INR ${adminStats.totalRevenue.toLocaleString("en-IN")}`],
              ].map(([label, value]) => (
                <div key={label} className="group rounded-2xl border border-borderSoft/50 bg-white p-6 shadow-subtle transition-all duration-300 hover:shadow-soft">
                  <p className="text-xs font-bold uppercase tracking-wider text-textSecondary/60">{label}</p>
                  <p className="mt-3 text-3xl font-medium tracking-tight text-textPrimary group-hover:text-primary transition-colors">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(event) => changeCategory(event.target.value)}
                className="rounded-xl border border-borderSoft/50 bg-white px-5 py-3.5 text-sm font-medium text-textPrimary shadow-subtle outline-none ring-primary/10 transition-all focus:border-primary focus:ring-4 min-w-[200px]"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>{category.name}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={searchQuery}
                  onChange={(event) => changeSearch(event.target.value)}
                  className="w-full rounded-xl border border-borderSoft/50 bg-white px-5 py-3.5 text-sm font-medium text-textPrimary shadow-subtle outline-none ring-primary/10 transition-all focus:border-primary focus:ring-4"
                  placeholder="Search products by title or description..."
                />
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-borderSoft/50 bg-white shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-borderSoft/30 bg-background/30 text-textSecondary">
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Product</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Category</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Price</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Rating</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderSoft/30">
                    {products.map((product) => (
                      <tr key={product._id} className="group transition-colors hover:bg-background/20">
                        <td className="px-6 py-5">
                          <button onClick={() => openProduct(product)} className="flex items-center gap-4 text-left">
                            <div className="h-14 w-14 overflow-hidden rounded-xl bg-background shadow-subtle group-hover:scale-105 transition-transform duration-300">
                              <ProductVisual product={product} compact />
                            </div>
                            <span className="font-semibold text-textPrimary group-hover:text-primary transition-colors">{product.title}</span>
                          </button>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-background px-3 py-1 text-xs font-medium text-textSecondary">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-accentBrown">INR {product.price.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-cta">★</span>
                            <span className="font-medium text-textPrimary">{product.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(product.flags || {}).filter(([, value]) => value).map(([badge]) => (
                              <span key={badge} className="rounded-full bg-highlight/30 border border-highlight/50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-primary">
                                {badge}
                              </span>
                            ))}
                            {Object.values(product.flags || {}).every(v => !v) && <span className="text-xs text-textSecondary/40 italic">Standard</span>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm font-medium text-textSecondary/70">
                {searching ? "Updating catalog..." : `Displaying ${products.length} of ${productTotal} products`}
              </p>
              {products.length < productTotal && (
                <button
                  onClick={loadMoreProducts}
                  className="rounded-xl border border-borderSoft/50 bg-white px-8 py-3.5 text-sm font-bold text-textPrimary shadow-subtle transition-all hover:bg-background hover:shadow-soft active:scale-95"
                >
                  {loadingMore ? "Fetching more..." : "Load more products"}
                </button>
              )}
            </div>
          </section>
        )}

        {activeView === "add-product" && <AdminProductForm mode="create" onSaved={addProduct} />}

        {activeView === "edit-product" && selectedProduct && (
          <AdminProductForm
            key={selectedProduct._id}
            mode="edit"
            product={selectedProduct}
            onSaved={updateProduct}
            onDeleted={removeProduct}
          />
        )}

        {activeView === "hero-images" && (
          <AdminHeroManager activeView={activeView} onChangeView={setActiveView} onLogout={logout} />
        )}

        {activeView === "crm" && <AdminCRM />}

        {activeView === "analytics" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[2rem] border border-borderSoft/50 bg-white/85 p-6 shadow-soft sm:p-8">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-cta" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cta">Insights</p>
            </div>
            <h2 className="font-serif mt-4 text-3xl text-textPrimary">Analytics Dashboard</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-textSecondary">
              Advanced analytics integration is coming soon. Soon you will be able to track real-time orders, 
              visitor traffic, and conversion metrics with interactive visual reports.
            </p>
            <div className="mt-10 h-64 w-full rounded-xl bg-background/50 border border-dashed border-borderSoft flex items-center justify-center">
              <p className="text-sm font-medium text-textSecondary/40 italic">Chart visualizations will appear here</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
