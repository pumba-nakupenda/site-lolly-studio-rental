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
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    const { data } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts(data ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("contact_requests").update({ status }).eq("id", id);
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

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">
        Demandes de contact
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/15">
          {contacts.length === 0 ? (
            <p className="p-8 text-center text-secondary">Aucune demande.</p>
          ) : (
            contacts.map((c) => (
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
                    <p className="text-xs text-secondary mt-1">
                      {c.service_interest} — {c.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[0.55rem] font-black uppercase px-2 py-1 ${statusColors[c.status]}`}>
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
                <span className={`text-[0.6rem] font-black uppercase px-2 py-1 ${statusColors[selected.status]}`}>
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
