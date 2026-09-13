"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_interest: string | null;
  message: string | null;
  status: string;
  created_at: string;
  request_type?: string | null;
  request_data?: Record<string, unknown> | null;
}

type ContactScope = "all" | "academy" | "agency" | "rental";

function scopeOf(contact: Contact): Exclude<ContactScope, "all"> {
  if (contact.request_type === "academy_registration" || contact.service_interest?.startsWith("LOLLY Academy —")) return "academy";
  if (["equipment_quote", "studio_booking", "training"].includes(contact.request_type ?? "")) return "rental";
  return "agency";
}

function detailValue(value: unknown): string {
  return typeof value === "string" && value.trim() ? value : "Non précisé";
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [scope, setScope] = useState<ContactScope>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadContacts() {
      const { data, error: loadError } = await createClient()
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (loadError) setError("Impossible de charger les demandes. Vérifiez l’accès à la base.");
      setContacts(data ?? []);
      setLoading(false);
    }
    void loadContacts();
    return () => { active = false; };
  }, []);

  async function updateStatus(id: string, status: string) {
    const { data: updated, error: updateError } = await createClient().from("contact_requests").update({ status }).eq("id", id).select("id");
    if (updateError || !updated?.length) {
      setError("Le statut n’a pas pu être enregistré. Réessayez.");
      return;
    }
    setError("");
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  const statusColors: Record<string, string> = {
    nouveau: "bg-primary-fixed text-on-primary-fixed",
    lu: "bg-surface-container text-on-surface-variant",
    traite: "bg-on-surface text-surface",
    archive: "bg-outline-variant/30 text-secondary",
  };
  const visibleContacts = contacts.filter((contact) => scope === "all" || scopeOf(contact) === scope);
  const tabs: { value: ContactScope; label: string }[] = [
    { value: "all", label: "Toutes" },
    { value: "academy", label: "Academy" },
    { value: "agency", label: "Agence" },
    { value: "rental", label: "Production" },
  ];

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">
        Demandes et inscriptions
      </h1>

      <p className="text-sm text-secondary mb-6">Les demandes Academy attendent une confirmation humaine de la date, de l’horaire et de la place.</p>
      <div className="flex flex-wrap gap-2 mb-6" aria-label="Filtrer les demandes">
        {tabs.map((tab) => {
          const count = tab.value === "all" ? contacts.length : contacts.filter((contact) => scopeOf(contact) === tab.value).length;
          return <button key={tab.value} type="button" aria-pressed={scope === tab.value} onClick={() => { setScope(tab.value); setSelected(null); }} className={`px-4 py-2 text-xs font-black uppercase tracking-wider border ${scope === tab.value ? "bg-on-surface text-primary-fixed border-on-surface" : "bg-surface text-on-surface border-outline-variant/40 hover:border-on-surface"}`}>{tab.label} ({count})</button>;
        })}
      </div>
      {error && <p role="alert" className="mb-6 border-l-4 border-error pl-3 text-sm text-error">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/15">
          {visibleContacts.length === 0 ? (
            <p className="p-8 text-center text-secondary">Aucune demande.</p>
          ) : (
            visibleContacts.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelected(c);
                  if (c.status === "nouveau") updateStatus(c.id, "lu");
                }}
                className={`w-full text-left px-6 py-4 border-b border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors ${
                  selected?.id === c.id ? "bg-surface-container-low" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{c.name}</p>
                    <p className="text-xs text-secondary mt-1">{c.service_interest} — {c.email}</p>
                    {scopeOf(c) === "academy" && <p className="text-xs font-bold mt-1">{detailValue(c.request_data?.topic)} · {detailValue(c.request_data?.session_preference)}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[0.55rem] font-black uppercase px-2 py-1 ${statusColors[c.status] ?? statusColors.nouveau}`}>
                      {c.status}
                    </span>
                    <span className="text-[0.6rem] text-secondary">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-5">
          {selected ? (
            <div className="bg-surface-container-lowest border border-outline-variant/15 p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <span className={`text-[0.6rem] font-black uppercase px-2 py-1 ${statusColors[selected.status] ?? statusColors.nouveau}`}>
                  {selected.status}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-sm hover:text-primary-fixed">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold mb-1">Téléphone</p>
                    <a href={`tel:${selected.phone}`} className="text-sm hover:text-primary-fixed">{selected.phone}</a>
                  </div>
                )}
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold mb-1">Service</p>
                  <p className="text-sm">{selected.service_interest}</p>
                </div>
                {scopeOf(selected) === "academy" && (
                  <div className="border-l-4 border-primary-fixed bg-primary-fixed/10 p-4 space-y-3">
                    <p className="text-[0.6rem] uppercase tracking-widest font-black">Inscription LOLLY Academy · à confirmer</p>
                    <div><p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Offre</p><p className="text-sm">{detailValue(selected.request_data?.offer_name)}</p></div>
                    <div><p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Thème souhaité</p><p className="text-sm">{detailValue(selected.request_data?.topic)}</p></div>
                    <div><p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Samedi souhaité</p><p className="text-sm">{detailValue(selected.request_data?.session_preference)}</p></div>
                    <div><p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Entreprise</p><p className="text-sm">{detailValue(selected.request_data?.company)}</p></div>
                  </div>
                )}
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold mb-1">Message</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{selected.message}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold mb-1">Date</p>
                  <p className="text-sm">{new Date(selected.created_at).toLocaleString("fr-FR")}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {["nouveau", "lu", "traite", "archive"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-4 py-2 text-[0.6rem] font-bold uppercase tracking-widest transition-colors ${
                      selected.status === s
                        ? statusColors[s]
                        : "bg-surface-container text-secondary hover:text-on-surface"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-outline-variant/15 p-8 text-center text-secondary">
              <span className="material-symbols-outlined text-4xl mb-4 block opacity-30">mail</span>
              <p>Sélectionnez une demande</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
