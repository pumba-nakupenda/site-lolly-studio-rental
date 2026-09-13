import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "À Propos | LOLLY Agence",
  description:
    "Découvrez comment LOLLY relie conseil, production, formation et location pour accompagner les entreprises et les créateurs à Dakar.",
};

const values = [
  {
    title: "Excellence",
    desc: "Nous soignons le fond, la forme et les détails qui comptent pour votre public.",
  },
  {
    title: "Outils utiles",
    desc: "Nous choisissons les méthodes et les outils qui servent réellement l'objectif.",
  },
  {
    title: "Transmission",
    desc: "Nous expliquons nos choix et transmettons des méthodes que votre équipe peut reprendre.",
  },
  {
    title: "Partenariat Pro",
    desc: "Nous prenons le temps de comprendre l'activité avant de proposer une solution.",
  },
  {
    title: "Culture Locale",
    desc: "Nos recommandations tiennent compte des usages et des réalités du marché sénégalais.",
  },
  {
    title: "Agilité Totale",
    desc: "Nous ajustons le travail selon les retours, les contraintes et les résultats observés.",
  },
];

const ecosystem = [
  {
    badge: "Point de départ",
    title: "Conseil en communication",
    desc: "Nous clarifions l'objectif, le public et le message avant de choisir les supports.",
    tags: ["Diagnostic", "Stratégie", "Message"],
  },
  {
    badge: "",
    title: "LOLLY Academy",
    desc: "Masterclass, ateliers et parcours pratiques pour apprendre à communiquer avec méthode.",
    tags: ["Masterclass", "Ateliers", "Formation"],
  },
  {
    badge: "",
    title: "LOLLY Studio",
    desc: "Nous produisons les images, vidéos et contenus nécessaires à votre communication.",
    tags: ["Vidéo", "Design", "Photographie"],
  },
  {
    badge: "",
    title: "LOLLY Production",
    desc: "Espaces et matériel audiovisuel pour vos tournages, événements et formations.",
    tags: ["Studios", "Salles", "Matériel"],
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="px-6 md:px-12 pt-14 pb-20 md:pt-24 md:pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-end">
            <div className="md:col-span-7">
              <span className="text-[0.75rem] uppercase tracking-[0.2em] text-secondary mb-4 block">
                Notre ADN
              </span>
              <h1 className="text-[1.85rem] md:text-[5.5rem] font-black leading-[1] md:leading-[0.9] tracking-[-0.02em] md:tracking-[-0.04em] uppercase mb-8">
                Une équipe pour penser, produire et transmettre.
              </h1>
            </div>
            <div className="md:col-span-5">
              <p className="text-base md:text-lg text-secondary leading-relaxed border-l border-outline-variant pl-6 md:pl-8 py-2">
                Nous relions le conseil, le studio, la formation et les moyens
                de production pour répondre au besoin réel de chaque projet.
              </p>
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="bg-surface-container-lowest py-20 md:py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  className="object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzTY6QurhWPMM8U4yzIRuPUzF59WrHEmD-XLF-dM6yOxmI33fQkrAdUXE5A8JpHd4HD1hHLXCB0DbkIGS4YaF0sxGlvncKtfodfWbWhi3mw0w0aVodXhHjXww0wTIGpRwWQG-txpOIDAwuRcUzBYJ7gRR5mglsdGMLtJG44QKXpjvEQAm98dzT1DDeJaNQxoJ6UAP5HICpnKClDhKWD_zvt4JwQGXDHBc2Y9owjgB_tE2UwGbkTpXmpqLJ9jnsbmQXIcpIFa6aB80"
                  alt="Espace LOLLY"
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-6 block">
                Genèse &amp; Vision
              </span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-tight">
                Notre parcours
              </h2>
              <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
                <div>
                  <h3 className="font-bold text-on-surface mb-2">L&apos;Origine</h3>
                  <p>
                    Fondée à Dakar par Amadou Mbaye GUEYE, LOLLY aide les
                    entreprises à rendre leur communication plus claire et plus
                    utile à leur activité.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface mb-2">L&apos;Évolution</h3>
                  <p>
                    Le conseil reste notre point de départ. Le studio, Academy
                    et Production permettent ensuite de produire, de transmettre
                    et de disposer des bons moyens au bon moment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-20">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">
                Notre Croyance
              </span>
              <h2 className="text-3xl md:text-6xl font-bold tracking-tight uppercase max-w-3xl leading-tight">
                Plus qu&apos;un slogan, c&apos;est notre boussole.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-outline-variant/15">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="p-6 md:p-12 border-r border-b border-outline-variant/15 group hover:bg-primary-container transition-colors duration-500"
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 group-hover:text-on-primary-container">
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
        <section className="bg-on-surface text-white py-20 md:py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5">
              <div className="aspect-square bg-surface/10 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-[5rem] md:text-[8rem] font-black text-primary-fixed leading-none block">
                    AG
                  </span>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
                Amadou Mbaye GUEYE
              </h3>
              <p className="text-primary-fixed text-sm uppercase tracking-widest mb-8">
                Fondateur de LOLLY
              </p>
              <p className="text-xl md:text-2xl text-surface-dim leading-relaxed border-l-2 border-primary-fixed pl-6 md:pl-8">
                Un projet commence par une conversation : comprendre l&apos;activité,
                définir ce qui doit changer, puis choisir comment avancer.
              </p>
            </div>
          </div>
        </section>

        {/* Ecosystem */}
        <section className="py-20 md:py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-20">
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">
                Notre Écosystème
              </span>
              <h2 className="text-3xl md:text-6xl font-bold tracking-tight uppercase leading-tight">
                Quatre façons de vous accompagner
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {ecosystem.map((e) => (
                <div
                  key={e.title}
                  className="md:col-span-6 p-6 md:p-10 border border-outline-variant/15 hover:border-primary-fixed transition-colors"
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

        {/* Orientation finale */}
        <section className="bg-primary-fixed py-20 md:py-32 px-6 md:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-on-primary-fixed/60 mb-4 block">
              Un point de départ simple
            </span>
            <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-on-primary-fixed mb-8 leading-tight">
              Parlons de ce dont vous avez besoin.
            </h2>
            <p className="text-lg text-on-primary-fixed/80 mb-12 max-w-2xl mx-auto">
              Un projet à lancer ou une compétence à développer ? Nous vous
              aiderons à choisir la prochaine étape utile.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-on-surface text-surface font-black uppercase px-12 py-5 text-sm tracking-widest hover:bg-on-surface/80 transition-all"
            >
              Parler de mon projet
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
