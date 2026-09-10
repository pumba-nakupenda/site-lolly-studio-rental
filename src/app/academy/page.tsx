import Link from 'next/link';
import OfferCard from './_components/OfferCard';
import FeaturedOfferCard from './_components/FeaturedOfferCard';
import HeroCTAs from './_components/HeroCTAs';
import { OFFERS, WORKSHOPS, CONTACT, conseilWhatsappUrl } from './_lib/offers';
import { ConseilCTA } from './_components/ConseilCTA';

export const metadata = {
  title: 'LOLLY Academy — Formations en communication digitale à Dakar',
  description:
    'Formation intensive de 5 jours, accompagnement de 3 à 5 mois et ateliers pratiques en communication digitale à Dakar.',
};

export default function AcademyHome() {
  const featured = OFFERS.find((o) => o.featured) || OFFERS[0];
  const others = OFFERS.filter((o) => !o.featured);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────── */}
      <section className="px-6 md:px-12 pt-12 pb-12 md:pt-20 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">
            <span className="lolly-wordmark">LOLLY</span> Academy · Dakar
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface max-w-5xl leading-[1.05]">
            Apprendre. Appliquer. Faire avancer son activité.
          </h1>

          <p className="mt-6 text-base md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Des formations en communication digitale conçues pour travailler sur ton activité, produire pendant la session et repartir avec une prochaine action claire.
          </p>

          <HeroCTAs />
        </div>
      </section>

      {/* ── Trois offres lisibles ───────────────────────── */}
      <section id="offres" className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <FeaturedOfferCard offer={featured} />

          <div className="mt-12 md:mt-16">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-6">
              Deux autres façons d’avancer
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {others.map((offer) => (
                <OfferCard key={offer.slug} offer={offer} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-on-surface text-white px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 mb-10">
            <div className="lg:col-span-7">
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-4">Ateliers LOLLY · 25 000 XOF / personne</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Choisis le sujet qui te bloque aujourd’hui.</h2>
            </div>
            <p className="lg:col-span-5 text-sm md:text-base text-white/70 leading-relaxed lg:pt-8">Chaque atelier part d’un cas concret. Pas de cours générique : tu viens avec ton activité et tu repars avec un contenu, un outil ou une méthode déjà travaillé.</p>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/15 border border-white/15">
            {WORKSHOPS.map((workshop, index) => (
              <li key={workshop.title} className="bg-on-surface p-6 md:p-7">
                <span className="text-xs font-black text-primary-fixed">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-base font-black uppercase tracking-tight">{workshop.title}</h3>
                <p className="mt-3 text-sm text-white/65 leading-relaxed">{workshop.description}</p>
              </li>
            ))}
          </ol>
          <Link href="/academy/ateliers" className="mt-8 inline-flex bg-primary-fixed text-on-primary-fixed px-7 py-4 font-black uppercase text-xs tracking-[0.18em] hover:bg-primary-fixed-dim transition-colors">Voir les Ateliers LOLLY →</Link>
        </div>
      </section>

      {/* ── Mini diagnostic ─────────────────────────────── */}
      <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] font-bold mb-4">
              Diagnostic 2 minutes
            </p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              Quelle formule correspond à ton besoin&nbsp;?
            </h2>
            <p className="mt-4 text-base md:text-lg">
              Réponds à 4 questions. Nous te recommandons une formule selon ton objectif, ton rythme et le niveau de suivi souhaité.
            </p>
          </div>
          <div className="md:col-span-4 md:text-right">
            <Link
              href="/academy/diagnostic"
              className="inline-flex items-center gap-2 bg-on-surface text-surface px-8 py-4 font-black uppercase text-xs tracking-[0.18em] hover:bg-on-surface/80 transition-colors"
            >
              Faire le diagnostic →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Conseil 30 min ──────────────────────────────── */}
      <ConseilCTA whatsappUrl={conseilWhatsappUrl(null)} calendlyUrl={CONTACT.calendly} />
    </>
  );
}
