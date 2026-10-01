"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loadBrowserSupabaseClient } from "@/lib/supabase/client";
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

/**
 * Cart state.
 *
 * The Supabase client is resolved inside each operation rather than captured
 * during render: it is loaded lazily after first paint (see
 * loadBrowserSupabaseClient), so a render-time grab could only ever return
 * "not ready yet". Every path here is already async, so awaiting the loader
 * costs nothing once it has been fetched.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const supabase = await loadBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (!error && data) setItems(data as CartItem[]);
    } catch {
      // A failed read must never break the page: the cart is an enhancement.
    } finally {
      setIsLoading(false);
    }
  }, [user]);

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
  }, [fetchCart]);

  const addToCart = async (item: {
    itemType: "adventure" | "package";
    itemId: string;
    itemSlug: string;
    itemName: string;
    itemImage?: string;
    unitPrice: number;
    currency?: string;
  }) => {
    if (!user) {
      return { error: "Please sign in to add items to your cart." };
    }

    try {
      const supabase = await loadBrowserSupabaseClient();

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
    } catch {
      return { error: "We couldn't reach our servers. Please try again." };
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    try {
      const supabase = await loadBrowserSupabaseClient();
      await supabase.from("cart_items").delete().eq("id", itemId);
    } catch {
      // Ignore: the refresh below re-syncs from the source of truth.
    }
    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    try {
      const supabase = await loadBrowserSupabaseClient();
      await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    } catch {
      // See removeFromCart.
    }
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const supabase = await loadBrowserSupabaseClient();
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      setItems([]);
    } catch {
      // See removeFromCart.
    }
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
