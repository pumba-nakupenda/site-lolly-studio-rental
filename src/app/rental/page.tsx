import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import FilterableGrid from "@/components/FilterableGrid";
import AddToCartButton from "@/components/AddToCartButton";
import BookingForm from "@/components/BookingForm";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Rental | LOLLY — Location Matériel & Studio Shooting",
  description:
    "Location d'équipement cinéma premium et studio shooting à Dakar. ARRI, RED, Cooke, Aputure, DJI. Plateaux photo et vidéo équipés.",
};

const categories = [
  "Tout",
  "Cinéma Digital",
  "Optiques",
  "Éclairage",
  "Stabilisation",
  "Audio",
];

export default async function RentalPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("rental_equipment")
    .select("*")
    .order("order_id");
  const { data: studios } = await supabase
    .from("studio_spaces")
    .select("*")
    .order("order_id");
  const studioList = studios ?? [];

  return (
    <>
      <Navbar />
      <main id="main-content" className="overflow-x-hidden">
        {/* Hero — 7/5 golden ratio */}
        <section className="px-6 md:px-12 pt-12 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <span className="text-[0.75rem] uppercase tracking-[0.2em] text-secondary mb-4 block">
                Location Matériel &amp; Studio
              </span>
              <h1 className="text-[2.5rem] md:text-[5.5rem] font-black leading-[0.9] tracking-[-0.04em] uppercase mb-8">
                Équipez.
                <br />
                <span className="text-primary-fixed-dim">Tournez.</span>
              </h1>
            </div>
            <div className="md:col-span-5 flex items-end">
              <p className="text-lg text-secondary leading-relaxed md:border-l md:border-outline-variant md:pl-8 py-2">
                Matériel de production cinéma premium et studios de shooting
                entièrement équipés. De la caméra au plateau, tout est prêt pour
                votre production.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ STUDIOS SHOOTING ═══ */}
        {studioList.length > 0 && (
          <section className="bg-on-surface text-white px-6 md:px-12 py-24">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">
                  Nos Espaces
                </h2>
              </div>

              <div className={`grid grid-cols-1 gap-4 ${
                studioList.length === 1 ? "max-w-2xl" :
                studioList.length === 2 ? "md:grid-cols-2" :
                "md:grid-cols-3"
              }`}>
                {studioList.map((studio) => (
                  <div key={studio.id} className="bg-white/5 border border-white/10 overflow-hidden group hover:border-primary-fixed/50 transition-colors flex flex-col">
                    {/* Image principale */}
                    <div className="aspect-[16/9] overflow-hidden">
                      {studio.image ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          src={studio.image || undefined}
                          alt={studio.name}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-white/20">meeting_room</span>
                        </div>
                      )}
                    </div>
                    {/* Gallery thumbnails */}
                    {studio.gallery && studio.gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-0.5">
                        {studio.gallery.slice(0, 3).map((img: string, i: number) => (
                          <div key={i} className="aspect-[4/3] overflow-hidden">
                            <img src={img} alt={`${studio.name} — ${i + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Infos */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-base font-bold uppercase tracking-tight">{studio.name}</h3>
                        <p className="text-sm font-black text-primary-fixed tracking-tighter shrink-0 ml-4">
                          {studio.price_label}
                        </p>
                      </div>
                      <p className="text-[0.7rem] text-surface-variant mb-3">
                        {studio.size} — {studio.height}
                      </p>
                      {studio.description && (
                        <p className="text-xs text-surface-dim mb-4 leading-relaxed">{studio.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(studio.features || []).map((f: string) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 bg-white/10 text-[0.55rem] font-bold uppercase tracking-widest text-white/50"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto pt-2">
                      <BookingForm
                        studioName={studio.name}
                        studioPrice={studio.price_label}
                        requestType={studio.name.toLowerCase().includes("formation") ? "training" : "studio_booking"}
                      />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══ LOCATION MATÉRIEL ═══ */}
        <section className="px-6 md:px-12 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 flex flex-col md:flex-row justify-between items-baseline gap-8">
              <div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-4 block">
                  Notre Inventaire
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Location Matériel
                </h2>
              </div>
              <p className="text-sm uppercase tracking-widest text-secondary">
                Cinéma &amp; Production
              </p>
            </div>

            <FilterableGrid
              categories={categories}
              items={(products || []).map((p) => ({ category: p.category }))}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(products || []).map((p) => (
                <div key={p.id} className="group bg-surface-container-lowest">
                  {/* Image — cliquable */}
                  <Link href={p.slug ? `/rental/${p.slug}` : "#"} className="block aspect-square bg-[#f0f0f0] overflow-hidden relative">
                    {p.image ? (
                      <img
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        src={p.image}
                        alt={p.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-outline-variant/30">videocam</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-[0.6rem] font-black uppercase px-2 py-1 ${
                          p.status === "disponible"
                            ? "bg-primary-fixed text-on-primary-fixed"
                            : "bg-on-surface text-surface"
                        }`}
                      >
                        {p.status === "disponible"
                          ? "Dispo"
                          : p.status === "en_tournage"
                          ? "En tournage"
                          : "Maintenance"}
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold">
                      {p.brand}
                    </span>
                    <Link href={p.slug ? `/rental/${p.slug}` : "#"} className="block">
                      <h3 className="text-base font-bold uppercase tracking-tight mt-1 hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-sm font-black tracking-tighter text-primary mt-2">
                      {p.price_label}
                    </p>
                    <div className="mt-4">
                      <AddToCartButton
                        id={p.id}
                        name={p.name}
                        brand={p.brand}
                        price_label={p.price_label}
                        available={p.status === "disponible"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </FilterableGrid>
          </div>
        </section>

        {/* ═══ AVANTAGES — 7/5 ═══ */}
        <section className="bg-surface-container-lowest py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative">
              <div className="absolute -top-12 -left-12 text-[8rem] md:text-[12rem] font-black text-surface opacity-5 select-none pointer-events-none hidden md:block">
                TECH
              </div>
              <img
                className="w-full h-[300px] md:h-[500px] object-cover grayscale brightness-90"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDs5NVs1P2UtHcHHDTX0zS3USG0VjzndbvJhicHQf9RAgvDj4pX2v6miI-757AiyA_uWLpLjqXRyEqKudeq8B2M8OIeA8pUBRoT5K1eZdCKnU0vgL4WSMQM2I__LckSZz0yhOAwbBfepqLWhxsSIf3ALh7v_n1EeadusnWZLVOKMbp29zrm4FY80McEvnMKjqZ-EObblpqTElK7eFx463ukaoQ_0dGsRiESALFzmL33yGB5ZjerOu0iyLBtAz7BqK6SHhDBQlcnJU"
                alt="Studio technique"
              />
            </div>
            <div className="lg:col-span-5">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-8 leading-tight">
                Pourquoi louer chez LOLLY ?
              </h2>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-6 bg-primary-container p-3 shrink-0">
                    <span className="material-symbols-outlined text-on-primary-fixed">verified</span>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm tracking-widest">Matériel Calibré</h4>
                    <p className="text-secondary text-sm">Chaque capteur est cartographié et chaque objectif calibré avant de quitter notre coffre.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-6 bg-primary-container p-3 shrink-0">
                    <span className="material-symbols-outlined text-on-primary-fixed">support_agent</span>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm tracking-widest">Support 24/7</h4>
                    <p className="text-secondary text-sm">Nos ingénieurs sont en veille pour le dépannage critique sur plateau.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-6 bg-primary-container p-3 shrink-0">
                    <span className="material-symbols-outlined text-on-primary-fixed">package_2</span>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-sm tracking-widest">Pack Studio + Matériel</h4>
                    <p className="text-secondary text-sm">Combinez location de studio et matériel pour un tarif préférentiel tout-en-un.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="bg-on-surface text-white px-6 md:px-12 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
              Prêt pour la Production ?
            </h2>
            <p className="text-lg text-surface-dim mb-10">
              Studio ou matériel — soumettez votre liste pour un devis
              personnalisé et des remises multi-jours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/contact"
                className="bg-primary-fixed text-on-primary-fixed font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-primary-fixed-dim transition-all"
              >
                Demander un devis
              </Link>
              <a
                href="https://wa.me/+221772354747?text=Bonjour%20LOLLY%2C%20je%20souhaiterais%20un%20devis%20pour%20de%20la%20location."
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
