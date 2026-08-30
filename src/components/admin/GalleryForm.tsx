"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { galleryCategories, type GalleryImage } from "@/data/gallery";

const categoryOptions = galleryCategories.filter((c) => c.id !== "all");

export interface GalleryImageInput {
  src: string;
  alt: string;
  category: string;
  categoryLabel: string;
}

interface Props {
  onSave: (data: GalleryImageInput) => Promise<void>;
  loading?: boolean;
}

/**
 * Inline form for adding a new picture (or video) to the gallery.
 * The image is referenced by URL or local path, matching how the rest of
 * the site already stores gallery sources.
 */
export function GalleryForm({ onSave, loading }: Props) {
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState<string>(
    categoryOptions[0]?.id ?? "experiences",
  );

  const categoryLabel =
    categoryOptions.find((c) => c.id === category)?.label ?? category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!src.trim()) return;
    await onSave({ src: src.trim(), alt: alt.trim(), category, categoryLabel });
    setSrc("");
    setAlt("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-gold/20 bg-void/40 p-5"
    >
      <h3 className="font-display text-lg text-ivory">Add to Gallery</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            Image / Video URL or Path *
          </label>
          <input
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            required
            placeholder="/resources/gallery/... or https://..."
            className="w-full rounded-sm border border-gold/25 bg-coal/50 px-3 py-2 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
          />
          {src ? (
            <div className="mt-3 w-full max-w-xs overflow-hidden rounded-md border border-gold/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : null}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            Alt Text
          </label>
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the picture"
            className="w-full rounded-sm border border-gold/25 bg-coal/50 px-3 py-2 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-sm border border-gold/25 bg-coal/50 px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
          >
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={loading || !src.trim()}
          className={cn(
            "rounded-sm px-5 py-2 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:opacity-90 disabled:opacity-50",
            "bg-gold",
          )}
        >
          {loading ? "Adding..." : "Add Image"}
        </button>
      </div>
    </form>
  );
}
