import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  OFFERS,
  getOffer,
  reserveWhatsappUrl,
  conseilWhatsappUrl,
  CONTACT,
  fmtPrice,
} from '../_lib/offers';
import { ConseilCTA } from '../_components/ConseilCTA';
import { ReserveButtons } from '../_components/ReserveButtons';

export function generateStaticParams() {
  return OFFERS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return { title: 'Offre introuvable | LOLLY Academy' };
  return {
    title: `${offer.name} — LOLLY Academy`,
    description: offer.cardTitle,
  };
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();

  return (
    <>
      {/* ── Retour catalogue ────────────────────────────── */}
      <div className="px-6 md:px-12 pt-8 max-w-7xl mx-auto">
        <Link
          href="/academy"
          className="text-[0.65rem] uppercase tracking-[0.18em] text-secondary hover:text-primary transition-colors"
        >
          ← Toutes les offres
        </Link>
      </div>

      {/* ── Hero offre ──────────────────────────────────── */}
      <section className="px-6 md:px-12 pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block bg-on-surface text-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">
            {offer.level} — {offer.name}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface max-w-5xl leading-[1.05]">
            {offer.cardTitle}
          </h1>

          <p className="mt-6 text-base md:text-xl text-on-surface-variant max-w-3xl leading-relaxed">
            {offer.promiseHeadline}
          </p>

          <p className="mt-5 text-xs text-secondary tracking-tight">
            {offer.durationLine}
          </p>
        </div>
      </section>

      {/* ── Problème vécu ────────────────────────────────── */}
      <section className="bg-surface-container-lowest border-y border-outline-variant/15 px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-4">
            Le problème que tu connais
          </p>
          {offer.problemBody.map((para, i) => (
            <p key={i} className="text-base md:text-lg text-on-surface leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── Modules au choix (FONDATIONS uniquement) ─────── */}
      {offer.modules && offer.modules.length > 0 && (
        <section className="bg-on-surface text-white px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end mb-10">
              <div className="md:col-span-7">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-4">
                  Tu composes ton parcours
                </p>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                  Les modules au choix
                </h2>
              </div>
              <p className="md:col-span-5 text-sm md:text-base text-surface-dim leading-relaxed">
                Tu prends tout le pack ou tu choisis 2-3 modules selon ton angle. On adapte le format à ce que tu réserves.
              </p>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {offer.modules.map((m, i) => (
                <li
                  key={m.slug}
                  className="bg-white/[0.04] border border-white/10 p-6 md:p-7 flex flex-col gap-4"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-black bg-primary-fixed text-on-primary-fixed px-2 py-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{m.lead}</p>
                  <ul className="grid gap-2">
                    {m.takeaways.map((t, j) => (
                      <li
                        key={j}
                        className="text-sm text-white border-l-2 border-primary-fixed pl-3"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50 font-bold">
                    {m.durationHint}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Programme + Format en 7/5 ───────────────────── */}
      <section className="bg-surface-container-lowest border-y border-outline-variant/15 px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-7">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-5">
              Programme global
            </p>
            <ul className="grid gap-3">
              {offer.programme.map((line, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr] gap-3 items-baseline"
                >
                  <span className="text-xs font-black text-primary-fixed bg-on-surface px-2 py-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm md:text-base text-on-surface leading-relaxed">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-5">
              Format
            </p>
            <ul className="grid gap-3">
              {offer.format.map((line, i) => (
                <li
                  key={i}
                  className="border-l-2 border-primary-fixed pl-4 text-sm md:text-base text-on-surface leading-relaxed"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing + Conditions ─────────────────────────── */}
      <section className="px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-7xl mx-auto bg-on-surface text-white p-10 md:p-14 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          <div className="md:col-span-7">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-3">
              Tarif cohorte 1
            </p>
            <p className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
              {offer.priceEarly ? fmtPrice(offer.priceEarly) : 'Sur devis'}
            </p>
            {offer.priceEarly && (
              <p className="mt-2 text-sm text-white/60">
                Early bird — tarif plein {fmtPrice(offer.priceFull)}
              </p>
            )}
            {!offer.priceEarly && (
              <p className="mt-2 text-sm text-white/60">
                À partir de {fmtPrice(offer.priceFull)} — sur mesure selon profil d’entreprise
              </p>
            )}
          </div>
          <div className="md:col-span-5 text-sm leading-relaxed text-white/80 space-y-2">
            <p>
              <span className="font-black text-white">Paiement</span> en 2 fois (70 % à l’inscription, 30 % à mi-parcours).
            </p>
            <p>
              <span className="font-black text-white">Garantie</span> satisfaction sur les 7 premiers jours.
            </p>
            <p>
              <span className="font-black text-white">Annulation</span> possible jusqu’à 5 jours avant le début de la cohorte.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA principaux ───────────────────────────────── */}
      <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
            Prêt à réserver ta place&nbsp;?
          </h2>
          <p className="mt-4 text-base md:text-lg max-w-2xl">
            Le paiement Wave en ligne arrive bientôt. En attendant on confirme ton inscription par WhatsApp en moins de 24 h ouvrées,
            ou par e-mail si tu préfères.
          </p>
          <ReserveButtons offer={offer} />
        </div>
      </section>

      {/* ── Conseil 30 min secondaire ───────────────────── */}
      <ConseilCTA
        whatsappUrl={conseilWhatsappUrl(offer)}
        calendlyUrl={CONTACT.calendly}
        context={offer.slug}
      />
    </>
  );
}
