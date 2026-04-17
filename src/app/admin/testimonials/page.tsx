"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  avatar: string | null;
  rating: number;
}

const empty: Omit<Testimonial, "id"> = {
  name: "", role: "", content: "", avatar: "", rating: 5,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("name");
    setItems(data ?? []);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("testimonials").insert(rest);
    } else {
      await supabase.from("testimonials").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce t\u00e9moignage ?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }

  function update(field: string, value: string | number) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">T&eacute;moignages</h1>
        <button onClick={() => { setEditing({ id: "", ...empty }); setIsNew(true); }} className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all">
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouveau t\u00e9moignage" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Nom</label>
              <input value={editing.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">R&ocirc;le</label>
              <input value={editing.role ?? ""} onChange={(e) => update("role", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="Directeur artistique" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Avatar (URL)</label>
              <input value={editing.avatar ?? ""} onChange={(e) => update("avatar", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Note (1-5)</label>
              <input type="number" min={1} max={5} value={editing.rating} onChange={(e) => update("rating", parseInt(e.target.value) || 5)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">T&eacute;moignage</label>
              <textarea value={editing.content} onChange={(e) => update("content", e.target.value)} rows={4} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
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
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Avatar</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Nom</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">R&ocirc;le</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Note</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Extrait</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                <td className="px-6 py-3">{item.avatar && <img src={item.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />}</td>
                <td className="px-6 py-3 text-sm font-bold">{item.name}</td>
                <td className="px-6 py-3 text-sm text-secondary">{item.role}</td>
                <td className="px-6 py-3 text-sm font-bold">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</td>
                <td className="px-6 py-3 text-sm text-secondary max-w-xs truncate">{item.content}</td>
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
