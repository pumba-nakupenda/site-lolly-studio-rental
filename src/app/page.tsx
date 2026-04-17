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
        <section className="min-h-[calc(100vh-100px)] grid grid-cols-1 md:grid-cols-12 w-full">
          {/* Studio Block — 7 cols */}
          {studio && (
            <Link
              href={studio.link}
              className="relative md:col-span-7 group overflow-hidden bg-surface-container-lowest border-r border-outline/10"
            >
              {studio.image && (
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${studio.image}')` }}
                />
              )}
              <div className="relative h-full flex flex-col justify-end p-12 md:p-20 z-10">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-on-surface-variant mb-4">
                  {studio.label}
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-on-surface mb-6 leading-none">
                  {studio.title}
                </h2>
                <p className="text-lg max-w-sm text-secondary mb-12 leading-relaxed">
                  {studio.description}
                </p>
                <span className="inline-flex items-center">
                  <span className="text-sm font-black uppercase tracking-widest border-b-2 border-primary-fixed pb-1">
                    {studio.cta_text}
                  </span>
                  <span className="material-symbols-outlined ml-4 group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          )}

          {/* Rental Block — 5 cols */}
          {rental && (
            <Link
              href={rental.link}
              className="relative md:col-span-5 group overflow-hidden bg-on-surface"
            >
              {rental.image && (
                <div
                  className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${rental.image}')` }}
                />
              )}
              <div className="relative h-full flex flex-col justify-end p-12 md:p-20 z-10">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-surface-variant mb-4">
                  {rental.label}
                </span>
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
                  {rental.title}
                </h2>
                <p className="text-lg max-w-sm text-surface-dim mb-12 leading-relaxed">
                  {rental.description}
                </p>
                <span className="inline-flex items-center">
                  <span className="text-sm font-black uppercase tracking-widest border-b-2 border-primary-fixed text-white pb-1">
                    {rental.cta_text}
                  </span>
                  <span className="material-symbols-outlined ml-4 text-white group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          )}
        </section>
      </main>
    </>
  );
}
