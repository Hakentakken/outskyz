"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Container } from "@/components/ui/Container";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  created_at: string;
  payment_id: string | null;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const supabase = (await import("@/lib/supabase/client")).getBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <>
        <PageHero heading="YOUR ORDERS" subtitle="Sign in to view your orders." image="/resources/gallery/1.jpg" />
        <Section background="default" spacing="large">
          <Container>
            <div className="mx-auto max-w-md text-center">
              <h2 className="font-display text-2xl text-ivory">Please Sign In</h2>
              <p className="mt-3 text-muted">Sign in to view your orders.</p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright"
              >
                Sign In
              </Link>
            </div>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero heading="YOUR ORDERS" subtitle="Track your adventure bookings." image="/resources/gallery/1.jpg" />
      <Section background="default" spacing="large">
        <Container>
          {loading ? (
            <p className="text-center text-muted">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="mx-auto max-w-md text-center">
              <h2 className="font-display text-2xl text-ivory">No orders yet</h2>
              <p className="mt-3 text-muted">Book your first adventure today.</p>
              <Link
                href="/adventures"
                className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright"
              >
                Explore Adventures
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-md border border-gold/20 bg-void/50 p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold">
                      {order.order_number}
                    </p>
                    <h3 className="mt-1 font-display text-lg text-ivory">
                      ${Number(order.total_amount).toFixed(2)} {order.currency}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
                        order.status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.payment_id && (
                      <span className="text-xs text-muted">ID: {order.payment_id}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}