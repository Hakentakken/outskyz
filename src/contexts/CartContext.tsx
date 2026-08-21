"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string;
  item_type: "adventure" | "package";
  item_id: string;
  item_slug: string;
  item_name: string;
  item_image: string | null;
  quantity: number;
  unit_price: number;
  currency: string;
}

interface CartContextValue {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (item: {
    itemType: "adventure" | "package";
    itemId: string;
    itemSlug: string;
    itemName: string;
    itemImage?: string;
    unitPrice: number;
    currency?: string;
  }) => Promise<{ error: string | null }>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = getBrowserSupabaseClient();

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    if (!error && data) setItems(data as CartItem[]);
    setIsLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      // Defer to a microtask so cart state is never updated synchronously
      // from within the effect body (react-hooks/set-state-in-effect).
      await Promise.resolve();
      if (cancelled) return;
      await fetchCart();
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addToCart = async (item: {
    itemType: "adventure" | "package";
    itemId: string;
    itemSlug: string;
    itemName: string;
    itemImage?: string;
    unitPrice: number;
    currency?: string;
  }) => {
    if (!user) return { error: "Please sign in to add items to your cart." };

    // The server looks up the active admin-managed price before creating the
    // cart item; a browser-provided price must never be trusted for checkout.
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token ?? ""}`,
      },
      body: JSON.stringify({ itemType: item.itemType, itemSlug: item.itemSlug }),
    });
    const result = (await response.json()) as { error?: string };
    if (response.ok) await fetchCart();
    return { error: result.error ?? null };
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("id", itemId);
    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
