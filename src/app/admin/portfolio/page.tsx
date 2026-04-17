"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaUpload from "@/components/admin/MediaUpload";
import { deleteStorageFiles, collectPortfolioUrls } from "@/lib/supabase/storage";

interface ContentBlock {
  type: "text" | "image_grid" | "full_image" | "video" | "quote";
  title?: string;
  body?: string;
  url?: string;
  caption?: string;
  text?: string;
  author?: string;
  columns?: number;
  images?: string[];
  captions?: string[];
}

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  main_image: string | null;
  client: string | null;
  description: string | null;
  year: string | null;
  services: string[] | null;
  gallery: string[] | null;
  grid_span: string;
  grid_ratio: string;
  grid_order: number;
  content_blocks: ContentBlock[];
}

const BLOCK_TYPES = [
  { value: "text", label: "Texte", icon: "article" },
  { value: "image_grid", label: "Grille images", icon: "grid_view" },
  { value: "full_image", label: "Image pleine", icon: "image" },
  { value: "video", label: "Vidéo", icon: "play_circle" },
  { value: "quote", label: "Citation", icon: "format_quote" },
] as const;

const SPAN_OPTIONS = [
  { value: "md:col-span-5", label: "5 cols — Petit" },
  { value: "md:col-span-6", label: "6 cols — Moyen" },
  { value: "md:col-span-7", label: "7 cols — Grand" },
  { value: "md:col-span-7 md:row-span-2", label: "7 cols × 2 rows — Hero" },
  { value: "md:col-span-12", label: "12 cols — Pleine largeur" },
];

const RATIO_OPTIONS = [
  { value: "aspect-square", label: "1:1 Carré" },
  { value: "aspect-[4/3]", label: "4:3 Paysage" },
  { value: "aspect-[3/4]", label: "3:4 Portrait" },
  { value: "aspect-[8/5]", label: "8:5 Cinéma" },
  { value: "aspect-[5/8]", label: "5:8 Portrait haut" },
  { value: "aspect-[4/5]", label: "4:5 Instagram" },
  { value: "aspect-[16/9]", label: "16:9 Widescreen" },
  { value: "aspect-[21/9]", label: "21:9 Ultrawide" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyItem: Omit<PortfolioItem, "id"> = {
  title: "", slug: "", category: "", main_image: "", client: "",
  description: "", year: "", services: [], gallery: [],
  grid_span: "md:col-span-6", grid_ratio: "aspect-[4/3]", grid_order: 0,
  content_blocks: [],
};

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dragId, setDragId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => { load(); loadCategories(); }, []);

  async function load() {
    const { data } = await supabase.from("portfolio").select("*").order("grid_order");
    setItems(data ?? []);
    setLoading(false);
  }

  async function loadCategories() {
    const { data } = await supabase.from("portfolio_categories").select("*").order("order_id");
    setCategories(data ?? []);
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    await supabase.from("portfolio_categories").insert({
      name: newCategory.trim(),
      slug: slugify(newCategory),
      order_id: categories.length,
    });
    setNewCategory("");
    loadCategories();
  }

  async function removeCategory(id: string) {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await supabase.from("portfolio_categories").delete().eq("id", id);
    loadCategories();
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      const newId = crypto.randomUUID();
      rest.grid_order = items.length;
      await supabase.from("portfolio").insert({ id: newId, ...rest });
    } else {
      await supabase.from("portfolio").update(rest).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    // Clean Storage files first
    const item = items.find((i) => i.id === id);
    if (item) {
      await deleteStorageFiles(collectPortfolioUrls(item));
    }
    await supabase.from("portfolio").delete().eq("id", id);
    load();
  }

  async function updateLayout(id: string, field: string, value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
    await supabase.from("portfolio").update({ [field]: value }).eq("id", id);
  }

  async function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const newItems = [...items];
    const dragIndex = newItems.findIndex((i) => i.id === dragId);
    const targetIndex = newItems.findIndex((i) => i.id === targetId);
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(targetIndex, 0, moved);

    const updated = newItems.map((item, i) => ({ ...item, grid_order: i }));
    setItems(updated);
    setDragId(null);

    // Batch update order
    for (const item of updated) {
      await supabase.from("portfolio").update({ grid_order: item.grid_order }).eq("id", item.id);
    }
  }

  function update(field: string, value: string | string[] | number) {
    if (!editing) return;
    const updated = { ...editing, [field]: value };
    // Auto-generate slug from title
    if (field === "title" && typeof value === "string") {
      updated.slug = slugify(value);
    }
    setEditing(updated);
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Portfolio</h1>
        <div className="flex gap-3">
          <div className="flex border border-outline-variant/30">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 text-xs font-bold ${view === "grid" ? "bg-on-surface text-surface" : "text-secondary"}`}
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 text-xs font-bold ${view === "list" ? "bg-on-surface text-surface" : "text-secondary"}`}
            >
              <span className="material-symbols-outlined text-sm">view_list</span>
            </button>
          </div>
          <button
            onClick={() => { setEditing({ id: "", ...emptyItem, grid_order: items.length }); setIsNew(true); }}
            className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
          >
            + Nouveau
          </button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouveau projet" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Titre</label>
              <input value={editing.title} onChange={(e) => update("title", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
              <p className="text-[0.55rem] text-secondary mt-1">
                Slug : <span className="text-on-surface font-mono">{editing.slug || "—"}</span>
              </p>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Client</label>
              <input value={editing.client ?? ""} onChange={(e) => update("client", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Catégorie</label>
                <button type="button" onClick={() => setShowCatManager(!showCatManager)} className="text-[0.55rem] text-primary font-bold hover:text-primary-fixed">
                  {showCatManager ? "Fermer" : "Gérer"}
                </button>
              </div>
              <select value={editing.category ?? ""} onChange={(e) => update("category", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                <option value="">— Choisir —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {showCatManager && (
                <div className="mt-3 p-3 border border-outline-variant/30 bg-surface-container-lowest space-y-2">
                  <p className="text-[0.55rem] uppercase tracking-widest text-secondary font-bold">Catégories</p>
                  {categories.map((c) => (
                    <div key={c.id} className="flex justify-between items-center">
                      <span className="text-xs">{c.name}</span>
                      <button type="button" onClick={() => removeCategory(c.id)} className="text-[0.55rem] text-error hover:text-error-dim">×</button>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2 border-t border-outline-variant/15">
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
                      placeholder="Nouvelle catégorie"
                      className="flex-1 border border-outline-variant/30 py-1 px-2 text-xs bg-transparent"
                    />
                    <button type="button" onClick={addCategory} className="bg-on-surface text-surface px-3 py-1 text-[0.55rem] font-bold uppercase">+</button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Année</label>
              <input value={editing.year ?? ""} onChange={(e) => update("year", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <MediaUpload
                value={editing.main_image ?? ""}
                onChange={(url) => update("main_image", url)}
                folder="portfolio"
                label="Image principale"
                aspectRatio="aspect-[4/3]"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Description</label>
            <textarea value={editing.description ?? ""} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Taille grille</label>
              <select value={editing.grid_span} onChange={(e) => update("grid_span", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                {SPAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Ratio image</label>
              <select value={editing.grid_ratio} onChange={(e) => update("grid_ratio", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                {RATIO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Services (virgules)</label>
              <input value={(editing.services ?? []).join(", ")} onChange={(e) => update("services", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
          </div>
          {/* Content Blocks Editor */}
          <div className="mb-6 border-t border-outline-variant/15 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest">Blocs de contenu</h3>
              <div className="flex gap-2">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.value}
                    type="button"
                    onClick={() => {
                      const blocks = [...(editing.content_blocks ?? [])];
                      const newBlock: ContentBlock = { type: bt.value };
                      if (bt.value === "image_grid") { newBlock.columns = 2; newBlock.images = [""]; }
                      if (bt.value === "text") { newBlock.title = ""; newBlock.body = ""; }
                      if (bt.value === "video") { newBlock.url = ""; newBlock.caption = ""; }
                      if (bt.value === "full_image") { newBlock.url = ""; newBlock.caption = ""; }
                      if (bt.value === "quote") { newBlock.text = ""; newBlock.author = ""; }
                      blocks.push(newBlock);
                      update("content_blocks", blocks as unknown as string[]);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-surface-container text-xs font-bold text-secondary hover:bg-primary-container hover:text-on-primary-fixed transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">{bt.icon}</span>
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            {(editing.content_blocks ?? []).length === 0 && (
              <p className="text-sm text-secondary py-4 text-center border border-dashed border-outline-variant/30">
                Aucun bloc. Cliquez ci-dessus pour en ajouter.
              </p>
            )}

            <div className="space-y-4">
              {(editing.content_blocks ?? []).map((block, blockIndex) => {
                function updateBlock(field: string, value: unknown) {
                  const blocks = [...(editing!.content_blocks ?? [])];
                  blocks[blockIndex] = { ...blocks[blockIndex], [field]: value };
                  update("content_blocks", blocks as unknown as string[]);
                }
                function removeBlock() {
                  const blocks = (editing!.content_blocks ?? []).filter((_, i) => i !== blockIndex);
                  update("content_blocks", blocks as unknown as string[]);
                }
                function moveBlock(dir: -1 | 1) {
                  const blocks = [...(editing!.content_blocks ?? [])];
                  const target = blockIndex + dir;
                  if (target < 0 || target >= blocks.length) return;
                  [blocks[blockIndex], blocks[target]] = [blocks[target], blocks[blockIndex]];
                  update("content_blocks", blocks as unknown as string[]);
                }

                return (
                  <div key={blockIndex} className="border border-outline-variant/30 p-4 bg-surface-container-lowest">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-secondary">
                          {BLOCK_TYPES.find((bt) => bt.value === block.type)?.icon}
                        </span>
                        <span className="text-[0.6rem] uppercase tracking-widest font-bold text-secondary">
                          {BLOCK_TYPES.find((bt) => bt.value === block.type)?.label} #{blockIndex + 1}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveBlock(-1)} className="px-2 py-1 text-xs text-secondary hover:text-on-surface">↑</button>
                        <button type="button" onClick={() => moveBlock(1)} className="px-2 py-1 text-xs text-secondary hover:text-on-surface">↓</button>
                        <button type="button" onClick={removeBlock} className="px-2 py-1 text-xs text-error hover:text-error-dim">×</button>
                      </div>
                    </div>

                    {block.type === "text" && (
                      <div className="space-y-3">
                        <input value={block.title ?? ""} onChange={(e) => updateBlock("title", e.target.value)} placeholder="Titre (optionnel)" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                        <textarea value={block.body ?? ""} onChange={(e) => updateBlock("body", e.target.value)} placeholder="Texte..." rows={3} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
                      </div>
                    )}

                    {block.type === "image_grid" && (
                      <div className="space-y-3">
                        <div className="flex gap-3 items-center">
                          <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">Colonnes</label>
                          <select value={block.columns ?? 2} onChange={(e) => updateBlock("columns", parseInt(e.target.value))} className="border border-outline-variant/30 py-1 px-2 text-sm bg-transparent">
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                          </select>
                        </div>
                        <div className={`grid gap-3 ${block.columns === 3 ? "grid-cols-3" : block.columns === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                          {(block.images ?? [""]).map((img, imgIndex) => (
                            <div key={imgIndex} className="relative">
                              <MediaUpload
                                value={img}
                                onChange={(url) => {
                                  const imgs = [...(block.images ?? [])];
                                  imgs[imgIndex] = url;
                                  updateBlock("images", imgs);
                                }}
                                folder="portfolio/gallery"
                                label={`Image ${imgIndex + 1}`}
                                aspectRatio="aspect-[4/3]"
                              />
                              <button type="button" onClick={() => {
                                const imgs = (block.images ?? []).filter((_, i) => i !== imgIndex);
                                updateBlock("images", imgs);
                              }} className="absolute top-0 right-0 bg-error text-white text-xs px-2 py-1">×</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" onClick={() => updateBlock("images", [...(block.images ?? []), ""])} className="text-xs text-primary font-bold">+ Ajouter image</button>
                      </div>
                    )}

                    {block.type === "full_image" && (
                      <div className="space-y-3">
                        <MediaUpload
                          value={block.url ?? ""}
                          onChange={(url) => updateBlock("url", url)}
                          folder="portfolio/full"
                          label="Image"
                          aspectRatio="aspect-[16/9]"
                        />
                        <input value={block.caption ?? ""} onChange={(e) => updateBlock("caption", e.target.value)} placeholder="Légende (optionnel)" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                      </div>
                    )}

                    {block.type === "video" && (
                      <div className="space-y-3">
                        <MediaUpload
                          value={block.url ?? ""}
                          onChange={(url) => updateBlock("url", url)}
                          folder="portfolio/video"
                          accept="video/*"
                          label="Vidéo (fichier ou URL YouTube/Vimeo)"
                          aspectRatio="aspect-video"
                        />
                        <input value={block.caption ?? ""} onChange={(e) => updateBlock("caption", e.target.value)} placeholder="Légende (optionnel)" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                      </div>
                    )}

                    {block.type === "quote" && (
                      <div className="space-y-3">
                        <textarea value={block.text ?? ""} onChange={(e) => updateBlock("text", e.target.value)} placeholder="Citation..." rows={2} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
                        <input value={block.author ?? ""} onChange={(e) => updateBlock("author", e.target.value)} placeholder="Auteur" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all">Enregistrer</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-secondary hover:text-on-surface">Annuler</button>
          </div>
        </div>
      )}

      {/* Grid view — Behance-style preview */}
      {view === "grid" ? (
        <div>
          <p className="text-[0.6rem] uppercase tracking-widest text-secondary mb-4">
            Glissez pour réordonner • Cliquez sur les contrôles pour ajuster la taille
          </p>
          <div className="grid grid-cols-12 gap-2 bg-surface-container border border-outline-variant/15 p-3">
            {items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(item.id)}
                className={`${item.grid_span} relative group cursor-move bg-surface-container-lowest overflow-hidden ${
                  dragId === item.id ? "opacity-40" : ""
                }`}
              >
                {item.main_image ? (
                  <img
                    src={item.main_image}
                    alt={item.title}
                    className={`w-full h-full object-cover ${item.grid_ratio}`}
                  />
                ) : (
                  <div className={`w-full bg-outline-variant/10 flex items-center justify-center ${item.grid_ratio}`}>
                    <span className="text-secondary text-xs">{item.title}</span>
                  </div>
                )}

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/80 transition-all duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[0.55rem] text-primary-fixed font-bold uppercase">{item.category}</p>
                      <p className="text-sm text-white font-bold">{item.title}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing(item); setIsNew(false); }} className="bg-white/20 px-2 py-1 text-[0.55rem] text-white font-bold hover:bg-white/40">
                        Edit
                      </button>
                      <button onClick={() => remove(item.id)} className="bg-error/80 px-2 py-1 text-[0.55rem] text-white font-bold hover:bg-error">
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Size controls */}
                  <div className="flex gap-1 flex-wrap">
                    {SPAN_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => updateLayout(item.id, "grid_span", o.value)}
                        className={`px-2 py-1 text-[0.5rem] font-bold uppercase transition-colors ${
                          item.grid_span === o.value
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-white/10 text-white/60 hover:bg-white/20"
                        }`}
                      >
                        {o.label.split(" — ")[1]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List view — card format */
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDragId(item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item.id)}
              className={`bg-surface-container-lowest border border-outline-variant/15 hover:border-outline-variant/40 transition-colors cursor-move ${
                dragId === item.id ? "opacity-40" : ""
              }`}
            >
              <div className="flex gap-0">
                {/* Drag handle + image */}
                <div className="flex items-stretch">
                  <div className="w-8 bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm text-secondary">drag_indicator</span>
                  </div>
                  {item.main_image ? (
                    <img src={item.main_image} alt="Aperçu projet" className="w-28 h-28 object-cover shrink-0" />
                  ) : (
                    <div className="w-28 h-28 bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl text-outline-variant/30">image</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold truncate">{item.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[0.6rem] text-secondary">{item.client}</span>
                          {item.category && (
                            <span className="text-[0.55rem] uppercase tracking-widest bg-surface-container px-2 py-0.5 font-bold text-secondary">
                              {item.category}
                            </span>
                          )}
                          {item.year && <span className="text-[0.6rem] text-secondary">{item.year}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => { setEditing(item); setIsNew(false); }}
                          className="p-1.5 hover:bg-surface-container transition-colors"
                          title="Modifier"
                        >
                          <span className="material-symbols-outlined text-sm text-secondary hover:text-primary">edit</span>
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="p-1.5 hover:bg-error/10 transition-colors"
                          title="Supprimer"
                        >
                          <span className="material-symbols-outlined text-sm text-secondary hover:text-error">delete</span>
                        </button>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-xs text-secondary mt-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>

                  {/* Layout controls */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.5rem] uppercase tracking-widest text-secondary font-bold">Taille</span>
                      <select
                        value={item.grid_span}
                        onChange={(e) => updateLayout(item.id, "grid_span", e.target.value)}
                        className="text-[0.6rem] bg-transparent border border-outline-variant/20 px-2 py-0.5 font-bold"
                      >
                        {SPAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label.split(" — ")[1]}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.5rem] uppercase tracking-widest text-secondary font-bold">Ratio</span>
                      <select
                        value={item.grid_ratio}
                        onChange={(e) => updateLayout(item.id, "grid_ratio", e.target.value)}
                        className="text-[0.6rem] bg-transparent border border-outline-variant/20 px-2 py-0.5 font-bold"
                      >
                        {RATIO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <span className="text-[0.5rem] text-outline-variant ml-auto">
                      slug: <span className="font-mono">{item.slug}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
