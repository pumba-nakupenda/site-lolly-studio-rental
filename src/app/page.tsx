import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

const academyOffers = [
  { label: "Formation intensive", detail: "5 jours", price: "75 000 XOF" },
  { label: "Accompagnement", detail: "3 à 5 mois", price: "Dès 85 000 XOF" },
  { label: "Ateliers LOLLY", detail: "Par sujet", price: "25 000 XOF / pers." },
];

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
  const rental = data?.find((b) => b.id === "rental") ?? {
    label: "Espaces & matériel",
    title: "Rental.",
    description: "Les espaces et les équipements utiles à vos projets audiovisuels.",
    cta_text: "Découvrir Rental",
    link: "/rental",
    image: null,
  };

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
                Conseil, production, formation et location de matériel audiovisuel
                pour les entrepreneurs, les équipes et les créateurs d&apos;Afrique de
                l&apos;Ouest. Une maison, trois expertises.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/academy/diagnostic" className="bg-primary-fixed text-on-primary-fixed px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-primary-fixed-dim transition-colors">
                  Faire mon diagnostic gratuit →
                </Link>
                <Link href="/contact" className="border border-white/60 px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-white hover:text-on-surface transition-colors">
                  Parler de mon projet
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trois portes d'entrée de même rang */}
        <section aria-label="Choisir votre parcours LOLLY" className="grid grid-cols-1 md:grid-cols-3 w-full">
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
                    {studio.label}
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

          {/* Rental Block */}
          {rental && (
            <Link
              href={rental.link}
              className="relative min-h-[390px] md:min-h-[520px] flex flex-col group overflow-hidden bg-on-surface border-b md:border-b-0 md:border-r border-white/15"
            >
              {rental.image && (
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-65 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${rental.image}')` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/70 to-transparent" />
              <div className="relative flex-1 flex flex-col justify-between p-10 md:p-8 lg:p-12 xl:p-16 z-10">
                <div className="flex items-start justify-between">
                  <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase text-surface-variant">
                    {rental.label}
                  </span>
                  <span className="w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-primary-fixed group-hover:border-primary-fixed transition-all">
                    <span className="material-symbols-outlined text-sm text-white group-hover:text-on-surface">
                      arrow_outward
                    </span>
                  </span>
                </div>
                <div>
                  <h2 className="text-5xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-white mb-5 leading-[0.9]">
                    {rental.title}
                  </h2>
                  <p className="text-base md:text-lg max-w-md text-surface-dim mb-8 leading-relaxed min-h-[5.5rem]">
                    {rental.description}
                  </p>
                  <span className="inline-flex items-center">
                    <span className="text-xs md:text-sm font-black uppercase tracking-widest border-b-2 border-primary-fixed text-white pb-1">
                      {rental.cta_text}
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
              <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase">Se former · Academy</span>
              <span className="w-8 h-8 border border-on-primary-fixed/30 flex items-center justify-center group-hover:bg-on-surface group-hover:text-primary-fixed transition-colors" aria-hidden="true">↗</span>
            </div>
            <div>
              <h2 className="text-5xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter mb-5 leading-[0.9]">Academy.</h2>
              <p className="text-base md:text-lg max-w-md mb-8 leading-relaxed">
                Tu veux mieux présenter ton activité, créer du contenu utile ou former ton équipe ? On commence par comprendre ton besoin.
              </p>
              <span className="inline-flex items-center text-xs md:text-sm font-black uppercase tracking-widest border-b-2 border-on-primary-fixed pb-1 group-hover:translate-x-1 transition-transform">
                Découvrir mon parcours →
              </span>
            </div>
          </Link>
        </section>

        {/* Academy — troisième pilier commercial */}
        <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-8">
                <span className="text-[0.65rem] font-bold tracking-[0.3em] uppercase block mb-5">
                  Service 03 · LOLLY Academy
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.92] max-w-4xl">
                  Ta communication doit produire des résultats, pas seulement du contenu.
                </h2>
              </div>
              <div className="lg:col-span-4">
                <p className="text-base md:text-lg leading-relaxed mb-7">
                  Des formations pratiques pour clarifier ton message, mieux produire et transformer tes actions digitales en activité durable.
                </p>
                <Link href="/academy" className="inline-flex items-center bg-on-surface text-primary-fixed px-8 py-4 font-black uppercase text-xs tracking-[0.18em] hover:bg-on-surface/85 transition-colors">
                  Découvrir Academy →
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 border-y-2 border-on-primary-fixed/25">
              {academyOffers.map((offer, index) => (
                <Link key={offer.label} href="/academy#offres" className="group py-6 md:px-7 first:pl-0 border-b md:border-b-0 md:border-r last:border-0 border-on-primary-fixed/25">
                  <span className="text-[0.6rem] font-black tracking-[0.2em] uppercase opacity-60">0{index + 1} · {offer.detail}</span>
                  <h3 className="mt-2 text-xl md:text-2xl font-black uppercase tracking-tight group-hover:translate-x-1 transition-transform">{offer.label}</h3>
                  <p className="mt-2 text-sm font-bold">{offer.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Repères de parcours */}
        <section className="bg-primary-fixed text-on-primary-fixed py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { k: "01", v: "Comprendre votre besoin" },
              { k: "02", v: "Choisir la bonne réponse" },
              { k: "03", v: "Produire ou apprendre" },
              { k: "04", v: "Suivre les résultats" },
            ].map((s) => (
              <div key={s.k} className="border-l-2 border-on-primary-fixed/30 pl-4">
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
