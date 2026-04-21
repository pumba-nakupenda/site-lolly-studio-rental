import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

export const metadata: Metadata = {
  title: "Studio | LOLLY Agence — Conseil en Communication",
  description:
    "Agence de Conseil en Communication d'élite au Sénégal. Stratégie 360, Branding, Formation, Production Vidéo et Community Management.",
};

export const revalidate = 60;

const stats = [
  { value: "150+", label: "Projets livrés" },
  { value: "40+", label: "Clients actifs" },
  { value: "12", label: "Années d'expérience" },
  { value: "40+", label: "Services d'élite" },
];

export default async function StudioPage() {
  const supabase = await createClient();

  const [
    { data: portfolio },
    { data: partners },
    { data: testimonials },
    { data: services },
    { data: team },
  ] = await Promise.all([
    supabase.from("portfolio").select("*").order("created_at", { ascending: false }).limit(3),
    supabase.from("partners").select("name, logo").order("created_at"),
    supabase.from("testimonials").select("*"),
    supabase.from("services").select("*").order("order_id"),
    supabase.from("team_members").select("*").eq("is_visible", true).order("order_id"),
  ]);

  const projects = portfolio ?? [];
  const allPartners = partners ?? [];
  const allTestimonials = testimonials ?? [];
  const teamMembers = team ?? [];
  const allServices = services ?? [];

  const firstProject = projects[0];
  const remainingProjects = projects.slice(1);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* ═══ PORTFOLIO — Golden ratio grid ═══ */}
        <section className="px-4 md:px-6 pt-6 pb-3">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-3 gap-3 lg:h-[calc(100svh-120px)]">

            {/* Row 1 — 7/5 : projet dominant + tagline */}
            {firstProject && (
              <Link href={`/studio/projets/${firstProject.slug}`} className="lg:col-span-7 lg:row-span-2 lg:row-start-1 lg:col-start-1 group relative overflow-hidden aspect-[4/3] lg:aspect-auto">
                {firstProject.main_image && (
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    src={firstProject.main_image}
                    alt={firstProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/70 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">{firstProject.category}</span>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{firstProject.title}</h3>
                  </div>
                </div>
              </Link>
            )}

            {/* Bloc tagline — 5 cols, golden ratio right */}
            <div className="lg:col-span-5 lg:row-span-2 lg:row-start-1 lg:col-start-8 bg-on-surface flex flex-col justify-between gap-5 p-6 sm:p-8 lg:p-10 min-h-0 overflow-hidden">
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-primary-fixed font-bold block mb-3">
                  Agence de Conseil en Communication
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-[1.65rem] xl:text-3xl font-black text-white leading-[1.15] tracking-tight">
                  Des mots qui touchent,{" "}
                  <span className="text-primary-fixed">des images</span> qui
                  marquent.
                </h1>
                <p className="mt-5 text-sm sm:text-base lg:text-[1.05rem] text-surface-variant leading-relaxed">
                  Basés à Dakar, nous accompagnons les marques ambitieuses
                  d&apos;Afrique de l&apos;Ouest sur toute la chaîne de valeur :
                  stratégie 360, branding, production audiovisuelle, community
                  management et formation.
                </p>
                <p className="mt-3 text-sm sm:text-base lg:text-[1.05rem] text-white/85 leading-relaxed">
                  12 ans d&apos;expérience, 150+ projets livrés, une obsession
                  unique — transformer votre prise de parole en{" "}
                  <span className="text-primary-fixed font-bold">
                    levier de croissance mesurable
                  </span>
                  .
                </p>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    { k: "Exigence", v: "Zéro compromis sur l'exécution" },
                    { k: "Stratégie", v: "La data avant la créa" },
                    { k: "Proximité", v: "Un interlocuteur unique" },
                    { k: "Impact", v: "Des KPIs, pas du vent" },
                  ].map((val) => (
                    <li key={val.k} className="border-l-2 border-primary-fixed pl-3">
                      <p className="text-[0.7rem] uppercase tracking-widest text-primary-fixed font-black">
                        {val.k}
                      </p>
                      <p className="text-xs lg:text-sm text-white/75 leading-snug mt-0.5">
                        {val.v}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/studio/projets" className="inline-flex items-center group/cta mt-6">
                <span className="text-sm font-black uppercase tracking-widest text-white border-b-2 border-primary-fixed pb-1">
                  Voir tous les projets
                </span>
                <span className="material-symbols-outlined ml-3 text-white group-hover/cta:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            {/* Remaining projects */}
            {remainingProjects[0] && (
              <Link href={`/studio/projets/${remainingProjects[0].slug}`} className="lg:col-span-5 lg:col-start-1 lg:row-start-3 group relative overflow-hidden aspect-[8/5] lg:aspect-auto">
                {remainingProjects[0].main_image && (
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    src={remainingProjects[0].main_image}
                    alt={remainingProjects[0].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                )}
                <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/70 transition-all duration-500 flex flex-col justify-end p-6">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">{remainingProjects[0].category}</span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{remainingProjects[0].title}</h3>
                  </div>
                </div>
              </Link>
            )}

            {/* Row 3 — projet secondaire */}
            {remainingProjects[1] && (
              <Link href={`/studio/projets/${remainingProjects[1].slug}`} className="lg:col-span-7 lg:col-start-6 lg:row-start-3 group relative overflow-hidden aspect-[5/8] lg:aspect-auto">
                {remainingProjects[1].main_image && (
                  <Image
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    src={remainingProjects[1].main_image}
                    alt={remainingProjects[1].title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                )}
                <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/70 transition-all duration-500 flex flex-col justify-end p-6">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">{remainingProjects[1].category}</span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{remainingProjects[1].title}</h3>
                  </div>
                </div>
              </Link>
            )}

          </div>
        </section>

        {/* Lien vers tous les projets */}
        <section className="px-4 md:px-6 pb-0">
          <Link
            href="/studio/projets"
            className="block bg-surface-container-lowest border border-outline-variant/15 py-5 text-center group hover:bg-primary-container transition-colors duration-300"
          >
            <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant group-hover:text-on-primary-container">
              Voir tous les projets →
            </span>
          </Link>
        </section>

        {/* ═══ CLIENTS — logos sur fond noir ═══ */}
        <ScrollReveal>
        <section className="bg-on-surface py-10 px-6 md:px-12 mt-3">
          <div className="max-w-7xl mx-auto">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-surface-variant mb-8 text-center">
              Ils nous font confiance
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center">
              {allPartners.map((p: { name: string; logo: string | null }) => (
                <div key={p.name} className="h-10 flex items-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.name}
                      width={120}
                      height={40}
                      className="h-full w-auto object-contain brightness-0 invert"
                      unoptimized={p.logo.endsWith(".svg")}
                    />
                  ) : (
                    <span className="text-sm font-black text-white/60 uppercase tracking-tighter">
                      {p.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ═══ TEMOIGNAGES — 7/5 golden ratio ═══ */}
        <ScrollReveal>
        <section className="py-24 px-6 md:px-12 bg-surface">
          <div className="max-w-7xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
              Témoignages
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">
              La Preuve par l&apos;Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Grand — 7 cols */}
              {allTestimonials[0] && (
                <div className="md:col-span-7 bg-on-surface text-white p-10 md:p-14">
                  <span className="text-6xl font-black text-primary-fixed leading-none block mb-6">
                    &ldquo;
                  </span>
                  <p className="text-xl md:text-2xl font-light leading-relaxed mb-8">
                    {allTestimonials[0].content}
                  </p>
                  <div className="flex items-center gap-4">
                    {allTestimonials[0].avatar ? (
                      <Image src={allTestimonials[0].avatar} alt={allTestimonials[0].name} width={120} height={32} className="h-8 w-auto object-contain brightness-0 invert" unoptimized={allTestimonials[0].avatar.endsWith(".svg")} />
                    ) : (
                      <div className="w-11 h-11 bg-primary-fixed flex items-center justify-center">
                        <span className="font-black text-on-primary-fixed">{allTestimonials[0].name?.charAt(0) ?? "?"}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold uppercase text-sm">{allTestimonials[0].name}</p>
                      <p className="text-surface-variant text-sm">{allTestimonials[0].role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Petit — 5 cols */}
              {allTestimonials[1] && (
                <div className="md:col-span-5 border border-outline-variant/30 p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-5xl font-black text-primary-fixed leading-none block mb-5">
                      &ldquo;
                    </span>
                    <p className="text-lg text-on-surface-variant leading-relaxed">
                      {allTestimonials[1].content}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    {allTestimonials[1].avatar ? (
                      <Image src={allTestimonials[1].avatar} alt={allTestimonials[1].name} width={120} height={28} className="h-7 w-auto object-contain" unoptimized={allTestimonials[1].avatar.endsWith(".svg")} />
                    ) : (
                      <div className="w-10 h-10 bg-surface-container flex items-center justify-center">
                        <span className="font-black text-on-surface text-sm">{allTestimonials[1].name?.charAt(0) ?? "?"}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold uppercase text-sm">{allTestimonials[1].name}</p>
                      <p className="text-secondary text-sm">{allTestimonials[1].role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ═══ EQUIPE ═══ */}
        {teamMembers.length > 0 && (
          <section className="py-20 px-6 md:px-12 bg-surface-container-lowest">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                {/* Titre — 5 cols */}
                <div className="md:col-span-5">
                  <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
                    L&apos;Équipe
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Les Esprits Derrière
                  </h2>
                </div>
                {/* Membres — 7 cols */}
                <div className="md:col-span-7 grid grid-cols-2 gap-6">
                  {teamMembers.map((m: { name: string; role: string; photo: string | null; bio: string | null; linkedin: string | null }) => (
                    <div key={m.name} className="group">
                      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-surface-container">
                        {m.photo ? (
                          <Image
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            src={m.photo}
                            alt={m.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 300px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl font-black text-outline-variant/20">{m.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <h4 className="text-sm font-bold uppercase tracking-tight">{m.name}</h4>
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary hover:text-primary-fixed transition-colors">LN</a>
                        )}
                      </div>
                      <p className="text-xs text-secondary mt-1">{m.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══ STATS — bande jaune avec compteurs animes ═══ */}
        <section className="bg-primary-fixed py-14 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <AnimatedCounter key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </section>

        {/* ═══ SERVICES — 7/5 hero + grille 2x4 ═══ */}
        <ScrollReveal>
        <section className="px-6 md:px-12 py-24 bg-surface-container-lowest">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-6">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block">
                Nos Expertises
              </span>
              <h2 className="text-4xl md:text-5xl font-bold kerning-tight uppercase">
                40+ Services
              </h2>
            </div>

            {/* Hero — premier service (Conseil) */}
            {allServices[0] && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-7 bg-on-surface text-white p-10 md:p-14">
                  <span className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-3 block">
                    {allServices[0].badge || "Cœur de métier"}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">
                    {allServices[0].title}
                  </h3>
                  <p className="text-surface-dim leading-relaxed">
                    {allServices[0].description}
                  </p>
                </div>
                <div className="md:col-span-5 bg-primary-fixed flex items-center justify-center p-10">
                  <Link
                    href="/contact"
                    className="bg-on-surface text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all"
                  >
                    Nous consulter
                  </Link>
                </div>
              </div>
            )}

            {/* Grille — services restants (2x4) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-outline-variant/15">
              {allServices.slice(1, 5).map((s: { title: string; description: string; order_id: number }) => (
                <div
                  key={s.title}
                  className="p-8 border-r border-b border-outline-variant/15 group hover:bg-primary-container transition-colors duration-500"
                >
                  <span className="text-3xl font-black text-on-surface/10 group-hover:text-on-primary-container/20 mb-3 block">
                    {String(s.order_id).padStart(2, "0")}
                  </span>
                  <h4 className="text-lg font-bold mb-2 group-hover:text-on-primary-container">
                    {s.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant group-hover:text-on-primary-container leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
            {/* Grille — secondaires (5+) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-l border-outline-variant/15">
              {allServices.slice(5).map((s: { title: string; description: string; order_id: number }) => (
                <div
                  key={s.title}
                  className="py-6 px-6 border-r border-b border-outline-variant/15 group hover:bg-primary-container/60 transition-colors duration-500"
                >
                  <span className="text-xl font-black text-outline-variant/20 group-hover:text-on-primary-container/20 mb-2 block">
                    {String(s.order_id).padStart(2, "0")}
                  </span>
                  <h4 className="text-sm font-bold mb-1 group-hover:text-on-primary-container">
                    {s.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant group-hover:text-on-primary-container leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* ═══ CTA ═══ */}
        <section className="bg-on-surface text-white px-6 md:px-12 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
              Votre projet mérite mieux qu&apos;une agence classique.
            </h2>
            <p className="text-lg text-surface-dim mb-10">
              Une heure de consultation stratégique offerte aux marques
              ambitieuses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary-fixed text-on-primary-fixed font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-primary-fixed-dim transition-all"
              >
                Réserver mon créneau
              </Link>
              <a
                href="https://wa.me/+221772354747?text=Bonjour%20LOLLY%20Agency%2C%20je%20souhaiterais%20en%20savoir%20plus%20sur%20vos%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white text-white font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-white hover:text-on-surface transition-all"
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
