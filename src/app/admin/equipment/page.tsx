"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaUpload from "@/components/admin/MediaUpload";
import { deleteStorageFile } from "@/lib/supabase/storage";

interface Equipment {
  id: string;
  name: string;
  slug: string | null;
  brand: string;
  category: string;
  price_fcfa: number;
  price_label: string;
  status: string;
  image: string | null;
  description: string | null;
  order_id: number;
  specs: Record<string, string>;
  included: string[];
  gallery: string[];
}

function slugify(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const empty: Omit<Equipment, "id"> = {
  name: "", slug: "", brand: "", category: "Cinéma Digital", price_fcfa: 0,
  price_label: "", status: "disponible", image: "", description: "", order_id: 0,
  specs: {}, included: [], gallery: [],
};

export default function AdminEquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [isNew, setIsNew] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("rental_equipment").select("*").order("order_id");
    setItems(data ?? []);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("rental_equipment").insert(rest);
    } else {
      await supabase.from("rental_equipment").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet équipement ?")) return;
    const item = items.find((i) => i.id === id);
    if (item?.image) await deleteStorageFile(item.image);
    await supabase.from("rental_equipment").delete().eq("id", id);
    load();
  }

  function update(field: string, value: string | number | string[] | Record<string, string>) {
    if (!editing) return;
    const updated = { ...editing, [field]: value };
    if (field === "name" && typeof value === "string") {
      updated.slug = slugify(editing.brand + " " + value);
    }
    if (field === "brand" && typeof value === "string") {
      updated.slug = slugify(value + " " + editing.name);
    }
    setEditing(updated);
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Équipement</h1>
        <button onClick={() => { setEditing({ id: "", ...empty }); setIsNew(true); }} className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all">
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouvel équipement" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Nom</label>
              <input value={editing.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Marque</label>
              <input value={editing.brand} onChange={(e) => update("brand", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Catégorie</label>
              <select value={editing.category} onChange={(e) => update("category", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                {["Cinéma Digital", "Optiques", "Éclairage", "Stabilisation", "Audio"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Statut</label>
              <select value={editing.status} onChange={(e) => update("status", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                <option value="disponible">Disponible</option>
                <option value="en_tournage">En tournage</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Prix FCFA</label>
              <input type="number" value={editing.price_fcfa} onChange={(e) => update("price_fcfa", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Label prix (affiché)</label>
              <input value={editing.price_label} onChange={(e) => update("price_label", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="750 000 FCFA / Jour" />
            </div>
            <div>
              <MediaUpload
                value={editing.image ?? ""}
                onChange={(url) => update("image", url)}
                folder="equipment"
                label="Image équipement"
                aspectRatio="aspect-square"
              />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Ordre</label>
              <input type="number" value={editing.order_id} onChange={(e) => update("order_id", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Description</label>
            <textarea value={editing.description ?? ""} onChange={(e) => update("description", e.target.value)} rows={2} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" placeholder="Description du matériel..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Spécifications (une par ligne : Clé: Valeur)</label>
              <textarea
                value={Object.entries(editing.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n")}
                onChange={(e) => {
                  const specs: Record<string, string> = {};
                  e.target.value.split("\n").forEach((line) => {
                    const [k, ...v] = line.split(":");
                    if (k?.trim() && v.length) specs[k.trim()] = v.join(":").trim();
                  });
                  update("specs", specs);
                }}
                rows={5}
                className="w-full border border-outline-variant/30 py-2 px-3 text-xs bg-transparent resize-none font-mono"
                placeholder="Capteur: ALEV IV&#10;Résolution: 4.6K&#10;ISO: 800/3200"
              />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Inclus dans la location (un par ligne)</label>
              <textarea
                value={(editing.included || []).join("\n")}
                onChange={(e) => update("included", e.target.value.split("\n").filter(Boolean) as unknown as string)}
                rows={5}
                className="w-full border border-outline-variant/30 py-2 px-3 text-xs bg-transparent resize-none"
                placeholder="Body ALEXA 35&#10;Batterie V-Mount x2&#10;Flight case"
              />
            </div>
          </div>
          <p className="text-[0.55rem] text-secondary mb-6">Slug: <span className="font-mono text-on-surface">{editing.slug || "—"}</span></p>
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
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Image</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Nom</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Marque</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Prix</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Statut</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                <td className="px-6 py-3">{item.image && <img src={item.image} alt="Aperçu" className="w-12 h-12 object-cover" />}</td>
                <td className="px-6 py-3 text-sm font-bold">{item.name}</td>
                <td className="px-6 py-3 text-sm text-secondary">{item.brand}</td>
                <td className="px-6 py-3 text-sm font-bold">{item.price_label}</td>
                <td className="px-6 py-3">
                  <span className={`text-[0.55rem] font-black uppercase px-2 py-1 ${item.status === "disponible" ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-dim text-on-surface"}`}>
                    {item.status}
                  </span>
                </td>
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
