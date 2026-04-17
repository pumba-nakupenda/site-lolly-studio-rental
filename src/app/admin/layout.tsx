"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/homepage", label: "Page d'accueil", icon: "home" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "photo_library" },
  { href: "/admin/equipment", label: "Équipement", icon: "videocam" },
  { href: "/admin/studios", label: "Studios", icon: "meeting_room" },
  { href: "/admin/bookings", label: "Réservations", icon: "calendar_month" },
  { href: "/admin/rentals", label: "Locations", icon: "assignment" },
  { href: "/admin/services", label: "Services", icon: "design_services" },
  { href: "/admin/team", label: "Équipe", icon: "group" },
  { href: "/admin/testimonials", label: "Témoignages", icon: "format_quote" },
  { href: "/admin/partners", label: "Partenaires", icon: "handshake" },
  { href: "/admin/contacts", label: "Demandes", icon: "mail" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside className="w-64 bg-on-surface text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin">
            <Logo height={22} color="white" />
          </Link>
          <p className="text-[0.6rem] uppercase tracking-widest text-surface-variant mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? "text-primary-fixed bg-white/5 border-r-2 border-primary-fixed"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-2 text-sm text-white/40 hover:text-white transition-colors w-full"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Déconnexion
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-2 py-2 text-sm text-white/40 hover:text-white transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-lg">language</span>
            Voir le site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
