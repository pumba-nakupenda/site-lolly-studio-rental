import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import AddToCartButton from "@/components/AddToCartButton";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase.from("rental_equipment").select("slug");
  return (data ?? []).filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("rental_equipment").select("name, brand, description").eq("slug", slug).single();
  if (!data) return { title: "Équipement introuvable" };
  return {
    title: `${data.brand} ${data.name} | LOLLY Rental`,
    description: data.description || `Location ${data.brand} ${data.name} à Dakar.`,
  };
}

export default async function EquipmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: equipment } = await supabase
    .from("rental_equipment")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!equipment) notFound();

  const specs = (equipment.specs || {}) as Record<string, string>;
  const gallery = (equipment.gallery || []) as string[];
  const included = (equipment.included || []) as string[];

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Header — 7/5 */}
        <section className="px-6 md:px-12 pt-12 pb-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Image — 7 cols */}
            <div className="md:col-span-7">
              <div className="aspect-square bg-[#f0f0f0] overflow-hidden">
                {equipment.image ? (
                  <img src={equipment.image} alt={equipment.name} className="w-full h-full object-contain p-8" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-outline-variant/30">videocam</span>
                  </div>
                )}
              </div>
              {/* Gallery thumbnails */}
              {gallery.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {gallery.map((img, i) => (
                    <div key={i} className="aspect-square bg-[#f0f0f0] overflow-hidden">
                      <img src={img} alt={`${equipment.name} — ${i + 1}`} className="w-full h-full object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info — 5 cols */}
            <div className="md:col-span-5">
              <Link href="/rental" className="text-[0.6rem] uppercase tracking-widest text-secondary hover:text-primary transition-colors mb-4 block">
                ← Retour au catalogue
              </Link>
              <span className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">
                {equipment.brand}
              </span>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                {equipment.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <p className="text-2xl font-black text-primary tracking-tighter">
                  {equipment.price_label}
                </p>
                <span className={`text-[0.6rem] font-black uppercase px-2 py-1 ${
                  equipment.status === "disponible" ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-dim text-on-surface"
                }`}>
                  {equipment.status === "disponible" ? "Disponible" : equipment.status === "en_tournage" ? "En tournage" : "Maintenance"}
                </span>
              </div>

              {equipment.description && (
                <p className="text-sm text-on-surface-variant leading-relaxed mb-8">{equipment.description}</p>
              )}

              {/* CTA */}
              <div className="mb-8">
                <AddToCartButton
                  id={equipment.id}
                  name={equipment.name}
                  brand={equipment.brand}
                  price_label={equipment.price_label}
                  available={equipment.status === "disponible"}
                />
              </div>

              <a
                href={`https://wa.me/+221772354747?text=${encodeURIComponent(`Bonjour LOLLY, je souhaiterais louer le ${equipment.brand} ${equipment.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-on-surface text-on-surface font-bold uppercase py-3 text-xs tracking-widest text-center block hover:bg-on-surface hover:text-surface transition-all"
              >
                Ou via WhatsApp
              </a>

              {/* Specs */}
              {Object.keys(specs).length > 0 && (
                <div className="mt-10 border-t border-outline-variant/15 pt-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Spécifications</h3>
                  <div className="space-y-3">
                    {Object.entries(specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-baseline border-b border-outline-variant/10 pb-2">
                        <span className="text-xs text-secondary">{key}</span>
                        <span className="text-sm font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Included */}
              {included.length > 0 && (
                <div className="mt-8 border-t border-outline-variant/15 pt-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Inclus dans la location</h3>
                  <div className="flex flex-wrap gap-2">
                    {included.map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-surface-container text-xs font-bold text-on-surface-variant">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
