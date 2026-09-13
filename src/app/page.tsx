import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Agence de Conseil en Communication | LOLLY Agence",
    description: "Conseil, production et formation à Dakar : trouvons le bon point de départ pour ton activité.",
    url: "https://lolly.sn",
    type: "website",
  },
};

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("homepage_blocks").select("*").order("id");

  const studio = data?.find((b) => b.id === "studio") ?? {
    label: "Conseil & création",
    title: "Studio.",
    description: "Une stratégie claire et des contenus produits pour parler à vos clients.",
    cta_text: "Découvrir Studio",
    link: "/studio",
    image: null,
  };
  const rentalBlock = data?.find((b) => b.id === "rental") ?? {
    label: "Espaces & matériel",
    title: "Production.",
    description: "Les espaces et les équipements utiles à vos projets audiovisuels.",
    cta_text: "Découvrir Production",
    link: "/production",
    image: null,
  };
  const production = {
    ...rentalBlock,
    title: rentalBlock.title.replace(/rental/gi, "Production"),
    cta_text: rentalBlock.cta_text?.replace(/rental/gi, "Production") ?? "Découvrir Production",
    link: rentalBlock.link.replace(/^\/rental(?=\/|$)/, "/production"),
  };
  const studioLabel = /^service\s*0?1\b/i.test(studio.label)
    ? studio.label
    : `Service 01 · ${studio.label}`;
  const productionLabel = /^service\s*0?2\b/i.test(production.label)
    ? production.label
    : `Service 02 · ${production.label}`;

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero band — accroche de marque */}
        <section className="bg-on-surface text-white px-6 md:px-12 pt-16 pb-10 md:pt-20 md:pb-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-primary-fixed font-bold block mb-4">
                LOLLY · Dakar
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.95]">
                L&apos;agence qui marque.{" "}
                <span className="text-primary-fixed">Les compétences qui restent.</span>
              </h1>
            </div>
            <div className="md:max-w-sm">
              <p className="text-sm md:text-base text-surface-variant leading-relaxed">
                Conseil et création, studios et matériel, formation pratique :
                trois façons d&apos;avancer avec LOLLY, selon ton besoin.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="bg-primary-fixed text-on-primary-fixed px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-primary-fixed-dim transition-colors">
                  Parler de mon projet →
                </Link>
                <a href="#services" className="border border-white/60 px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-white hover:text-on-surface transition-colors">
                  Choisir mon service
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trois portes d'entrée de même rang */}
        <section id="services" aria-label="Choisir votre parcours LOLLY" className="grid grid-cols-1 md:grid-cols-3 w-full scroll-mt-24">
          {/* Studio Block */}
          {studio && (
            <Link
              href={studio.link}
              className="relative min-h-[390px] md:min-h-[520px] flex flex-col group overflow-hidden bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline/10"
            >
              {studio.image && (
                <div
                  className="absolute inset-0 opacity-30 group-hover:opacity-55 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${studio.image}')` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent" />
              <div className="relative flex-1 flex flex-col justify-between p-10 md:p-8 lg:p-12 xl:p-16 z-10">
                <div className="flex items-start justify-between">
                  <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-on-surface-variant">
                    {studioLabel}
                  </span>
                  <span className="w-8 h-8 border border-on-surface/20 flex items-center justify-center group-hover:bg-primary-fixed group-hover:border-primary-fixed transition-all">
                    <span className="material-symbols-outlined text-sm text-on-surface">
                      arrow_outward
                    </span>
                  </span>
                </div>
                <div>
                  <h2 className="text-5xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-on-surface mb-5 leading-[0.9]">
                    {studio.title}
                  </h2>
                  <p className="text-base md:text-lg max-w-md text-secondary mb-8 leading-relaxed min-h-[5.5rem]">
                    {studio.description}
                  </p>
                  <span className="inline-flex items-center">
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest border-b-2 border-primary-fixed pb-1">
                      {studio.cta_text}
                    </span>
                    <span className="material-symbols-outlined ml-3 group-hover:translate-x-2 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Production Block */}
          {production && (
            <Link
              href={production.link}
              className="relative min-h-[390px] md:min-h-[520px] flex flex-col group overflow-hidden bg-on-surface border-b md:border-b-0 md:border-r border-white/15"
            >
              {production.image && (
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-65 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${production.image}')` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/70 to-transparent" />
              <div className="relative flex-1 flex flex-col justify-between p-10 md:p-8 lg:p-12 xl:p-16 z-10">
                <div className="flex items-start justify-between">
                  <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-surface-variant">
                    {productionLabel}
                  </span>
                  <span className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-primary-fixed group-hover:border-primary-fixed transition-all">
                    <span className="material-symbols-outlined text-sm text-white group-hover:text-on-surface">
                      arrow_outward
                    </span>
                  </span>
                </div>
                <div>
                  <h2 className="text-5xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white mb-5 leading-[0.9]">
                    {production.title}
                  </h2>
                  <p className="text-base md:text-lg max-w-md text-surface-dim mb-8 leading-relaxed min-h-[5.5rem]">
                    {production.description}
                  </p>
                  <span className="inline-flex items-center">
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest border-b-2 border-primary-fixed text-white pb-1">
                      {production.cta_text}
                    </span>
                    <span className="material-symbols-outlined ml-3 text-white group-hover:translate-x-2 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          )}
          <Link href="/academy" className="group min-h-[390px] md:min-h-[520px] bg-primary-fixed text-on-primary-fixed flex flex-col justify-between p-10 md:p-8 lg:p-12 xl:p-16 hover:bg-primary-fixed-dim transition-colors">
            <div className="flex items-start justify-between">
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase">Service 03 · Se former</span>
              <span className="w-8 h-8 border border-on-primary-fixed/30 flex items-center justify-center group-hover:bg-on-surface group-hover:text-primary-fixed transition-colors" aria-hidden="true">↗</span>
            </div>
            <div>
              <h2 className="text-5xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter mb-5 leading-[0.9]">Academy.</h2>
              <p className="text-base md:text-lg max-w-md mb-8 leading-relaxed">
                Tu veux mieux présenter ton activité, créer du contenu utile ou former ton équipe ? On commence par comprendre ton besoin.
              </p>
              <span className="inline-flex items-center text-xs md:text-sm font-black uppercase tracking-widest border-b-2 border-on-primary-fixed pb-1 group-hover:translate-x-1 transition-transform">
                Découvrir Academy →
              </span>
            </div>
          </Link>
        </section>

        {/* Repères de parcours */}
        <section className="bg-surface-container-lowest text-on-surface py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { k: "01", v: "Comprendre votre besoin" },
              { k: "02", v: "Choisir la bonne réponse" },
              { k: "03", v: "Produire ou apprendre" },
              { k: "04", v: "Suivre les résultats" },
            ].map((s) => (
              <div key={s.k} className="border-l-2 border-primary-fixed pl-4">
                <p className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                  {s.k}
                </p>
                <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-80 mt-2">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
