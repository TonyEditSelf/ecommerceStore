"use client";

import { useState } from "react";
import { categories } from "@/data/products";
import OptimizedImage from "@/components/OptimizedImage";
import RichTextEditor from "@/components/RichTextEditor";

const badgeLabels = ["featured", "latest", "bestSelling", "fastSelling"];

export default function AdminProductForm({ mode = "create", product = null, onSaved, onDeleted }) {
  const [description, setDescription] = useState(product?.description || "<p>Write a premium product description.</p>");
  const [status, setStatus] = useState("");
  const [media, setMedia] = useState(product?.media || []);

  async function uploadFiles(files) {
    if (!files.length) return;
    setStatus("Uploading media...");
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const result = await response.json();
      console.log("[AdminProductForm] upload response:", result);
      if (!response.ok) {
        setStatus(`Upload failed: ${result.error || response.statusText}`);
        return;
      }
      const uploads = result.data?.uploads || [];
      if (!uploads.length) {
        setStatus("Upload returned no files");
        return;
      }
      setMedia((current) => [...current, ...uploads]);
      setStatus(`${uploads.length} file(s) uploaded successfully`);
    } catch (err) {
      console.error("[AdminProductForm] upload error:", err);
      setStatus(`Upload error: ${err.message}`);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setStatus("Saving product");
    const formData = new FormData(event.currentTarget);
    const flags = {};
    badgeLabels.forEach((badge) => {
      flags[badge] = formData.get(badge) === "on";
    });

    const payload = {
      title: formData.get("title"),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      stock: Number(formData.get("stock")),
      rating: Number(formData.get("rating")),
      description,
      media,
      flags,
    };

    const url = mode === "edit" ? `/api/products/${product._id}` : "/api/products";
    console.log("Saving product with payload:", payload);
    const response = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error || "Save failed");
      return;
    }
    setStatus(mode === "edit" ? "Product updated" : "Product added");
    onSaved?.(result.data);
  }

  async function deleteProduct() {
    if (!product?._id) return;
    const confirmed = window.confirm("Delete this product permanently?");
    if (!confirmed) return;

    setStatus("Deleting product");
    const response = await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error || "Delete failed");
      return;
    }
    setStatus("Product deleted");
    onDeleted?.(product._id);
  }

  return (
    <form onSubmit={submit} className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-[2rem] border border-borderSoft/50 bg-white p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
          Catalog Management
        </p>
      </div>
      <h1 className="font-serif mt-4 text-3xl text-textPrimary">
        {mode === "edit" ? "Refine Product Details" : "Curate New Collection"}
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Product Title</label>
            <input name="title" required defaultValue={product?.title || ""} className="mt-2 w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-sm font-medium text-textPrimary outline-none focus:border-primary focus:ring-4 ring-primary/10 transition-all shadow-subtle" placeholder="e.g. Signature Leather Tote" />
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Price (INR)</label>
              <input name="price" required type="number" min="0" defaultValue={product?.price || ""} className="mt-2 w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-sm font-bold text-textPrimary outline-none focus:border-primary focus:ring-4 ring-primary/10 transition-all shadow-subtle" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Category</label>
              <select name="category" defaultValue={product?.category || categories[0].slug} className="mt-2 w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-sm font-bold text-textPrimary outline-none focus:border-primary focus:ring-4 ring-primary/10 transition-all shadow-subtle appearance-none cursor-pointer">
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Inventory Level</label>
              <input name="stock" required type="number" min="0" defaultValue={product?.stock ?? 25} className="mt-2 w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-sm font-medium text-textPrimary outline-none focus:border-primary focus:ring-4 ring-primary/10 transition-all shadow-subtle" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Curator Rating</label>
              <input name="rating" required type="number" min="0" max="5" step="0.1" defaultValue={product?.rating ?? 4.8} className="mt-2 w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-sm font-medium text-textPrimary outline-none focus:border-primary focus:ring-4 ring-primary/10 transition-all shadow-subtle" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Visual Assets</label>
            <div className="mt-2 relative">
              <input type="file" multiple accept="image/*,video/*" onChange={(event) => uploadFiles(event.target.files)} className="block w-full text-sm text-textSecondary file:mr-4 file:py-3.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-dark file:text-white hover:file:bg-primary transition-all cursor-pointer rounded-2xl border border-dashed border-borderSoft p-2" />
            </div>
          </div>

          {media.length > 0 && (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {media.map((item) => (
                <div key={item.publicId} className="group relative rounded-2xl border border-borderSoft/30 bg-background/50 p-2 shadow-subtle transition-all hover:shadow-soft">
                  {item.type === "video" ? (
                    <video src={item.url} className="aspect-square w-full rounded-xl object-cover" />
                  ) : (
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-white shadow-inner">
                      <img
                        src={item.url}
                        alt={item.alt || ""}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setMedia((current) => current.filter((mediaItem) => mediaItem.publicId !== item.publicId))}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-accentBrown text-white flex items-center justify-center text-[10px] font-bold shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest ml-1">Product Narrative</label>
        <div className="mt-2 rounded-2xl border border-borderSoft/50 overflow-hidden shadow-subtle">
          <RichTextEditor value={description} onChange={setDescription} />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {badgeLabels.map((badge) => (
          <label key={badge} className="flex items-center gap-3 rounded-xl border border-borderSoft/30 bg-background/20 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-textSecondary cursor-pointer transition-all hover:bg-white hover:shadow-subtle">
            <input name={badge} type="checkbox" defaultChecked={Boolean(product?.flags?.[badge])} className="h-4 w-4 rounded border-borderSoft text-primary focus:ring-primary accent-primary" />
            {badge}
          </label>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4 border-t border-borderSoft/30 pt-8">
        <button className="rounded-2xl bg-dark px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-soft transition-all hover:bg-primary active:scale-95">
          {mode === "edit" ? "Synchronize Changes" : "Commit to Catalog"}
        </button>
        {mode === "edit" && (
          <button type="button" onClick={deleteProduct} className="rounded-2xl bg-white border border-accentBrown/20 px-10 py-4 text-sm font-bold uppercase tracking-widest text-accentBrown transition-all hover:bg-accentBrown/5 active:scale-95">
            Remove from Catalog
          </button>
        )}
      </div>
      {status && <p className="mt-6 text-xs font-bold text-primary uppercase tracking-widest text-center">{status}</p>}
    </form>
  );
}
