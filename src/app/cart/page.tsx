"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { Container } from "@/components/ui/Container";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, profile, session } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const createResponse = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
      });
      const checkout = (await createResponse.json()) as {
        error?: string;
        orderId?: string;
        razorpayOrderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        orderNumber?: string;
      };
      if (!createResponse.ok || !checkout.orderId || !checkout.razorpayOrderId || !checkout.keyId) {
        setCheckoutError(checkout.error ?? "Unable to start checkout. Please try again.");
        setCheckoutLoading(false);
        return;
      }

      // Load Razorpay script
      await new Promise<void>((resolve, reject) => {
        if (window.Razorpay) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay"));
        document.body.appendChild(script);
      });

      if (!window.Razorpay) {
        setCheckoutError("Razorpay failed to load.");
        setCheckoutLoading(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: checkout.keyId,
        order_id: checkout.razorpayOrderId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: "Outskyz",
        description: `Order ${checkout.orderNumber}`,
        prefill: {
          email: user.email,
          name: profile?.full_name ?? "",
        },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const verifyResponse = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.access_token ?? ""}`,
            },
            body: JSON.stringify({ orderId: checkout.orderId, ...response }),
          });
          if (!verifyResponse.ok) {
            const result = (await verifyResponse.json()) as { error?: string };
            setCheckoutError(result.error ?? "Payment verification failed. Please contact support.");
            setCheckoutLoading(false);
            return;
          }
          await clearCart();
          window.location.assign("/orders");
        },
        modal: {
          ondismiss: () => {
            setCheckoutLoading(false);
          },
        },
      });

      razorpay.open();
    } catch {
      setCheckoutError("Payment failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <PageHero heading="YOUR CART" subtitle="Sign in to view your cart." image="/resources/gallery/1.jpg" />
        <Section background="default" spacing="large">
          <Container>
            <div className="mx-auto max-w-md text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gold" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl text-ivory">Please Sign In</h2>
              <p className="mt-3 text-muted">Sign in to view your cart and checkout.</p>
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
      <PageHero heading="YOUR CART" subtitle="Review your selected adventures." image="/resources/gallery/1.jpg" />
      <Section background="default" spacing="large">
        <Container>
          {items.length === 0 ? (
            <div className="mx-auto max-w-md text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gold" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl text-ivory">Your cart is empty</h2>
              <p className="mt-3 text-muted">Explore our adventures and add them to your cart.</p>
              <Link
                href="/adventures"
                className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright"
              >
                Explore Adventures
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cart items */}
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-md border border-gold/20 bg-void/50 p-6 sm:flex-row sm:items-center"
                  >
                    {item.item_image ? (
                      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-sm border border-gold/20 sm:w-32">
                        <Image
                          src={item.item_image}
                          alt={item.item_name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-sm border border-gold/20 bg-coal sm:w-32">
                        <ShoppingBag className="h-8 w-8 text-gold/50" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-display text-lg text-ivory">{item.item_name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-widest text-gold">
                        {item.item_type}
                      </p>
                      <p className="mt-2 font-display text-xl text-gold">
                        ${item.unit_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold/30 text-gold transition-colors hover:bg-gold/10"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-sm text-ivory">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-gold/30 text-gold transition-colors hover:bg-gold/10"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 flex h-8 w-8 items-center justify-center rounded-sm border border-red-500/30 text-red-400 transition-colors hover:bg-red-500/10"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="h-fit rounded-md border border-gold/25 bg-void/60 p-8 lg:sticky lg:top-24">
                <h3 className="font-display text-xl text-ivory">Order Summary</h3>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Items ({totalItems})</span>
                    <span className="text-ivory">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Taxes</span>
                    <span className="text-ivory">Included</span>
                  </div>
                  <div className="border-t border-gold/15 pt-4">
                    <div className="flex justify-between">
                      <span className="text-ivory">Total</span>
                      <span className="font-display text-2xl text-gold">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {checkoutError && (
                  <div className="mt-4 rounded-sm border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
                    {checkoutError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || items.length === 0}
                  className="mt-8 w-full rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright disabled:opacity-50"
                >
                  {checkoutLoading ? "Processing..." : "Checkout with Razorpay"}
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full rounded-sm border border-gold/30 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-ivory/60 transition-colors hover:border-gold/60 hover:text-ivory"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
