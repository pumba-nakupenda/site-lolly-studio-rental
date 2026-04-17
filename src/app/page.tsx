import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from("homepage_blocks").select("*").order("id");

  const studio = data?.find((b) => b.id === "studio");
  const rental = data?.find((b) => b.id === "rental");

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
                <span className="text-primary-fixed">L&apos;équipement qui tourne.</span>
              </h1>
            </div>
            <p className="md:max-w-sm text-sm md:text-base text-surface-variant leading-relaxed">
              Conseil en communication d&apos;élite & location de matériel
              audiovisuel premium pour les créateurs d&apos;Afrique de
              l&apos;Ouest. Une maison, deux expertises.
            </p>
          </div>
        </section>

        {/* Split hero — STUDIO / RENTAL avec expansion au survol */}
        <section className="flex flex-col md:flex-row min-h-[calc(100vh-260px)] w-full">
          {/* Studio Block */}
          {studio && (
            <Link
              href={studio.link}
              className="relative flex-1 md:hover:flex-[1.6] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1)] group overflow-hidden bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline/10"
            >
              {studio.image && (
                <div
                  className="absolute inset-0 opacity-30 group-hover:opacity-55 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${studio.image}')` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent" />
              <div className="relative h-full flex flex-col justify-between p-10 md:p-16 z-10">
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
                  <h2 className="text-6xl md:text-[7.5rem] font-black tracking-tighter text-on-surface mb-5 leading-[0.9]">
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
              className="relative flex-1 md:hover:flex-[1.6] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.9,0.3,1)] group overflow-hidden bg-on-surface"
            >
              {rental.image && (
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-65 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${rental.image}')` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/70 to-transparent" />
              <div className="relative h-full flex flex-col justify-between p-10 md:p-16 z-10">
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
                  <h2 className="text-6xl md:text-[7.5rem] font-black tracking-tighter text-white mb-5 leading-[0.9]">
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
        </section>

        {/* Chiffres clés */}
        <section className="bg-primary-fixed text-on-primary-fixed py-10 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { k: "12 ans", v: "d'expérience" },
              { k: "150+", v: "projets livrés" },
              { k: "40+", v: "clients actifs" },
              { k: "Dakar", v: "· Afrique de l'Ouest" },
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
    </>
  );
}
