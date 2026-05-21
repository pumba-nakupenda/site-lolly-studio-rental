import Link from 'next/link';
import OfferCard from './_components/OfferCard';
import FeaturedOfferCard from './_components/FeaturedOfferCard';
import HeroCTAs from './_components/HeroCTAs';
import { OFFERS, CONTACT, conseilWhatsappUrl } from './_lib/offers';
import { ConseilCTA } from './_components/ConseilCTA';

export const metadata = {
  title: 'LOLLY Academy — Quel est ton défi de communication aujourd’hui ?',
  description:
    '4 chemins pour faire bouger ta com. FONDATIONS, REPRISE EN MAIN, PILOTAGE, POSTURE. Choisis celui qui te ressemble.',
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
            <span className="lolly-wordmark">LOLLY</span> Academy · Cohorte 1 · 15 juin 2026
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface max-w-5xl leading-[1.05]">
            Quel est ton défi de communication aujourd’hui&nbsp;?
          </h1>

          <p className="mt-6 text-base md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            4 chemins pour faire bouger ta com. Pas sûr de ton profil&nbsp;? Lance le diagnostic, on t’oriente en 2 minutes.
          </p>

          <HeroCTAs />
        </div>
      </section>

      {/* ── Offre vedette FONDATIONS + 3 autres ───────── */}
      <section id="offres" className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <FeaturedOfferCard offer={featured} />

          <div className="mt-12 md:mt-16">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-6">
              Tu es plus avancé ? Trois autres parcours
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {others.map((offer) => (
                <OfferCard key={offer.slug} offer={offer} />
              ))}
            </div>
          </div>
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
              Tu hésites entre deux profils&nbsp;?
            </h2>
            <p className="mt-4 text-base md:text-lg">
              Réponds à 5 questions en 2 minutes. Tu sauras exactement où tu en es et quelle offre te correspond.
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
