import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import VideoPlayer from "@/components/VideoPlayer";

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

  // Fetch all slugs for prev/next navigation
  const { data: allProjects } = await supabase
    .from("portfolio")
    .select("slug, title")
    .order("created_at", { ascending: false });

  const list = allProjects ?? [];
  const currentIndex = list.findIndex((p) => p.slug === slug);
  const prevProject = list[(currentIndex - 1 + list.length) % list.length];
  const nextProject = list[(currentIndex + 1) % list.length];

  const gallery: string[] = project.gallery ?? [];
  const contentBlocks: ContentBlock[] = project.content_blocks ?? [];

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
            <img
              className="w-full object-cover aspect-[16/9]"
              src={project.main_image}
              alt={project.title}
            />
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
                          <img
                            className="w-full object-cover aspect-[4/3]"
                            src={img}
                            alt={`${project.title} — ${j + 1}`}
                          />
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
                    <img
                      className="w-full object-cover"
                      src={block.url}
                      alt={block.caption || project.title}
                    />
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
                    <img key={j} className={`w-full object-cover aspect-[4/3] ${j % 2 === 0 ? "md:col-span-7" : "md:col-span-5"}`} src={img} alt={`${project.title} — ${j + 1}`} />
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

        {/* Navigation prev/next */}
        <section className="border-t border-outline-variant/15">
          <div className="grid grid-cols-2">
            <Link
              href={`/studio/projets/${prevProject.slug}`}
              className="group p-8 md:p-12 border-r border-outline-variant/15 hover:bg-surface-container-lowest transition-colors"
            >
              <span className="text-[0.65rem] uppercase tracking-widest text-secondary block mb-2">
                ← Précédent
              </span>
              <span className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                {prevProject.title}
              </span>
            </Link>
            <Link
              href={`/studio/projets/${nextProject.slug}`}
              className="group p-8 md:p-12 text-right hover:bg-surface-container-lowest transition-colors"
            >
              <span className="text-[0.65rem] uppercase tracking-widest text-secondary block mb-2">
                Suivant →
              </span>
              <span className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                {nextProject.title}
              </span>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-on-surface text-white px-6 md:px-12 py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
              Un projet similaire en tête ?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary-fixed text-on-primary-fixed font-black uppercase px-10 py-5 text-sm tracking-widest hover:bg-primary-fixed-dim transition-all"
              >
                Parlons-en
              </Link>
              <a
                href="https://wa.me/+221772354747?text=Bonjour%20LOLLY%20Agency%2C%20je%20souhaiterais%20en%20savoir%20plus%20sur%20vos%20services."
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
      <Footer />
    </>
  );
}
