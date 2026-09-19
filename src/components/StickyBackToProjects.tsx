"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyBackToProjects() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 800);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href="/studio/projets"
      aria-label="Retour aux projets"
      className={`fixed bottom-6 left-6 z-40 inline-flex items-center gap-2 bg-on-surface text-white px-5 py-3 text-[0.65rem] uppercase tracking-widest font-bold shadow-[0_12px_24px_-8px_rgba(0,0,0,0.3)] hover:bg-primary-fixed hover:text-on-primary-fixed transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span aria-hidden>←</span>
      <span>Projets</span>
    </Link>
  );
}
