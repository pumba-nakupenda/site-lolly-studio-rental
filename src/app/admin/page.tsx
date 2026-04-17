import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: portfolioCount },
    { count: equipmentCount },
    { count: studiosCount },
    { count: contactsCount },
    { count: newContactsCount },
    { count: pendingBookings },
    { count: activeRentals },
    { data: recentContacts },
  ] = await Promise.all([
    supabase.from("portfolio").select("*", { count: "exact", head: true }),
    supabase.from("rental_equipment").select("*", { count: "exact", head: true }),
    supabase.from("studio_spaces").select("*", { count: "exact", head: true }),
    supabase.from("contact_requests").select("*", { count: "exact", head: true }),
    supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "nouveau"),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("rentals").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("contact_requests").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const cards = [
    { label: "Projets Portfolio", count: portfolioCount ?? 0, href: "/admin/portfolio", icon: "photo_library" },
    { label: "Équipements", count: equipmentCount ?? 0, href: "/admin/equipment", icon: "videocam" },
    { label: "Studios", count: studiosCount ?? 0, href: "/admin/studios", icon: "meeting_room" },
    { label: "Réservations", count: pendingBookings ?? 0, badge: pendingBookings ?? 0, href: "/admin/bookings", icon: "calendar_month" },
    { label: "Locations actives", count: activeRentals ?? 0, badge: activeRentals ?? 0, href: "/admin/rentals", icon: "assignment" },
    { label: "Demandes", count: contactsCount ?? 0, badge: newContactsCount ?? 0, href: "/admin/contacts", icon: "mail" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">
        Dashboard
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-surface-container-lowest border border-outline-variant/15 p-6 hover:border-primary-fixed transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-2xl text-secondary group-hover:text-primary-fixed transition-colors">
                {card.icon}
              </span>
              {card.badge !== undefined && card.badge > 0 && (
                <span className="bg-primary-fixed text-on-primary-fixed text-xs font-black px-2 py-1">
                  {card.badge} new
                </span>
              )}
            </div>
            <p className="text-3xl font-black tracking-tighter">{card.count}</p>
            <p className="text-sm text-secondary mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent contacts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold uppercase tracking-tighter">
            Dernières demandes
          </h2>
          <Link
            href="/admin/contacts"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-fixed transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/15">
          {(recentContacts ?? []).length === 0 ? (
            <p className="p-8 text-center text-secondary">
              Aucune demande pour le moment.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/15 text-left">
                  <th className="px-6 py-3 text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Nom</th>
                  <th className="px-6 py-3 text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Email</th>
                  <th className="px-6 py-3 text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Service</th>
                  <th className="px-6 py-3 text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Statut</th>
                  <th className="px-6 py-3 text-[0.65rem] uppercase tracking-widest text-secondary font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentContacts ?? []).map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                    <td className="px-6 py-4 text-sm font-bold">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-secondary">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-secondary">{c.service_interest}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[0.6rem] font-black uppercase px-2 py-1 ${
                        c.status === "nouveau" ? "bg-primary-fixed text-on-primary-fixed" :
                        c.status === "lu" ? "bg-surface-container text-on-surface-variant" :
                        "bg-on-surface text-surface"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
