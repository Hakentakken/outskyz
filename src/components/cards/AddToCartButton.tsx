"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface AddToCartButtonProps {
  itemType: "adventure" | "package";
  itemId: string;
  itemSlug: string;
  itemName: string;
  itemImage?: string;
  unitPrice: number;
  currency?: string;
}

export function AddToCartButton({
  itemType,
  itemId,
  itemSlug,
  itemName,
  itemImage,
  unitPrice,
  currency = "USD",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setAdding(true);
    const { error } = await addToCart({
      itemType,
      itemId,
      itemSlug,
      itemName,
      itemImage,
      unitPrice,
      currency,
    });
    setAdding(false);
    if (!error) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={adding}
      className="inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] disabled:opacity-50"
    >
      {adding ? (
        <>Adding...</>
      ) : added ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" aria-hidden="true" />
          Add to Cart — ${unitPrice.toFixed(2)}
        </>
      )}
    </button>
  );
}
