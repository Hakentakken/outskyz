import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

async function authenticatedUser(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !key) return null;
  const client = createClient(url, key);
  const { data } = await client.auth.getUser(token);
  return data.user;
}

export async function POST(request: NextRequest) {
  const user = await authenticatedUser(request);
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!user) return NextResponse.json({ error: "Please sign in to checkout." }, { status: 401 });
  if (!keyId || !keySecret) return NextResponse.json({ error: "Razorpay is not configured yet." }, { status: 503 });

  try {
    const supabase = createServerSupabaseClient();
    const [{ data: cartItems, error: cartError }, { data: profile }] = await Promise.all([
      supabase.from("cart_items").select("*").eq("user_id", user.id),
      supabase.from("profiles").select("full_name, phone").eq("id", user.id).single(),
    ]);
    if (cartError || !cartItems?.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });

    const currencies = [...new Set(cartItems.map((item) => item.currency))];
    if (currencies.length !== 1) return NextResponse.json({ error: "Please check out items in one currency at a time." }, { status: 400 });
    const currency = currencies[0];
    const total = cartItems.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
    const amount = Math.round(total * 100);
    const orderNumber = `OSK-${Date.now()}`;

    const { data: order, error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      order_number: orderNumber,
      status: "pending",
      total_amount: total,
      currency,
      customer_name: profile?.full_name ?? user.email,
      customer_email: user.email,
      customer_phone: profile?.phone ?? null,
    }).select("id").single();
    if (orderError || !order) return NextResponse.json({ error: "Could not create your order." }, { status: 500 });

    const { error: itemError } = await supabase.from("order_items").insert(cartItems.map((item) => ({
      order_id: order.id,
      item_type: item.item_type,
      item_slug: item.item_slug,
      item_name: item.item_name,
      item_image: item.item_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency: item.currency,
    })));
    if (itemError) return NextResponse.json({ error: "Could not save your order items." }, { status: 500 });

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({ amount, currency, receipt: orderNumber, notes: { outskyz_order_id: order.id, customer_id: user.id } }),
    });
    const razorpayOrder = (await razorpayResponse.json()) as { id?: string; error?: { description?: string } };
    if (!razorpayResponse.ok || !razorpayOrder.id) return NextResponse.json({ error: razorpayOrder.error?.description ?? "Razorpay could not create this order." }, { status: 502 });

    await supabase.from("orders").update({ razorpay_order_id: razorpayOrder.id }).eq("id", order.id);
    return NextResponse.json({ orderId: order.id, orderNumber, razorpayOrderId: razorpayOrder.id, keyId, amount, currency });
  } catch {
    return NextResponse.json({ error: "Checkout service is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local." }, { status: 503 });
  }
}
