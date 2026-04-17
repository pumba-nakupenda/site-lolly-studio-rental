"use client";

import { useState } from "react";
import { useCart } from "./QuoteCart";

interface AddToCartButtonProps {
  id: string;
  name: string;
  brand: string;
  price_label: string;
  available: boolean;
}

export default function AddToCartButton({ id, name, brand, price_label, available }: AddToCartButtonProps) {
  const { addItem, items, removeItem } = useCart();
  const inCart = items.some((i) => i.id === id);
  const [justAdded, setJustAdded] = useState(false);

  if (!available) {
    return (
      <button className="w-full border border-outline-variant/30 text-secondary font-bold text-[0.65rem] uppercase py-3 tracking-widest cursor-not-allowed opacity-50">
        Indisponible
      </button>
    );
  }

  if (inCart) {
    return (
      <button
        onClick={() => removeItem(id)}
        className={`w-full font-bold text-[0.65rem] uppercase py-3 tracking-widest transition-all ${
          justAdded
            ? "bg-primary-fixed text-on-primary-fixed"
            : "bg-on-surface text-surface hover:bg-error hover:text-white"
        }`}
      >
        {justAdded ? "✓ Ajouté !" : "✓ Dans le devis — retirer"}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        addItem({ id, name, brand, price_label });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }}
      className="w-full bg-on-surface text-surface font-bold text-[0.65rem] uppercase py-3 tracking-widest hover:bg-on-surface/80 transition-colors"
    >
      Ajouter au devis
    </button>
  );
}
