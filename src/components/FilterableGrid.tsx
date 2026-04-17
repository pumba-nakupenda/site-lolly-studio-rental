"use client";

import { useState, Children, type ReactNode } from "react";

interface FilterableGridProps {
  categories: string[];
  items: Array<{ category?: string | null }>;
  className?: string;
  children: ReactNode;
}

export default function FilterableGrid({
  categories,
  items,
  className = "",
  children,
}: FilterableGridProps) {
  const [active, setActive] = useState("Tout");

  const childArray = Children.toArray(children);

  const filteredChildren = active === "Tout"
    ? childArray
    : childArray.filter((_, i) => items[i]?.category === active);

  return (
    <>
      <div className="relative mb-12">
        <div className="flex overflow-x-auto no-scrollbar gap-3 border-b border-outline-variant/15 pb-4 pr-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`whitespace-nowrap px-6 py-2 text-[0.75rem] uppercase tracking-widest font-bold transition-colors ${
                active === cat
                  ? "bg-inverse-surface text-surface"
                  : "bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-fixed"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none md:hidden" />
      </div>

      {filteredChildren.length > 0 ? (
        <div className={className}>{filteredChildren}</div>
      ) : (
        <p className="text-center text-secondary py-16">
          Aucun élément dans cette catégorie.
        </p>
      )}
    </>
  );
}
