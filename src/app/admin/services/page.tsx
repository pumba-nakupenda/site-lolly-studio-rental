"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  badge: string | null;
  items: string[];
  order_id: number;
  highlight: boolean;
  cta: string | null;
  link: string | null;
}

const empty: Omit<Service, "id"> = {
  title: "", description: "", icon: "", badge: "", items: [],
  order_id: 0, highlight: false, cta: "", link: "",
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("services").select("*").order("order_id");
    setItems(data ?? []);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("services").insert(rest);
    } else {
      await supabase.from("services").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce service ?")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  }

  function update(field: string, value: string | number | boolean | string[]) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Services</h1>
        <button onClick={() => { setEditing({ id: "", ...empty }); setIsNew(true); }} className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all">
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouveau service" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Titre</label>
              <input value={editing.title} onChange={(e) => update("title", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Icon</label>
              <input value={editing.icon ?? ""} onChange={(e) => update("icon", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="Camera, Film, etc." />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Badge</label>
              <input value={editing.badge ?? ""} onChange={(e) => update("badge", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Items (virgule)</label>
              <input value={(editing.items ?? []).join(", ")} onChange={(e) => update("items", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="Tournage, Montage, Post-prod" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Ordre</label>
              <input type="number" value={editing.order_id} onChange={(e) => update("order_id", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Highlight</label>
              <input type="checkbox" checked={editing.highlight} onChange={(e) => update("highlight", e.target.checked)} className="w-4 h-4" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">CTA</label>
              <input value={editing.cta ?? ""} onChange={(e) => update("cta", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="En savoir plus" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Lien</label>
              <input value={editing.link ?? ""} onChange={(e) => update("link", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="/services/production" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Description</label>
              <textarea value={editing.description ?? ""} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all">Enregistrer</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-secondary hover:text-on-surface">Annuler</button>
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant/15">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant/15 text-left">
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Titre</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Badge</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Items</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Highlight</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Ordre</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                <td className="px-6 py-3 text-sm font-bold">{item.title}</td>
                <td className="px-6 py-3 text-sm text-secondary">{item.badge}</td>
                <td className="px-6 py-3 text-sm text-secondary">{(item.items ?? []).join(", ")}</td>
                <td className="px-6 py-3">
                  {item.highlight && (
                    <span className="text-[0.55rem] font-black uppercase px-2 py-1 bg-primary-fixed text-on-primary-fixed">Oui</span>
                  )}
                </td>
                <td className="px-6 py-3 text-sm text-secondary">{item.order_id}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(item); setIsNew(false); }} className="text-xs font-bold text-primary hover:text-primary-fixed">Modifier</button>
                    <button onClick={() => remove(item.id)} className="text-xs font-bold text-error hover:text-error-dim">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
