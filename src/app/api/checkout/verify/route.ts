import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/supabase/api-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const user = await authenticateRequest(request);
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!user) return NextResponse.json({ error: "Please sign in to verify payment." }, { status: 401 });
  if (!secret) return NextResponse.json({ error: "Razorpay is not configured yet." }, { status: 503 });

  const body = (await request.json()) as { orderId?: string; razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string };
  if (!body.orderId || !body.razorpay_payment_id || !body.razorpay_order_id || !body.razorpay_signature) return NextResponse.json({ error: "Incomplete payment response." }, { status: 400 });

  try {
    const supabase = createAdminSupabaseClient();
    const { data: order } = await supabase.from("orders").select("id, razorpay_order_id").eq("id", body.orderId).eq("user_id", user.id).single();
    if (!order || order.razorpay_order_id !== body.razorpay_order_id) return NextResponse.json({ error: "Order validation failed." }, { status: 400 });

    const expected = createHmac("sha256", secret).update(`${order.razorpay_order_id}|${body.razorpay_payment_id}`).digest("hex");
    const received = body.razorpay_signature;
    const valid = expected.length === received.length && timingSafeEqual(Buffer.from(expected), Buffer.from(received));
    if (!valid) return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });

    await supabase.from("orders").update({ status: "paid", payment_id: body.razorpay_payment_id, payment_signature: received }).eq("id", order.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Payment verification service is unavailable." }, { status: 503 });
  }
}
