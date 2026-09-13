"use client";

import { usePathname } from "next/navigation";

const phone = "221772354747";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const message = pathname.startsWith("/academy")
    ? "Bonjour LOLLY, j'aimerais échanger sur mon projet de formation."
    : "Bonjour LOLLY, j'aimerais échanger sur mon projet de communication.";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Échanger avec LOLLY sur WhatsApp (nouvel onglet)"
      title="Échanger avec LOLLY sur WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 md:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-fixed bg-on-surface text-primary-fixed shadow-lg transition-colors hover:bg-primary-fixed hover:text-on-primary-fixed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface"
    >
      <svg viewBox="0 0 24 24" width="29" height="29" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.2 11.5a8.2 8.2 0 0 1-12.1 7.2L3.5 20l1.3-4.5a8.2 8.2 0 1 1 15.4-4Z" />
        <path d="M8.6 8.1c-.3.1-.8.8-.8 1.5 0 1.8 2.7 4.8 5.6 5.5.7.2 1.7-.3 1.9-.8l.3-.8-1.8-.9-.8.9c-1.4-.5-2.5-1.5-3.1-2.8l.8-.8-.9-1.8h-1.2Z" />
      </svg>
    </a>
  );
}
