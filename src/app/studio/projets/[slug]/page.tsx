import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import VideoPlayer from "@/components/VideoPlayer";
import StickyBackToProjects from "@/components/StickyBackToProjects";

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

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("portfolio").select("slug");
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("portfolio")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!project) return { title: "Projet introuvable" };
  return {
    title: `${project.title} | LOLLY Studio`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("portfolio")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!project) notFound();

  // Related projects — same category, excluding current, up to 4
  const { data: categoryMatches } = await supabase
    .from("portfolio")
    .select("slug, title, category, main_image")
    .eq("category", project.category)
    .neq("slug", slug)
    .order("grid_order")
    .limit(4);

  // Fallback: if fewer than 3 category-matches, top up with latest projects
  let related = categoryMatches ?? [];
  if (related.length < 3) {
    const { data: fallback } = await supabase
      .from("portfolio")
      .select("slug, title, category, main_image")
      .neq("slug", slug)
      .not("slug", "in", `(${related.map((p) => `"${p.slug}"`).join(",") || "null"})`)
      .order("grid_order")
      .limit(4 - related.length);
    related = [...related, ...(fallback ?? [])];
  }

  const gallery: string[] = project.gallery ?? [];
  const contentBlocks: ContentBlock[] = project.content_blocks ?? [];

  // Pre-filled WhatsApp text referencing this specific project
  const whatsappText = encodeURIComponent(
    `Bonjour LOLLY Agency, j'ai vu votre projet "${project.title}" — je souhaiterais discuter d'un projet similaire.`
  );
  const whatsappUrl = `https://wa.me/+221772354747?text=${whatsappText}`;

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Header */}
        <section className="px-6 md:px-12 pt-12 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-7">
                <span className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-3 block">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
                  {project.title}
                </h1>
                <div className="flex gap-6 text-sm text-secondary">
                  <span>{project.client}</span>
                  {project.year && (
                    <>
                      <span>•</span>
                      <span>{project.year}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-5">
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Image principale */}
        {project.main_image && (
          <section className="px-4 md:px-6 pb-3">
            <div className="relative w-full aspect-[16/9]">
              <Image
                className="object-cover"
                src={project.main_image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1920px) 96vw, 1920px"
                priority
              />
            </div>
          </section>
        )}

        {/* Content Blocks */}
        {contentBlocks.length > 0 ? (
          contentBlocks.map((block: ContentBlock, i: number) => {
            switch (block.type) {
              case "text":
                return (
                  <section key={i} className="px-6 md:px-12 py-16">
                    <div className="max-w-5xl mx-auto">
                      {block.title && (
                        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-6">
                          {block.title}
                        </h2>
                      )}
                      <p className="text-lg text-on-surface-variant leading-relaxed">
                        {block.body}
                      </p>
                    </div>
                  </section>
                );

              case "image_grid":
                return (
                  <section key={i} className="px-4 md:px-6 py-3">
                    <div className={`grid gap-3 ${
                      block.columns === 3
                        ? "grid-cols-1 md:grid-cols-3"
                        : block.columns === 1
                        ? "grid-cols-1 max-w-5xl mx-auto"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}>
                      {(block.images ?? []).map((img: string, j: number) => (
                        <div key={j}>
                          <div className="relative w-full aspect-[4/3]">
                            <Image
                              className="object-cover"
                              src={img}
                              alt={`${project.title} — ${j + 1}`}
                              fill
                              sizes={
                                block.columns === 3
                                  ? "(max-width: 768px) 100vw, 33vw"
                                  : block.columns === 1
                                  ? "(max-width: 768px) 100vw, 1024px"
                                  : "(max-width: 768px) 100vw, 50vw"
                              }
                            />
                          </div>
                          {block.captions?.[j] && (
                            <p className="text-xs text-secondary mt-2 px-1">
                              {block.captions[j]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case "full_image":
                return (
                  <section key={i} className="px-4 md:px-6 py-3">
                    {block.url && (
                      <div className="relative w-full aspect-[16/9]">
                        <Image
                          className="object-cover"
                          src={block.url}
                          alt={block.caption || project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1920px) 96vw, 1920px"
                        />
                      </div>
                    )}
                    {block.caption && (
                      <p className="text-xs text-secondary mt-2 px-2">
                        {block.caption}
                      </p>
                    )}
                  </section>
                );

              case "video":
                return (
                  <section key={i} className="px-4 md:px-6 py-6">
                    <div className="max-w-5xl mx-auto">
                      {block.url?.includes("youtube") || block.url?.includes("youtu.be") ? (
                        /* YouTube — iframe avec wrapper design */
                        <div className="relative bg-on-surface">
                          <div className="aspect-video">
                            <iframe
                              src={block.url
                                .replace("watch?v=", "embed/")
                                .replace("youtu.be/", "youtube.com/embed/")
                                + "?rel=0&modestbranding=1&color=white"}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={block.caption || "Video"}
                            />
                          </div>
                          {block.caption && (
                            <div className="bg-on-surface px-4 py-3 flex justify-between items-center">
                              <span className="text-xs text-white/60">{block.caption}</span>
                              <span className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">LOLLY</span>
                            </div>
                          )}
                        </div>
                      ) : block.url?.includes("vimeo") ? (
                        /* Vimeo — iframe avec wrapper design */
                        <div className="relative bg-on-surface">
                          <div className="aspect-video">
                            <iframe
                              src={block.url.replace("vimeo.com/", "player.vimeo.com/video/") + "?badge=0&autopause=0"}
                              className="w-full h-full"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                              title={block.caption || "Video"}
                            />
                          </div>
                          {block.caption && (
                            <div className="bg-on-surface px-4 py-3 flex justify-between items-center">
                              <span className="text-xs text-white/60">{block.caption}</span>
                              <span className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">LOLLY</span>
                            </div>
                          )}
                        </div>
                      ) : block.url ? (
                        /* Fichier video — custom player LOLLY */
                        <VideoPlayer
                          src={block.url}
                          caption={block.caption}
                        />
                      ) : null}
                    </div>
                  </section>
                );

              case "quote":
                return (
                  <section key={i} className="px-6 md:px-12 py-16">
                    <div className="max-w-4xl mx-auto bg-surface-container-lowest border-l-4 border-primary-fixed p-10 md:p-14">
                      <span className="text-4xl font-black text-primary-fixed leading-none block mb-4">
                        &ldquo;
                      </span>
                      <p className="text-xl md:text-2xl font-light leading-relaxed mb-6">
                        {block.text}
                      </p>
                      {block.author && (
                        <p className="text-sm font-bold uppercase tracking-widest text-secondary">
                          — {block.author}
                        </p>
                      )}
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })
        ) : (
          /* Fallback — old gallery + details if no content blocks */
          <>
            {gallery.length > 0 && (
              <section className="px-4 md:px-6 pb-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {gallery.map((img, j) => (
                    <div key={j} className={`relative w-full aspect-[4/3] ${j % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}`}>
                      <Image
                        className="object-cover"
                        src={img}
                        alt={`${project.title} — ${j + 1}`}
                        fill
                        sizes={j % 2 === 0 ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Fiche projet — 7/5 golden ratio */}
        <section className="px-6 md:px-12 py-16 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 flex gap-12">
              <div>
                <p className="text-[0.6rem] uppercase tracking-widest text-primary font-bold mb-2">Client</p>
                <p className="text-lg font-bold">{project.client}</p>
              </div>
              <div>
                <p className="text-[0.6rem] uppercase tracking-widest text-primary font-bold mb-2">Catégorie</p>
                <p className="text-lg font-bold">{project.category}</p>
              </div>
              {project.year && (
                <div>
                  <p className="text-[0.6rem] uppercase tracking-widest text-primary font-bold mb-2">Année</p>
                  <p className="text-lg font-bold">{project.year}</p>
                </div>
              )}
            </div>
            {project.services && project.services.length > 0 && (
              <div className="md:col-span-5">
                <p className="text-[0.6rem] uppercase tracking-widest text-primary font-bold mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {project.services.map((s: string) => (
                    <span key={s} className="px-3 py-1 bg-surface-container text-xs font-bold uppercase tracking-widest text-on-surface-variant">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Projets similaires — remplace le linéaire prev/next */}
        {related.length > 0 && (
          <section className="border-t border-outline-variant/15 px-6 md:px-12 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-widest text-primary font-bold mb-2 block">
                    À découvrir aussi
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    {categoryMatches && categoryMatches.length > 0
                      ? `Autres projets ${project.category}`
                      : "Autres projets"}
                  </h2>
                </div>
                <Link
                  href="/studio/projets"
                  className="text-[0.65rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors font-bold"
                >
                  Tous les projets →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/studio/projets/${p.slug}`}
                    className="group relative aspect-[4/3] overflow-hidden bg-surface-container-lowest"
                  >
                    {p.main_image ? (
                      <Image
                        src={p.main_image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-black text-outline-variant/20">
                          {p.title?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/70 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-[0.55rem] uppercase tracking-widest text-primary-fixed font-bold block">
                          {p.category}
                        </span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-on-surface text-white px-6 md:px-12 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
              Un projet similaire en tête ?
            </h2>
            <p className="text-surface-dim text-sm uppercase tracking-widest mb-8">
              Inspiré par {project.title} ?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={`/contact?message=${encodeURIComponent(`Bonjour, j'ai découvert votre projet "${project.title}" sur votre portfolio et je souhaiterais discuter d'un projet similaire.`)}`}
                className="bg-primary-fixed text-on-primary-fixed font-black uppercase px-10 py-5 text-sm tracking-widest hover:bg-primary-fixed-dim transition-all"
              >
                Parlons-en
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white text-white font-black uppercase px-10 py-5 text-sm tracking-widest hover:bg-white hover:text-on-surface transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <StickyBackToProjects />
      <Footer />
    </>
  );
}
