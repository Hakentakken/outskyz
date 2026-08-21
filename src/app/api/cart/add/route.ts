import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type Product = { id: string; slug: string; title?: string; name?: string; image: string | null; price: number; currency: string; is_active: boolean };

async function authenticate(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !key) return null;
  const client = createClient(url, key);
  const { data } = await client.auth.getUser(token);
  return data.user;
}

export async function POST(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Please sign in to add an item." }, { status: 401 });

  const body = (await request.json()) as { itemType?: "adventure" | "package"; itemSlug?: string };
  if (!body.itemType || !body.itemSlug) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });

  try {
    const supabase = createServerSupabaseClient();
    const table = body.itemType === "adventure" ? "adventures" : "packages";
    const { data, error } = await supabase.from(table).select("id, slug, title, name, image, price, currency, is_active").eq("slug", body.itemSlug).eq("is_active", true).single();
    const product = data as Product | null;
    if (error || !product) return NextResponse.json({ error: "This plan is unavailable. Ask the admin to sync it first." }, { status: 404 });

    const { error: cartError } = await supabase.from("cart_items").upsert(
      {
        user_id: user.id,
        item_type: body.itemType,
        item_id: product.id,
        item_slug: product.slug,
        item_name: product.title ?? product.name ?? product.slug,
        item_image: product.image,
        quantity: 1,
        unit_price: product.price,
        currency: product.currency,
      },
      { onConflict: "user_id,item_type,item_id" },
    );
    if (cartError) return NextResponse.json({ error: cartError.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cart service is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local." }, { status: 503 });
  }
}
