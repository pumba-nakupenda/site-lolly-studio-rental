"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaUpload from "@/components/admin/MediaUpload";
import { deleteStorageFile } from "@/lib/supabase/storage";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
  linkedin: string | null;
  order_id: number;
  is_visible: boolean;
}

const empty: Omit<TeamMember, "id"> = {
  name: "", role: "", photo: "", bio: "", linkedin: "", order_id: 0, is_visible: true,
};

export default function AdminTeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("team_members").select("*").order("order_id");
    setItems(data ?? []);
    setLoading(false);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      rest.order_id = items.length;
      await supabase.from("team_members").insert(rest);
    } else {
      await supabase.from("team_members").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce membre ?")) return;
    const member = items.find((i) => i.id === id);
    if (member?.photo) await deleteStorageFile(member.photo);
    await supabase.from("team_members").delete().eq("id", id);
    load();
  }

  async function toggleVisibility(id: string, current: boolean) {
    await supabase.from("team_members").update({ is_visible: !current }).eq("id", id);
    setItems((prev) => prev.map((m) => m.id === id ? { ...m, is_visible: !current } : m));
  }

  async function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const newItems = [...items];
    const dragIndex = newItems.findIndex((i) => i.id === dragId);
    const targetIndex = newItems.findIndex((i) => i.id === targetId);
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(targetIndex, 0, moved);
    const updated = newItems.map((item, i) => ({ ...item, order_id: i }));
    setItems(updated);
    setDragId(null);
    for (const item of updated) {
      await supabase.from("team_members").update({ order_id: item.order_id }).eq("id", item.id);
    }
  }

  function update(field: string, value: string | number | boolean) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Équipe</h1>
        <button
          onClick={() => { setEditing({ id: "", ...empty, order_id: items.length }); setIsNew(true); }}
          className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
        >
          + Ajouter
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouveau membre" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            <div className="md:col-span-4">
              <MediaUpload
                value={editing.photo ?? ""}
                onChange={(url) => update("photo", url)}
                folder="team"
                label="Photo"
                aspectRatio="aspect-[3/4]"
              />
            </div>
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Nom complet</label>
                  <input value={editing.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                </div>
                <div>
                  <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Poste / Rôle</label>
                  <input value={editing.role} onChange={(e) => update("role", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                </div>
              </div>
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Bio</label>
                <textarea value={editing.bio ?? ""} onChange={(e) => update("bio", e.target.value)} rows={3} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
              </div>
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">LinkedIn (URL)</label>
                <input value={editing.linkedin ?? ""} onChange={(e) => update("linkedin", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" placeholder="https://linkedin.com/in/..." />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.is_visible} onChange={(e) => update("is_visible", e.target.checked)} className="w-4 h-4 accent-primary-fixed" />
                <span className="text-sm">Visible sur le site</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all">Enregistrer</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-secondary hover:text-on-surface">Annuler</button>
          </div>
        </div>
      )}

      {/* Team list — card format */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((member) => (
          <div
            key={member.id}
            draggable
            onDragStart={() => setDragId(member.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(member.id)}
            className={`bg-surface-container-lowest border border-outline-variant/15 overflow-hidden cursor-move group ${
              dragId === member.id ? "opacity-40" : ""
            } ${!member.is_visible ? "opacity-50" : ""}`}
          >
            <div className="aspect-[4/3] bg-surface-container relative overflow-hidden">
              {member.photo ? (
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-black text-outline-variant/20">{member.name.charAt(0)}</span>
                </div>
              )}
              {!member.is_visible && (
                <div className="absolute top-2 left-2 bg-on-surface/80 text-white text-[0.5rem] font-bold uppercase px-2 py-1">
                  Masqué
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleVisibility(member.id, member.is_visible)} className="bg-white/90 p-1.5 hover:bg-white" title={member.is_visible ? "Masquer" : "Afficher"}>
                  <span className="material-symbols-outlined text-sm text-on-surface">{member.is_visible ? "visibility_off" : "visibility"}</span>
                </button>
                <button onClick={() => { setEditing(member); setIsNew(false); }} className="bg-white/90 p-1.5 hover:bg-white" title="Modifier">
                  <span className="material-symbols-outlined text-sm text-on-surface">edit</span>
                </button>
                <button onClick={() => remove(member.id)} className="bg-white/90 p-1.5 hover:bg-error/20" title="Supprimer">
                  <span className="material-symbols-outlined text-sm text-error">delete</span>
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm">{member.name}</h3>
              <p className="text-xs text-secondary mt-1">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
