"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronRight, Image as ImageIcon, LogOut } from "lucide-react";
import { adminNavItems } from "@/components/adminNavItems";

export default function AdminHeroManager({ activeView, onChangeView, onLogout }) {
  const [slides, setSlides] = useState([]);
  const [selected, setSelected] = useState(null);
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState("");

  async function loadSlides() {
    const response = await fetch("/api/admin/hero");
    const result = await response.json();
    setSlides(result.data?.items || []);
  }

  useEffect(() => {
    loadSlides();
  }, []);

  function editSlide(slide) {
    setSelected(slide);
    setMedia(slide.images || []);
  }

  async function uploadHero(files) {
    if (!files.length) return;
    setStatus("Uploading hero image");
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error || "Upload failed");
      return;
    }
    setMedia(
      result.data.uploads.map(({ url, publicId, alt }) => ({
        url,
        publicId,
        alt,
      })),
    );
    setStatus("Hero image uploaded");
  }

  async function saveHero(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      sortOrder: Math.max(1, Number(formData.get("sortOrder"))),
      active: formData.get("active") === "on",
      images: media,
    };

    const url = selected?._id
      ? `/api/admin/hero/${selected._id}`
      : "/api/admin/hero";

    const method = selected?._id ? "PUT" : "POST";

    setStatus("Saving hero slide");

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setStatus(result.error || "Save failed");
      return;
    }

    setStatus("Hero slide saved");
    setSelected(null);
    setMedia([]);
    loadSlides();
    form.reset();
  }

  async function deleteHero(id) {
    const confirmed = window.confirm("Delete this hero slide?");
    if (!confirmed) return;
    await fetch(`/api/admin/hero/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    setSelected(null);
    setMedia([]);
    loadSlides();
  }

  const previewMedia = media.length > 0 ? media : selected?.images || [];

  return (
    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:grid-cols-[220px_minmax(0,1fr)_320px] xl:grid-cols-[240px_minmax(0,680px)_360px]">
      <nav className="grid gap-2 rounded-[2rem] border border-white/10 bg-dark/95 p-4 text-white shadow-soft backdrop-blur-sm lg:sticky lg:top-8 lg:self-start lg:flex lg:flex-col">
        <div className="hidden px-2 pb-3 lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/45">Hero Manager</p>
        </div>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (item.id === "products" && activeView === "edit-product");
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeView?.(item.id)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-xs font-bold uppercase tracking-[0.16em] transition-all duration-300 ${
                isActive
                  ? "bg-white text-dark shadow-subtle"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-white/40 group-hover:text-white"}`} />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}

        <div className="my-2 hidden border-t border-white/5 lg:block" />

        <button
          type="button"
          onClick={onLogout}
          className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-xs font-bold uppercase tracking-[0.16em] text-white/60 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4 text-white/40 group-hover:text-accentBrown" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="flex flex-col gap-6 xl:max-w-[680px] xl:mx-auto">
        <form
          key={selected?._id || "new-hero"}
          onSubmit={saveHero}
          className="relative overflow-hidden rounded-[2.5rem] border border-borderSoft/50 bg-white p-6 shadow-soft sm:p-8 lg:p-10"
        >
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-6 rounded-full bg-primary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Hero Studio</p>
            </div>
            <h1 className="font-serif mt-5 text-3xl tracking-tight text-textPrimary sm:text-4xl">
              {selected ? "Edit hero slide" : "Create hero slide"}
            </h1>
            
            <div className="mt-8 space-y-7">
              <div className="group">
                <label className="mb-2 ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary transition-colors group-focus-within:text-primary">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  Hero Title
                </label>
                <input
                  name="title"
                  required
                  defaultValue={selected?.title || ""}
                  className="w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-base font-medium text-textPrimary outline-none transition-all shadow-subtle placeholder:text-textSecondary/35 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 sm:px-6 sm:py-5"
                  placeholder="The pinnacle of modern aesthetics..."
                />
              </div>

              <div className="group">
                <label className="mb-2 ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary transition-colors group-focus-within:text-primary">
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  Supporting Copy
                </label>
                <textarea
                  name="subtitle"
                  required
                  defaultValue={selected?.subtitle || ""}
                  className="min-h-[130px] w-full resize-none rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-base font-medium text-textPrimary outline-none transition-all shadow-subtle placeholder:text-textSecondary/35 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 sm:px-6 sm:py-5"
                  placeholder="Detail the story behind this visual..."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="group">
                  <label className="mb-2 ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary transition-colors group-focus-within:text-primary">
                    Sort Order
                  </label>
                  <input
                    name="sortOrder"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={selected?.sortOrder ?? 1}
                    className="w-full rounded-2xl border border-borderSoft/50 bg-background/30 px-5 py-4 text-base font-medium text-textPrimary outline-none transition-all shadow-subtle focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 sm:px-6 sm:py-5"
                  />
                </div>
                <div className="flex items-end">
                  <label className="group flex h-[66px] w-full cursor-pointer items-center gap-4 rounded-2xl border border-borderSoft/50 bg-background/30 px-5 transition-all hover:border-primary/30 hover:bg-white hover:shadow-subtle sm:px-6">
                    <div className="relative flex items-center justify-center">
                      <input
                        name="active"
                        type="checkbox"
                        defaultChecked={selected?.active ?? true}
                        className="peer absolute h-6 w-6 cursor-pointer opacity-0"
                      />
                      <div className="h-6 w-6 rounded-lg border-2 border-borderSoft peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white scale-0 peer-checked:scale-100 transition-transform" />
                      </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-textPrimary">Publish Now</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                  Media Upload
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => uploadHero(event.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex items-center justify-between gap-4 rounded-2xl border-2 border-dashed border-borderSoft/60 bg-background/20 p-5 transition-all group-hover:border-primary/30 group-hover:bg-background/30 sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark text-white shadow-soft">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-textPrimary">Upload hero media</p>
                        <p className="text-[10px] uppercase tracking-tighter text-textSecondary">Supports high-res images</p>
                      </div>
                    </div>
                    <div className="rounded-full border border-borderSoft/50 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-textPrimary shadow-subtle">
                      Browse
                    </div>
                  </div>
                </div>
              </div>

              {media.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 animate-in zoom-in-95 duration-500">
                  {media.map((item) => (
                    <div key={item.publicId} className="group relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-borderSoft/30 bg-background shadow-soft">
                      <img
                        src={item.url}
                        alt={item.alt || ""}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Active Canvas</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="submit" className="group relative overflow-hidden rounded-2xl bg-dark px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-soft-xl transition-all hover:-translate-y-1 hover:bg-primary active:translate-y-0 sm:px-12 sm:py-5">
                <span className="relative z-10">{selected ? "Update Masterpiece" : "Publish Experience"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-cta opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => deleteHero(selected._id)}
                  className="rounded-2xl border border-accentBrown/10 bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-accentBrown transition-all hover:bg-accentBrown hover:text-white hover:shadow-soft active:scale-95 sm:px-10 sm:py-5"
                >
                  Discard
                </button>
              )}
              {status && (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{status}</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <aside className="flex flex-col gap-6 lg:self-start xl:sticky xl:top-8">
        <div className="overflow-hidden rounded-[2rem] border border-borderSoft/50 bg-white shadow-soft">
          <div className="border-b border-borderSoft/30 bg-background/40 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-textSecondary">Media Preview</p>
              <div className="rounded-full border border-borderSoft/40 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-textSecondary">
                {previewMedia.length} item{previewMedia.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-2 text-sm text-textSecondary/70">
              Preview the hero image stack that will appear on the storefront.
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-hidden rounded-[1.75rem] border border-borderSoft/30 bg-background/30 shadow-subtle">
              {previewMedia[0]?.url ? (
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src={previewMedia[0].url}
                    alt={previewMedia[0].alt || ""}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/75 to-transparent p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">Primary hero frame</p>
                    <p className="mt-1 text-sm font-medium text-white">{previewMedia[0].alt || selected?.title || "Untitled hero slide"}</p>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-borderSoft/50 bg-white text-textSecondary/25">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-textSecondary/40">No preview yet</p>
                  <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-textSecondary/40">
                    Upload or select hero media to preview the active frame here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-borderSoft/50 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-textSecondary">Catalog Queue</p>
            <div className="h-8 w-8 rounded-full border border-borderSoft/30 bg-background flex items-center justify-center text-[10px] font-bold text-textSecondary/50">
              {slides.length}
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {slides.map((slide) => (
              <button
                key={slide._id}
                type="button"
                onClick={() => editSlide(slide)}
                className={`group relative overflow-hidden rounded-3xl border text-left transition-all duration-500 ${
                  selected?._id === slide._id
                    ? "border-primary bg-white shadow-soft-xl ring-4 ring-primary/5"
                    : "border-borderSoft/30 bg-background/30 hover:border-primary/30 hover:bg-white hover:shadow-subtle"
                }`}
              >
                {slide.images?.[0]?.url && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={slide.images[0].url}
                      alt={slide.images[0].alt || ""}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-sm ${slide.active ? "bg-primary/90 text-white" : "bg-white/90 text-textSecondary"}`}>
                        {slide.active ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold leading-tight text-textPrimary transition-colors group-hover:text-primary">
                        {slide.title}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-textSecondary/50">
                        Position {slide.sortOrder}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-all duration-300 ${selected?._id === slide._id ? "translate-x-1 text-primary" : "text-textSecondary/20 opacity-0 group-hover:opacity-100"}`} />
                  </div>
                </div>
              </button>
            ))}
            
            {slides.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-borderSoft/50 bg-background text-textSecondary/20">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-textSecondary/40 uppercase tracking-widest">Empty Gallery</p>
                <p className="mt-2 text-[10px] text-textSecondary/30 max-w-[140px]">No slides have been curated yet.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="rounded-[2rem] border border-borderSoft/20 bg-dark p-6 text-white shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-1 rounded-full bg-primary" />
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/50">Curation Tip</p>
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-white/70">
            For the best impact, use images with a <span className="text-primary">16:9 aspect ratio</span> and high contrast for text legibility.
          </p>
        </div>
      </aside>
    </div>
  );
}
