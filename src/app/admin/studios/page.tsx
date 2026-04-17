"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaUpload from "@/components/admin/MediaUpload";
import { deleteStorageFile } from "@/lib/supabase/storage";

interface Studio {
  id: string;
  name: string;
  size: string;
  height: string;
  features: string[];
  price_fcfa: number;
  price_label: string;
  image: string | null;
  description: string | null;
  order_id: number;
}

const empty: Omit<Studio, "id"> = {
  name: "", size: "", height: "", features: [], price_fcfa: 0,
  price_label: "", image: "", description: "", order_id: 0,
};

export default function AdminStudiosPage() {
  const [items, setItems] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Studio | null>(null);
  const [isNew, setIsNew] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("studio_spaces").select("*").order("order_id");
    setItems(data ?? []);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("studio_spaces").insert(rest);
    } else {
      await supabase.from("studio_spaces").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce studio ?")) return;
    const item = items.find((i) => i.id === id);
    if (item?.image) await deleteStorageFile(item.image);
    await supabase.from("studio_spaces").delete().eq("id", id);
    load();
  }

  function update(field: string, value: string | number | string[]) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Studios</h1>
        <button onClick={() => { setEditing({ id: "", ...empty }); setIsNew(true); }} className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all">
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouveau studio" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Nom</label>
              <input value={editing.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Taille</label>
              <input value={editing.size} onChange={(e) => update("size", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="200m2" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Hauteur</label>
              <input value={editing.height} onChange={(e) => update("height", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="6m" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Features (virgule)</label>
              <input value={(editing.features ?? []).join(", ")} onChange={(e) => update("features", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="Cyclorama, Climatisation, Loges" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Prix FCFA</label>
              <input type="number" value={editing.price_fcfa} onChange={(e) => update("price_fcfa", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Label prix (affich&eacute;)</label>
              <input value={editing.price_label} onChange={(e) => update("price_label", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="500 000 FCFA / Jour" />
            </div>
            <div>
              <MediaUpload
                value={editing.image ?? ""}
                onChange={(url) => update("image", url)}
                folder="studios"
                label="Image studio"
                aspectRatio="aspect-[8/5]"
              />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Ordre</label>
              <input type="number" value={editing.order_id} onChange={(e) => update("order_id", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
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
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Image</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Nom</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Taille</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Prix</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Features</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                <td className="px-6 py-3">{item.image && <img src={item.image} alt="Aperçu" className="w-12 h-12 object-cover" />}</td>
                <td className="px-6 py-3 text-sm font-bold">{item.name}</td>
                <td className="px-6 py-3 text-sm text-secondary">{item.size}</td>
                <td className="px-6 py-3 text-sm font-bold">{item.price_label}</td>
                <td className="px-6 py-3 text-sm text-secondary">{(item.features ?? []).join(", ")}</td>
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
