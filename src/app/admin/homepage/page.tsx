"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaUpload from "@/components/admin/MediaUpload";

interface Block {
  id: string;
  label: string;
  title: string;
  description: string | null;
  cta_text: string | null;
  link: string;
  image: string | null;
}

export default function AdminHomepagePage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("homepage_blocks").select("*").order("id");
    setBlocks(data ?? []);
    setLoading(false);
  }

  function update(id: string, field: string, value: string) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  }

  async function saveAll() {
    setSaving(true);
    for (const block of blocks) {
      await supabase
        .from("homepage_blocks")
        .update({
          label: block.label,
          title: block.title,
          description: block.description,
          cta_text: block.cta_text,
          link: block.link,
          image: block.image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", block.id);
    }
    setSaving(false);
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Page d&apos;accueil</h1>
        <button
          onClick={saveAll}
          disabled={saving}
          className="bg-primary-fixed text-on-primary-fixed px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer tout"}
        </button>
      </div>

      {/* Preview */}
      <div className="mb-8 bg-surface-container border border-outline-variant/15 p-3">
        <p className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold mb-3">Aperçu</p>
        <div className="grid grid-cols-12 gap-2 h-48">
          {blocks.map((b) => (
            <div
              key={b.id}
              className={`relative overflow-hidden ${b.id === "studio" ? "col-span-7 bg-surface-container-lowest" : "col-span-5 bg-on-surface"}`}
            >
              {b.image && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url('${b.image}')` }}
                />
              )}
              <div className="relative p-4 flex flex-col justify-end h-full z-10">
                <p className={`text-2xl font-black tracking-tighter ${b.id === "studio" ? "text-on-surface" : "text-white"}`}>
                  {b.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks.map((block) => (
          <div key={block.id} className="bg-surface-container-lowest border border-outline-variant/15 p-6">
            <h2 className="text-lg font-bold uppercase tracking-tighter mb-6 flex items-center gap-3">
              <span className={`w-3 h-3 ${block.id === "studio" ? "bg-on-surface" : "bg-primary-fixed"}`} />
              Bloc {block.title}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Label (petit texte au-dessus)</label>
                <input value={block.label} onChange={(e) => update(block.id, "label", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
              </div>
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Titre (grand texte)</label>
                <input value={block.title} onChange={(e) => update(block.id, "title", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent font-bold text-lg" />
              </div>
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Description</label>
                <textarea value={block.description ?? ""} onChange={(e) => update(block.id, "description", e.target.value)} rows={3} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Texte du bouton</label>
                  <input value={block.cta_text ?? ""} onChange={(e) => update(block.id, "cta_text", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                </div>
                <div>
                  <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Lien</label>
                  <input value={block.link} onChange={(e) => update(block.id, "link", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                </div>
              </div>
              <MediaUpload
                value={block.image ?? ""}
                onChange={(url) => update(block.id, "image", url)}
                folder="homepage"
                label="Image de fond"
                aspectRatio="aspect-[16/9]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
