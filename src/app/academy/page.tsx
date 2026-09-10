import Link from 'next/link';
import OfferCard from './_components/OfferCard';
import FeaturedOfferCard from './_components/FeaturedOfferCard';
import HeroCTAs from './_components/HeroCTAs';
import { OFFERS, WORKSHOPS, CONTACT, conseilWhatsappUrl, offerPriceLabel } from './_lib/offers';
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
      {/* ── Hero éditorial ──────────────────────────────── */}
      <section className="bg-on-surface text-white px-6 md:px-12 py-14 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-7">
              <span className="lolly-wordmark">LOLLY</span> Academy · Dakar
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.92]">
              Apprendre.<br /><span className="text-primary-fixed">Appliquer.</span><br />Progresser.
            </h1>
            <p className="mt-7 text-base md:text-xl text-white/70 max-w-2xl leading-relaxed">
              Avant de te proposer une formation, nous cherchons à comprendre ton activité. Commence par le diagnostic ou échange directement avec l’équipe LOLLY.
            </p>
            <HeroCTAs inverse />
          </div>
          <aside className="lg:col-span-4 border-t-2 lg:border-t-0 lg:border-l-2 border-primary-fixed pt-7 lg:pt-0 lg:pl-8" aria-label="Les trois formats Academy">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-6">Trois formats. Un objectif : avancer.</p>
            <ol className="grid gap-5">
              {OFFERS.map((offer, index) => (
                <li key={offer.slug} className="grid grid-cols-[auto_1fr] gap-4 items-start">
                  <span className="text-xs font-black text-primary-fixed">0{index + 1}</span>
                  <div><p className="font-black uppercase tracking-tight">{offer.name}</p><p className="mt-1 text-sm text-white/55">{offer.eyebrow} · {offerPriceLabel(offer)}</p></div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ── Conseil d'abord ────────────────────────────── */}
      <ConseilCTA whatsappUrl={conseilWhatsappUrl(null)} calendlyUrl={CONTACT.calendly} />

      {/* ── Masterclass hebdomadaires ──────────────────── */}
      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-4">
              Tous les samedis · Gratuit
            </p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Les Masterclass de <span className="lolly-wordmark">LOLLY</span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              Un rendez-vous gratuit chaque samedi pour comprendre un sujet utile, poser tes questions et repartir avec une action concrète pour ton business.
            </p>
            <Link href="/academy/inscription?offre=masterclass" className="mt-8 inline-flex bg-on-surface text-primary-fixed px-8 py-4 font-black uppercase text-xs tracking-[0.18em] hover:bg-on-surface/85 transition-colors">
              Réserver ma place gratuite →
            </Link>
            <p className="mt-3 text-xs text-secondary">Inscription enregistrée directement sur le site · aucun paiement</p>
          </div>
          <aside className="lg:col-span-5 bg-primary-fixed text-on-primary-fixed p-7 md:p-10" aria-label="Fonctionnement des Masterclass de LOLLY">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] font-bold mb-6">Le rendez-vous du samedi</p>
            <ol className="grid gap-5">
              {[
                ['01', 'Un thème concret', 'Contenu, visibilité, présentation ou vente.'],
                ['02', 'Une méthode claire', 'Des explications accessibles et des exemples utiles.'],
                ['03', 'Une prochaine action', 'Tu sais quoi tester dès la semaine suivante.'],
              ].map(([number, title, text]) => (
                <li key={number} className="grid grid-cols-[auto_1fr] gap-4 border-t border-on-primary-fixed/25 pt-4">
                  <span className="text-xs font-black">{number}</span>
                  <div><h3 className="font-black uppercase tracking-tight">{title}</h3><p className="mt-1 text-sm leading-relaxed">{text}</p></div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* ── Méthode ────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-14 md:py-20 border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 mb-10">
            <div className="md:col-span-5"><p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-3">La méthode LOLLY</p><h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Moins de théorie. Plus de décisions.</h2></div>
            <p className="md:col-span-5 md:col-start-8 text-base text-on-surface-variant leading-relaxed md:pt-7">Chaque parcours relie la communication à ce qui fait vivre l’activité : attirer, convaincre, relancer et fidéliser.</p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/30 border border-outline-variant/30">
            {[
              ['01', 'Clarifier', 'Le bon objectif, le bon public et le message qui mérite d’être retenu.'],
              ['02', 'Produire', 'Des exercices appliqués à ton activité, corrigés pendant le parcours.'],
              ['03', 'Continuer', 'Une méthode, des outils et une prochaine action clairement définie.'],
            ].map(([number, title, text]) => (
              <li key={number} className="bg-surface p-7 md:p-9"><span className="text-sm font-black text-primary">{number}</span><h3 className="mt-5 text-xl font-black uppercase tracking-tight">{title}</h3><p className="mt-3 text-sm text-on-surface-variant leading-relaxed">{text}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Trois offres lisibles ───────────────────────── */}
      <section id="offres" className="px-6 md:px-12 py-16 md:py-24">
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
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-4">Chaque mois · 25 000 XOF / personne</p>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Les ateliers de formation LOLLY.</h2>
            </div>
            <p className="lg:col-span-5 text-sm md:text-base text-white/70 leading-relaxed lg:pt-8">Chaque mois, nous travaillons une compétence précise. Tu viens avec ton activité et tu repars avec un contenu, une présentation, un outil ou une méthode déjà travaillé.</p>
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
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/academy/inscription?offre=ateliers" className="inline-flex justify-center bg-primary-fixed text-on-primary-fixed px-7 py-4 font-black uppercase text-xs tracking-[0.18em] hover:bg-primary-fixed-dim transition-colors">Choisir mon atelier →</Link>
            <Link href="/academy/ateliers" className="inline-flex justify-center border-2 border-white text-white px-7 py-4 font-black uppercase text-xs tracking-[0.18em] hover:bg-white hover:text-on-surface transition-colors">Voir tous les thèmes</Link>
          </div>
        </div>
      </section>

      {/* ── CTA final, identique au parcours d’entrée ──── */}
      <section className="px-6 md:px-12 py-14 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-4">Tu hésites encore ?</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Commence par comprendre ton besoin.</h2>
          <p className="mt-4 text-on-surface-variant max-w-2xl mx-auto">Quatre réponses suffisent pour recevoir une recommandation et avancer sans choisir une offre au hasard.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/academy/diagnostic" className="bg-on-surface text-primary-fixed px-8 py-4 font-black uppercase text-xs tracking-[0.18em]">Faire mon diagnostic gratuit →</Link>
            <a href="#conseil" className="border-2 border-on-surface text-on-surface px-8 py-4 font-black uppercase text-xs tracking-[0.18em]">Parler à un conseiller</a>
          </div>
        </div>
      </section>
    </>
  );
}
