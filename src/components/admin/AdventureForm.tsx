"use client";

import { useForm } from "react-hook-form";
import { cn } from "@/utils/cn";
import {
  type AdventureCategory,
  type DbAdventure,
  currencyOptions,
  difficultyOptions,
} from "@/data/adventures";

const categoryOptions: { value: AdventureCategory; label: string }[] = [
  { value: "sky", label: "Sky" },
  { value: "water", label: "Water" },
  { value: "land", label: "Land" },
  { value: "luxury", label: "Luxury" },
];

const fieldClasses =
  "w-full rounded-sm border border-gold/25 bg-coal/50 px-3 py-2 text-sm text-ivory placeholder:text-muted focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";
const labelClasses =
  "mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gold";

export interface AdventureFormValues {
  number: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: AdventureCategory;
  categoryLabel: string;
  image: string;
  difficulty: (typeof difficultyOptions)[number];
  duration: string;
  ageLimit: string;
  location: string;
  overview: string;
  price: number;
  currency: string;
  is_active: boolean;
}

interface Props {
  /** `null` → create mode; otherwise pre-fill for editing. */
  initialData?: DbAdventure | null;
  onSave: (data: AdventureFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Full create / edit form for an adventure plan.
 *
 * Writes every column the `adventures` table exposes — including the
 * description and the rate (price) — so admins can fully reword an
 * existing plan or spin up a brand-new one from this single form.
 */
export function AdventureForm({
  initialData,
  onSave,
  onCancel,
  loading,
}: Props) {
  const isNew = !initialData;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdventureFormValues>({
    defaultValues: initialData
      ? {
          number: initialData.number ?? "",
          slug: initialData.slug,
          title: initialData.title ?? "",
          shortDescription: initialData.short_description ?? "",
          description: initialData.description ?? "",
          category: (initialData.category as AdventureCategory) ?? "sky",
          categoryLabel: initialData.category_label ?? "Sky",
          image: initialData.image ?? "",
          difficulty:
            (initialData.difficulty as (typeof difficultyOptions)[number]) ??
            "Beginner",
          duration: initialData.duration ?? "",
          ageLimit: initialData.age_limit ?? "",
          location: initialData.location ?? "",
          overview: initialData.overview ?? "",
          price:
            typeof initialData.price === "string"
              ? Number.parseFloat(initialData.price)
              : initialData.price ?? 0,
          currency: initialData.currency ?? "INR",
          is_active: initialData.is_active ?? true,
        }
      : {
          number: "",
          slug: "",
          title: "",
          shortDescription: "",
          description: "",
          category: "sky",
          categoryLabel: "Sky",
          image: "",
          difficulty: "Beginner",
          duration: "",
          ageLimit: "",
          location: "",
          overview: "",
          price: 0,
          currency: "INR",
          is_active: true,
        },
  });

  const image = watch("image");

  const onSubmit = async (data: AdventureFormValues) => {
    const category = data.category;
    const categoryLabel =
      data.categoryLabel && data.categoryLabel.trim()
        ? data.categoryLabel
        : categoryOptions.find((c) => c.value === category)?.label ?? category;
    await onSave({ ...data, category, categoryLabel });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl text-ivory">
          {isNew ? "Create New Adventure" : `Edit "${initialData?.title ?? ""}"`}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Number (e.g. 07)</label>
          <input {...register("number")} placeholder="07" className={fieldClasses} />
        </div>
        <div>
          <label className={labelClasses}>Slug *</label>
          <input
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: "Lowercase letters, numbers and hyphens only",
              },
            })}
            placeholder="tandem-skydiving"
            className={fieldClasses}
          />
          {errors.slug && (
            <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>
          )}
        </div>
      </div>
            <div>
        <label className={labelClasses}>Title *</label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Skydiving"
          className={fieldClasses}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className={labelClasses}>Short Description</label>
        <textarea
          {...register("shortDescription")}
          rows={3}
          placeholder="A short, punchy line shown on adventure cards."
          className={fieldClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Full Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={5}
          placeholder="Detailed description shown on the adventure page."
          className={fieldClasses}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Category</label>
          <select {...register("category")} className={fieldClasses}>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Category Label</label>
          <input
            {...register("categoryLabel")}
            placeholder="Sky"
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Image URL / Path *</label>
        <input
          {...register("image", { required: "Image is required" })}
          placeholder="/resources/... or https://images.unsplash.com/..."
          className={fieldClasses}
        />
        {errors.image && (
          <p className="mt-1 text-xs text-red-400">{errors.image.message}</p>
        )}
        {image ? (
          <div className="mt-3 w-full max-w-xs overflow-hidden rounded-md border border-gold/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Duration</label>
          <input
            {...register("duration")}
            placeholder="Half day"
            className={fieldClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>Age Limit</label>
          <input
            {...register("ageLimit")}
            placeholder="16+ years"
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Overview</label>
        <textarea
          {...register("overview")}
          rows={4}
          placeholder="Longer overview shown in the hero section of the detail page."
          className={fieldClasses}
        />
      </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Difficulty</label>
          <select {...register("difficulty")} className={fieldClasses}>
            {difficultyOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClasses}>Rate (Price) *</label>
          <input
            type="number"
            min={0}
            step={0.01}
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Must be 0 or more" },
              valueAsNumber: true,
            })}
            placeholder="299"
            className={fieldClasses}
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Currency</label>
        <select {...register("currency")} className={fieldClasses}>
          {currencyOptions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="is_active"
          type="checkbox"
          {...register("is_active")}
          className="h-4 w-4 rounded border-gold/40 bg-coal/50 text-gold focus:ring-gold/40"
        />
        <label htmlFor="is_active" className="text-sm text-ivory/80">
          Active (visible on the site &amp; bookable)
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-sm border border-gold/30 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-ivory/60 transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "rounded-sm px-6 py-2 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:opacity-90 disabled:opacity-50",
            "bg-gold",
          )}
        >
          {loading ? "Saving..." : isNew ? "Create Adventure" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
