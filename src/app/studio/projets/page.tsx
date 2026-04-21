import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import FilterableGrid from "@/components/FilterableGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio | LOLLY Agence — Nos Réalisations",
  description:
    "Découvrez l'impact de LOLLY Agency à travers nos projets en branding, stratégie digitale et production audiovisuelle au Sénégal.",
};

const fallbackSpan: Record<number, { span: string; ratio: string }> = {
  0: { span: "md:col-span-7", ratio: "aspect-[3/4]" },
  1: { span: "md:col-span-5", ratio: "aspect-square" },
};

export default async function ProjetsPage() {
  const supabase = await createClient();
  const [{ data: projects }, { data: categoriesData }] = await Promise.all([
    supabase.from("portfolio").select("*").order("grid_order"),
    supabase.from("portfolio_categories").select("name").order("order_id"),
  ]);

  const categories = ["Tout", ...(categoriesData ?? []).map((c: { name: string }) => c.name)];

  const items = projects ?? [];

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Header */}
        <section className="px-6 md:px-12 pt-12 pb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-baseline gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                Réalisations
              </h1>
            </div>
            <p className="text-sm text-secondary max-w-sm">
              Chaque projet est une preuve de notre engagement à bousculer les
              codes.
            </p>
          </div>
        </section>

        {/* Filtres + Grille */}
        <section className="px-4 md:px-6 pb-24">
          <div className="max-w-7xl mx-auto md:px-2">
            <FilterableGrid
              categories={categories}
              items={items.map((p) => ({ category: p.category }))}
              className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[18rem] gap-3"
            >
              {items.map((p, index) => {
                const layout = {
                  span: p.grid_span || fallbackSpan[index % 2]?.span || "md:col-span-6",
                  ratio: p.grid_ratio || fallbackSpan[index % 2]?.ratio || "aspect-square",
                };
                return (
                  <Link
                    key={p.slug}
                    href={`/studio/projets/${p.slug}`}
                    className={`${layout.span} ${layout.ratio} md:aspect-auto md:h-full group relative overflow-hidden bg-surface-container-lowest`}
                  >
                    {p.main_image ? (
                      <Image
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        src={p.main_image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                        priority={index < 2}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-2xl font-black text-outline-variant/20">{p.title?.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/70 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-1 block">
                          {p.category}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">
                          {p.title}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-surface-dim">{p.client}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </FilterableGrid>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-on-surface text-white px-6 md:px-12 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
              Votre futur succès commence ici.
            </h2>
            <p className="text-lg text-surface-dim mb-10">
              Prêt à bousculer votre industrie avec une identité forte ?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary-fixed text-on-primary-fixed font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-primary-fixed-dim transition-all"
              >
                Parlons de votre projet
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
