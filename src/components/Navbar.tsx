"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const mainLinks = [
  { href: "/studio", label: "Studio" },
  { href: "/rental", label: "Rental" },
  { href: "/about", label: "À Propos" },
  { href: "/contact", label: "Contact" },
];

function getBreadcrumbs(pathname: string) {
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labels: Record<string, string> = {
    studio: "Studio",
    rental: "Rental",
    about: "À Propos",
    contact: "Contact",
    projets: "Projets",
  };

  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = labels[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: path });
  }

  return crumbs;
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

  const isStudioActive = pathname.startsWith("/studio");
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <nav className="w-full top-0 left-0 sticky z-50 bg-surface">
      {/* Main bar */}
      <div className="flex justify-between items-center px-6 md:px-12 py-8 max-w-full mx-auto">
        <Link href="/" aria-label="LOLLY — Accueil">
          <Logo height={28} color="black" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-12">
          {/* Studio with dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setStudioOpen(true)}
            onMouseLeave={() => setStudioOpen(false)}
          >
            <Link
              href="/studio"
              className={`text-sm uppercase font-bold tracking-tight transition-colors ${
                isStudioActive
                  ? "text-primary-fixed border-b-2 border-primary-fixed pb-1"
                  : "text-on-surface hover:text-primary-fixed"
              }`}
            >
              Studio
            </Link>

            {/* Dropdown — Projets only */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                studioOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-on-surface min-w-[160px] py-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.2)]">
                <Link
                  href="/studio/projets"
                  className={`block px-6 py-3 text-xs uppercase tracking-widest font-bold transition-colors ${
                    pathname.startsWith("/studio/projets")
                      ? "text-primary-fixed"
                      : "text-white/60 hover:text-primary-fixed hover:bg-white/5"
                  }`}
                >
                  Projets
                </Link>
              </div>
            </div>
          </div>

          {/* Other links */}
          {mainLinks.slice(1).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase font-bold tracking-tight transition-colors ${
                  isActive
                    ? "text-primary-fixed border-b-2 border-primary-fixed pb-1"
                    : "text-on-surface hover:text-primary-fixed"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden md:block bg-primary-fixed text-on-primary-fixed px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all duration-300"
          >
            Lancer un projet
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[2px] bg-on-surface transition-all duration-300 ${
                open ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-on-surface transition-all duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-on-surface transition-all duration-300 ${
                open ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Breadcrumb bar — visible on all pages except home */}
      {breadcrumbs && (
        <div className="px-6 md:px-12 pb-4 -mt-4 flex items-center gap-2">
          <Link
            href="/"
            className="text-[0.65rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            Accueil
          </Link>
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-2">
                <span className="text-outline-variant text-[0.6rem]">/</span>
                {isLast ? (
                  <span className="text-[0.65rem] uppercase tracking-widest text-on-surface font-bold">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[0.65rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-surface border-t border-outline-variant/15 ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 py-6 gap-1">
          {/* Studio + sous-lien Projets */}
          <Link
            href="/studio"
            onClick={() => setOpen(false)}
            className={`text-sm uppercase font-bold tracking-tight py-2 transition-colors ${
              pathname === "/studio" ? "text-primary-fixed" : "text-on-surface"
            }`}
          >
            Studio
          </Link>
          <Link
            href="/studio/projets"
            onClick={() => setOpen(false)}
            className={`text-sm uppercase font-bold tracking-tight py-2 pl-4 border-l-2 transition-colors ${
              pathname.startsWith("/studio/projets")
                ? "text-primary-fixed border-primary-fixed"
                : "text-on-surface/60 border-transparent"
            }`}
          >
            Projets
          </Link>

          <div className="h-px bg-outline-variant/15 my-3" />

          {mainLinks.slice(1).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm uppercase font-bold tracking-tight py-2 transition-colors ${
                  isActive ? "text-primary-fixed" : "text-on-surface"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="bg-primary-fixed text-on-primary-fixed px-8 py-3 font-bold uppercase text-xs tracking-widest text-center hover:bg-primary-fixed-dim transition-all duration-300 mt-4"
          >
            Lancer un projet
          </Link>
        </div>
      </div>
    </nav>
  );
}
