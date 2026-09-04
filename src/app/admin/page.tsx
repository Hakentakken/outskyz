"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { GoldLine } from "@/components/ui/GoldLine";
import {
  AdventureForm,
  type AdventureFormValues,
} from "@/components/admin/AdventureForm";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { adventures, type DbAdventure } from "@/data/adventures";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { galleryImages, type DbGalleryImage } from "@/data/gallery";

type Tab = "prices" | "adventures" | "destinations" | "packages" | "gallery" | "orders";

interface DbDestination {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
}

interface DbPackage {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  is_active: boolean;
}

interface DbOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  customer_name: string | null;
  customer_email: string | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("prices");
  const [dbAdventures, setDbAdventures] = useState<DbAdventure[]>([]);
  const [dbDestinations, setDbDestinations] = useState<DbDestination[]>([]);
  const [dbPackages, setDbPackages] = useState<DbPackage[]>([]);
  const [dbGallery, setDbGallery] = useState<DbGalleryImage[]>([]);
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingAdventure, setEditingAdventure] = useState<DbAdventure | null>(
    null,
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();

      const [advRes, destRes, pkgRes, galRes, ordRes] = await Promise.all([
        supabase.from("adventures").select("*").order("created_at"),
        supabase.from("destinations").select("*").order("created_at"),
        supabase.from("packages").select("*").order("created_at"),
        supabase.from("gallery_images").select("*").order("created_at"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      if (!advRes.error) setDbAdventures(advRes.data as DbAdventure[]);
      if (!destRes.error) setDbDestinations(destRes.data as DbDestination[]);
      if (!pkgRes.error) setDbPackages(pkgRes.data as DbPackage[]);
      if (!galRes.error) setDbGallery(galRes.data as DbGalleryImage[]);
      if (!ordRes.error) setDbOrders(ordRes.data as DbOrder[]);
    };
    fetchData();
  }, [isAdmin]);
    const syncAdventures = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();

    // Preserve manually-set rates: read existing prices/currency before
    // overwriting descriptive content from the static seed. New seed
    // adventures fall back to the original 299 INR behaviour.
    const { data: existing } = await supabase
      .from("adventures")
      .select("slug, price, currency");
    const priceMap = new Map<string, { price: number; currency: string }>();
    (existing ?? []).forEach((row) => {
      if (row.slug) {
        priceMap.set(row.slug, {
          price: Number(row.price ?? 0),
          currency: row.currency ?? "INR",
        });
      }
    });

    for (const adventure of adventures) {
      const saved = priceMap.get(adventure.slug) ?? { price: 299, currency: "INR" };
      const { error } = await supabase.from("adventures").upsert(
        {
          slug: adventure.slug,
          number: adventure.number,
          title: adventure.title,
          short_description: adventure.shortDescription,
          description: adventure.description,
          category: adventure.category,
          category_label: adventure.categoryLabel,
          image: adventure.image,
          difficulty: adventure.difficulty,
          duration: adventure.duration,
          age_limit: adventure.ageLimit,
          location: adventure.location,
          overview: adventure.overview,
          price: saved.price,
          currency: saved.currency,
          is_active: true,
        },
        { onConflict: "slug" },
      );
      if (error) {
        setMessage(`Error syncing ${adventure.title}: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    const { data } = await supabase.from("adventures").select("*");
    if (data) setDbAdventures(data as DbAdventure[]);
    setMessage("Adventures synced successfully!");
    setSaving(false);
  };

  const saveAdventureForm = async (data: AdventureFormValues) => {
    setSaving(true);
    setMessage(null);
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("adventures").upsert(
      {
        slug: data.slug,
        number: data.number,
        title: data.title,
        short_description: data.shortDescription,
        description: data.description,
        category: data.category,
        category_label: data.categoryLabel,
        image: data.image,
        difficulty: data.difficulty,
        duration: data.duration,
        age_limit: data.ageLimit,
        location: data.location,
        overview: data.overview,
        price: data.price,
        currency: data.currency,
        is_active: data.is_active,
      },
      { onConflict: "slug" },
    );
    if (!error) {
      setMessage(creating ? "Adventure created!" : "Adventure updated!");
      const { data: fresh } = await supabase
        .from("adventures")
        .select("*")
        .order("created_at");
      if (fresh) setDbAdventures(fresh as DbAdventure[]);
      setCreating(false);
      setEditingAdventure(null);
    } else {
      setMessage(`Error: ${error.message}`);
    }
    setSaving(false);
  };

  const deleteAdventure = async (id: string, title: string) => {
    if (!confirm(`Remove "${title}"? This cannot be undone.`)) return;
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("adventures").delete().eq("id", id);
    if (!error) {
      setDbAdventures((prev) => prev.filter((a) => a.id !== id));
      setMessage("Adventure removed!");
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };
    const syncDestinations = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();

    for (const destination of destinations) {
      const { error } = await supabase.from("destinations").upsert(
        {
          slug: destination.slug,
          name: destination.name,
          country: destination.country,
          short_description: destination.shortDescription,
          description: destination.description,
          image: destination.image,
          adventure_count: destination.adventureCount,
          is_active: true,
        },
        { onConflict: "slug" },
      );
      if (error) {
        setMessage(`Error syncing ${destination.name}: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    const { data } = await supabase.from("destinations").select("*");
    if (data) setDbDestinations(data as DbDestination[]);
    setMessage("Destinations synced successfully!");
    setSaving(false);
  };

  const syncPackages = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();

    for (const pkg of packages) {
      const { error } = await supabase.from("packages").upsert(
        {
          slug: pkg.slug,
          name: pkg.name,
          description: pkg.description,
          destination: pkg.destination,
          duration: pkg.duration,
          duration_days: pkg.durationDays,
          price: parseFloat(pkg.price.replace(/[^0-9.]/g, "")),
          currency: pkg.slug === "russia-sky-adventure" ? "INR" : "USD",
          image: pkg.image,
          group_size: pkg.groupSize,
          overview: pkg.overview,
          is_active: true,
        },
        { onConflict: "slug" },
      );
      if (error) {
        setMessage(`Error syncing ${pkg.name}: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    const { data } = await supabase.from("packages").select("*");
    if (data) setDbPackages(data as DbPackage[]);
    setMessage("Packages synced successfully!");
    setSaving(false);
  };

  const syncGallery = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();

    for (const image of galleryImages) {
      const { error } = await supabase.from("gallery_images").upsert(
        {
          src: image.src,
          alt: image.alt,
          category: image.category,
          category_label: image.categoryLabel,
          is_active: true,
        },
        { onConflict: "src" },
      );
      if (error) {
        setMessage(`Error syncing gallery: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    const { data } = await supabase.from("gallery_images").select("*");
    if (data) setDbGallery(data as DbGalleryImage[]);
    setMessage("Gallery synced successfully!");
    setSaving(false);
  };
    const updateAdventurePrice = async (id: string, price: number) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("adventures").update({ price }).eq("id", id);
    if (!error) {
      setDbAdventures((prev) => prev.map((a) => (a.id === id ? { ...a, price } : a)));
      setMessage("Price updated!");
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };

  const updatePackagePrice = async (id: string, price: number) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("packages").update({ price }).eq("id", id);
    if (!error) {
      setDbPackages((prev) => prev.map((p) => (p.id === id ? { ...p, price } : p)));
      setMessage("Price updated!");
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };

  const toggleAdventureActive = async (id: string, isActive: boolean) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("adventures").update({ is_active: isActive }).eq("id", id);
    if (!error) {
      setDbAdventures((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: isActive } : a)));
    }
  };

  const toggleGalleryActive = async (id: string, isActive: boolean) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("gallery_images").update({ is_active: isActive }).eq("id", id);
    if (!error) {
      setDbGallery((prev) => prev.map((g) => (g.id === id ? { ...g, is_active: isActive } : g)));
    }
  };

  const deleteGalleryImage = async (id: string) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (!error) {
      setDbGallery((prev) => prev.filter((g) => g.id !== id));
      setMessage("Image deleted!");
    }
  };

  const addGalleryImage = async (src: string, alt: string, category: string, categoryLabel: string) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("gallery_images").insert({
      src,
      alt,
      category,
      category_label: categoryLabel,
      is_active: true,
    });
    if (!error) {
      const { data } = await supabase.from("gallery_images").select("*");
      if (data) setDbGallery(data as DbGalleryImage[]);
      setMessage("Image added!");
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) {
      setDbOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setMessage("Order status updated!");
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };

  const syncOrders = async () => {
    setSaving(true);
    const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) {
      setDbOrders(data as DbOrder[]);
      setMessage("Orders synced successfully!");
    } else {
      setMessage(`Error syncing orders: ${error.message}`);
    }
    setSaving(false);
  };
    const tabs: { id: Tab; label: string }[] = [
    { id: "prices", label: "Prices" },
    { id: "adventures", label: "Adventures" },
    { id: "destinations", label: "Destinations" },
    { id: "packages", label: "Packages" },
    { id: "gallery", label: "Gallery" },
    { id: "orders", label: "Orders" },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Loading...
      </div>
    );
  }

  // Not signed in → send to the login screen.
  if (!user) {
    router.push("/login");
    return null;
  }

  // Signed in but not an administrator → this account is restricted.
  // The account configured as admin in the database
  // (vivekganwal2004@gmail.com) is the one permitted to manage content.
  if (!isAdmin) {
    return (
      <Section background="default" spacing="large">
        <Container>
          <div className="mx-auto max-w-xl rounded-md border border-red-500/40 bg-red-500/10 p-6 text-center">
            <h2 className="font-display text-xl text-ivory">
              Access Restricted
            </h2>
            <p className="mt-2 text-sm text-muted">
              This area is for administrators only (signed in as{" "}
              {user?.email}). Your account does not have admin privileges.
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <PageHero
        heading="ADMIN PANEL"
        subtitle="Manage prices, content, and orders."
        image="/resources/gallery/1.jpg"
      />
      <Section background="default" spacing="large">
        <Container>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-ivory">Dashboard</h2>
              <p className="mt-1 text-sm text-muted">
                Signed in as {profile?.email} ({isAdmin ? "Admin" : "User"})
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab.id
                      ? "border-gold bg-gold text-black"
                      : "border-gold/30 text-ivory/60 hover:border-gold/60 hover:text-ivory"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className="mb-6 rounded-sm border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
              {message}
            </div>
          )}

          <GoldLine className="mb-10" />
                    {/* PRICES TAB */}
          {activeTab === "prices" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">Adventure Prices</h3>
                <button
                  type="button"
                  onClick={syncAdventures}
                  disabled={saving}
                  className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Sync Adventures"}
                </button>
              </div>
              <div className="overflow-x-auto rounded-md border border-gold/20">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gold/20 bg-coal/50">
                    <tr>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Adventure</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Category</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Location</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Rate</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbAdventures.map((adventure) => (
                      <tr key={adventure.id} className="border-b border-gold/10 last:border-0">
                        <td className="px-4 py-3 text-ivory">{adventure.title}</td>
                        <td className="px-4 py-3 text-muted">{adventure.category ?? adventure.location ?? adventure.slug}</td>
                        <td className="px-4 py-3 text-muted">{adventure.location ?? adventure.slug}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={Number(adventure.price ?? 0)}
                            onBlur={(e) => updateAdventurePrice(adventure.id, parseFloat(e.target.value) || 0)}
                            className="w-28 rounded-sm border border-gold/25 bg-coal/50 px-3 py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleAdventureActive(adventure.id, !adventure.is_active)}
                            className={`rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-widest ${adventure.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                          >
                            {adventure.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Package Prices */}
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">Package Prices</h3>
                <button
                  type="button"
                  onClick={syncPackages}
                  disabled={saving}
                  className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Sync Packages"}
                </button>
              </div>
              <div className="overflow-x-auto rounded-md border border-gold/20">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gold/20 bg-coal/50">
                    <tr>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Package</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Destination</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Duration</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbPackages.map((pkg) => (
                      <tr key={pkg.id} className="border-b border-gold/10 last:border-0">
                        <td className="px-4 py-3 text-ivory">{pkg.name}</td>
                        <td className="px-4 py-3 text-muted">{pkg.slug}</td>
                        <td className="px-4 py-3 text-muted">{pkg.slug}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={pkg.price}
                            onBlur={(e) => updatePackagePrice(pkg.id, parseFloat(e.target.value) || 0)}
                            className="w-28 rounded-sm border border-gold/25 bg-coal/50 px-3 py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
                    {/* ADVENTURES TAB */}
          {activeTab === "adventures" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">
                  Manage Adventures
                </h3>
                <div className="flex items-center gap-2">
                  {!creating && !editingAdventure && (
                    <button
                      type="button"
                      onClick={() => {
                        setCreating(true);
                        setEditingAdventure(null);
                      }}
                      className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
                    >
                      <Plus className="h-4 w-4" />
                      Create New
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={syncAdventures}
                    disabled={saving}
                    className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                  >
                    {saving ? "Syncing..." : "Sync from Data"}
                  </button>
                </div>
              </div>

              {creating || editingAdventure ? (
                <div className="rounded-md border border-gold/20 bg-void/50 p-6">
                  <AdventureForm
                    initialData={editingAdventure}
                    onSave={saveAdventureForm}
                    onCancel={() => {
                      setCreating(false);
                      setEditingAdventure(null);
                    }}
                    loading={saving}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {dbAdventures.map((adventure) => (
                    <div
                      key={adventure.id}
                      className="rounded-md border border-gold/20 bg-void/50 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display text-lg text-ivory">
                          {adventure.title}
                        </h4>
                        <Badge>
                          {adventure.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        Slug: {adventure.slug}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Rate: {adventure.currency ?? "INR"}{" "}
                        {Number(adventure.price ?? 0).toFixed(2)}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/adventures/${adventure.slug}`}
                          className="rounded-sm border border-gold/30 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setEditingAdventure(adventure)}
                          className="rounded-sm border border-gold/30 px-3 py-1.5 text-xs text-ivory/70 transition-colors hover:bg-gold/10"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleAdventureActive(
                              adventure.id,
                              !adventure.is_active,
                            )
                          }
                          className="rounded-sm border border-gold/30 px-3 py-1.5 text-xs text-ivory/70 transition-colors hover:bg-gold/10"
                        >
                          Toggle
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            deleteAdventure(adventure.id, adventure.title)
                          }
                          className="rounded-sm border border-red-500/40 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
                    {/* DESTINATIONS TAB */}
          {activeTab === "destinations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">
                  Manage Destinations
                </h3>
                <button
                  type="button"
                  onClick={syncDestinations}
                  disabled={saving}
                  className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Sync from Data"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {dbDestinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="rounded-md border border-gold/20 bg-void/50 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg text-ivory">
                        {destination.name}
                      </h4>
                      <Badge>
                        {destination.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      Slug: {destination.slug}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/destinations/${destination.slug}`}
                        className="rounded-sm border border-gold/30 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">
                  Manage Packages
                </h3>
                <button
                  type="button"
                  onClick={syncPackages}
                  disabled={saving}
                  className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Sync from Data"}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dbPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="rounded-md border border-gold/20 bg-void/50 p-6"
                  >
                    <h4 className="font-display text-lg text-ivory">{pkg.name}</h4>
                    <p className="mt-2 text-xs text-muted">Slug: {pkg.slug}</p>
                    <p className="mt-1 text-xs text-muted">
                      Price: ${pkg.price}
                    </p>
                    <div className="mt-4">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="rounded-sm border border-gold/30 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                    {/* GALLERY TAB */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">
                  Manage Gallery
                </h3>
                <button
                  type="button"
                  onClick={syncGallery}
                  disabled={saving}
                  className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Sync from Data"}
                </button>
              </div>
              <GalleryForm
                onSave={async (data) => {
                  setSaving(true);
                  await addGalleryImage(
                    data.src,
                    data.alt,
                    data.category,
                    data.categoryLabel,
                  );
                  setSaving(false);
                }}
                loading={saving}
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {dbGallery.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-md border border-gold/20 bg-coal"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt ?? ""}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="px-3 text-center text-xs text-ivory">
                        {image.alt}
                      </p>
                      <p className="text-xs text-gold">
                        {image.category_label}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleGalleryActive(image.id, !image.is_active)
                          }
                          className="rounded-sm border border-gold/40 px-3 py-1 text-xs text-gold hover:bg-gold/10"
                        >
                          {image.is_active ? "Hide" : "Show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteGalleryImage(image.id)}
                          className="rounded-sm border border-red-500/40 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                    {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ivory">
                  Manage Orders
                </h3>
                <button
                  type="button"
                  onClick={syncOrders}
                  disabled={saving}
                  className="rounded-sm border border-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                >
                  {saving ? "Syncing..." : "Sync Orders"}
                </button>
              </div>
              <div className="overflow-x-auto rounded-md border border-gold/20">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gold/20 bg-coal/50">
                    <tr>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Order #</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Customer</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Status</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Total</th>
                      <th className="px-4 py-3 text-xs uppercase tracking-widest text-gold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gold/10 last:border-0"
                      >
                        <td className="px-4 py-3 text-ivory">
                          {order.order_number}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {order.customer_name} ({order.customer_email})
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            className="rounded-sm border border-gold/25 bg-coal/50 px-3 py-1.5 text-sm text-ivory focus:border-gold focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {order.total_amount} {order.currency}
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {order.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </Container>
      </Section>
    </>
  );
}









