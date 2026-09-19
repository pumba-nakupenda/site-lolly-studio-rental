"use client";

import Link from "next/link";
import { useCart } from "./QuoteCart";

const buttonClass = "inline-flex justify-center bg-primary-fixed text-on-primary-fixed font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-primary-fixed-dim transition-all";

export default function ProductionQuoteCTA() {
  const { items, setIsOpen } = useCart();

  return items.length > 0 ? (
    <button type="button" onClick={() => setIsOpen(true)} className={buttonClass}>
      Envoyer ma sélection pour devis
    </button>
  ) : (
    <Link href="/contact?service=Production" className={buttonClass}>
      Décrire mon besoin de production
    </Link>
  );
}
