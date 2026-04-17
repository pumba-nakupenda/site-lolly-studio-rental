import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "À Propos | LOLLY Agence",
  description:
    "Découvrez l'histoire de LOLLY, une agence fondée sur l'excellence et l'innovation. Notre mission : bâtir l'élite créative du continent.",
};

const values = [
  {
    title: "Excellence",
    desc: "La médiocrité est notre seule ennemie. Nous visons le parfait équilibre.",
  },
  {
    title: "Innovation IA",
    desc: "Pionniers au Sénégal dans l'intégration de l'IA pour décupler votre valeur.",
  },
  {
    title: "Transmission",
    desc: "Nous ne gardons pas nos secrets. Notre réussite est votre autonomie totale.",
  },
  {
    title: "Partenariat Pro",
    desc: "Nous vivons vos enjeux comme si nous étions membres de votre équipe.",
  },
  {
    title: "Culture Locale",
    desc: "Maîtrise intime des codes du marché sénégalais couplée à une vision globale.",
  },
  {
    title: "Agilité Totale",
    desc: "L'intelligence du mouvement pour s'adapter à vos besoins changeants.",
  },
];

const ecosystem = [
  {
    badge: "Core Competence",
    title: "Conseil Stratégique High-End",
    desc: "Nous auditons vos structures de communication pour y injecter de l'intelligence et de la performance durable.",
    tags: ["Communication de Crise", "Branding Architecture", "Digital Transformation"],
  },
  {
    badge: "",
    title: "Lolly Academy",
    desc: "Nos modules de formation pour monter vos équipes en compétence et garantir l'autonomie.",
    tags: ["Marketing Digital", "Outils IA", "Prise de parole"],
  },
  {
    badge: "",
    title: "Lolly Studio",
    desc: "Production 4K, Motion Design et Photographie Corporate de standard international.",
    tags: ["Film Corporate", "Motion Design", "Photographie"],
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="px-6 md:px-12 pt-24 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-end">
            <div className="col-span-12 md:col-span-7">
              <span className="text-[0.75rem] uppercase tracking-[0.2em] text-secondary mb-4 block">
                Notre ADN
              </span>
              <h1 className="text-[3.5rem] md:text-[5.5rem] font-black leading-[0.9] tracking-[-0.04em] uppercase mb-8">
                Plus qu&apos;une agence,
                <br />
                <span className="text-primary-fixed-dim">partenaire</span>
                <br />
                d&apos;exception.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-lg text-secondary leading-relaxed border-l border-outline-variant pl-8 py-2">
                Nous croyons au pouvoir des idées qui bousculent le statu quo et
                aux images qui impriment une vision durable.
              </p>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="bg-surface-container-lowest py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-16 items-center">
            <div className="col-span-12 md:col-span-5">
              <img
                className="w-full aspect-[3/4] object-cover grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzTY6QurhWPMM8U4yzIRuPUzF59WrHEmD-XLF-dM6yOxmI33fQkrAdUXE5A8JpHd4HD1hHLXCB0DbkIGS4YaF0sxGlvncKtfodfWbWhi3mw0w0aVodXhHjXww0wTIGpRwWQG-txpOIDAwuRcUzBYJ7gRR5mglsdGMLtJG44QKXpjvEQAm98dzT1DDeJaNQxoJ6UAP5HICpnKClDhKWD_zvt4JwQGXDHBc2Y9owjgB_tE2UwGbkTpXmpqLJ9jnsbmQXIcpIFa6aB80"
                alt="Espace LOLLY"
              />
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-6 block">
                Genèse &amp; Vision
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
                Notre Odyssée
              </h2>
              <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
                <div>
                  <h3 className="font-bold text-on-surface mb-2">L&apos;Origine</h3>
                  <p>
                    Née d&apos;une vision audacieuse en plein cœur de Dakar, LOLLY
                    est l&apos;histoire d&apos;un engagement : transformer des idées en
                    messages puissants. Fondée par Amadou Mbaye GUEYE, nous
                    portons la conviction que la communication africaine mérite
                    une excellence sans compromis.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface mb-2">L&apos;Évolution</h3>
                  <p>
                    Aujourd&apos;hui, nous nous positionnons comme une pure agence de
                    conseil. Nous structurons la communication des entreprises
                    pour en faire un levier de croissance durable, soutenue par
                    nos pôles de production et de formation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 md:px-12 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">
                Notre Croyance
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase max-w-3xl">
                Plus qu&apos;un slogan, c&apos;est notre boussole.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-outline-variant/15">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-12 border-r border-b border-outline-variant/15 group hover:bg-primary-container transition-colors duration-500"
                >
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-on-primary-container">
                    {v.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant group-hover:text-on-primary-container leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="bg-on-surface text-white py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-16 items-center">
            <div className="col-span-12 md:col-span-5">
              <div className="aspect-square bg-surface/10 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[8rem] font-black text-primary-fixed leading-none block">
                    AG
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
                Amadou Mbaye GUEYE
              </h3>
              <p className="text-primary-fixed text-sm uppercase tracking-widest mb-8">
                Founder &amp; Chief Visionary
              </p>
              <blockquote className="text-2xl font-light text-surface-dim leading-relaxed mb-8 border-l-2 border-primary-fixed pl-8">
                &ldquo;Notre héritage sera l&apos;autonomie des talents que nous
                formons.&rdquo;
              </blockquote>
              <p className="text-surface-dim leading-relaxed">
                Amadou Mbaye GUEYE incarne l&apos;alliance rare entre une
                créativité organique et une maîtrise technique pointue en
                automatisation et IA.
              </p>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">
                Notre Écosystème
              </span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">
                Capacités Intégrales
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {ecosystem.map((e, idx) => (
                <div
                  key={e.title}
                  className={`p-10 border border-outline-variant/15 hover:border-primary-fixed transition-colors ${
                    idx === 0 ? "md:col-span-7" : "md:col-span-5"
                  } ${idx === 2 ? "md:col-span-12" : ""}`}
                >
                  {e.badge && (
                    <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] font-black uppercase px-3 py-1 tracking-tighter mb-6">
                      {e.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-4">{e.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                    {e.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {e.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-surface-container text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision 2030 CTA */}
        <section className="bg-primary-fixed py-32 px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-on-primary-fixed/60 mb-4 block">
              Horizon 2030
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-on-primary-fixed mb-8 leading-tight">
              Bâtir l&apos;élite créative du continent.
            </h2>
            <p className="text-lg text-on-primary-fixed/80 mb-12 max-w-2xl mx-auto">
              Notre ambition est claire : devenir la référence absolue de la
              communication et du marketing digital en Afrique de l&apos;Ouest
              d&apos;ici 5 ans.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-on-surface text-surface font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-on-surface/80 transition-all"
            >
              Rejoignez le mouvement
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
