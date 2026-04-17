"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaUpload from "@/components/admin/MediaUpload";
import { deleteStorageFile } from "@/lib/supabase/storage";

interface Partner {
  id: string;
  name: string;
  logo: string | null;
}

const empty: Omit<Partner, "id"> = {
  name: "", logo: "",
};

export default function AdminPartnersPage() {
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [isNew, setIsNew] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("partners").select("*").order("name");
    setItems(data ?? []);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("partners").insert(rest);
    } else {
      await supabase.from("partners").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    const item = items.find((i) => i.id === id);
    if (item?.logo) await deleteStorageFile(item.logo);
    await supabase.from("partners").delete().eq("id", id);
    load();
  }

  function update(field: string, value: string) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Partenaires</h1>
        <button onClick={() => { setEditing({ id: "", ...empty }); setIsNew(true); }} className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all">
          + Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouveau partenaire" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Nom</label>
              <input value={editing.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <MediaUpload
                value={editing.logo ?? ""}
                onChange={(url) => update("logo", url)}
                folder="partners"
                accept="image/*"
                label="Logo"
                aspectRatio="aspect-[3/1]"
              />
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
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Logo</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Nom</th>
              <th className="px-6 py-3 text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/50">
                <td className="px-6 py-3">{item.logo && <img src={item.logo} alt="Logo" className="w-12 h-12 object-contain" />}</td>
                <td className="px-6 py-3 text-sm font-bold">{item.name}</td>
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
