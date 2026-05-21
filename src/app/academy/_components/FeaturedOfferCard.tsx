'use client';

import Link from 'next/link';
import { track } from './Track';
import { priceFrom, fmtPrice, type Offer } from '../_lib/offers';

export default function FeaturedOfferCard({ offer }: { offer: Offer }) {
  const modules = offer.modules ?? [];

  return (
    <div className="bg-on-surface text-white p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5">
            Offre vedette
          </span>
          <span className="bg-white/10 text-white text-[0.65rem] uppercase tracking-[0.18em] font-bold px-3 py-1.5">
            {offer.level} — {offer.name}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[1.05]">
          {offer.cardTitle}
        </h2>

        <p className="mt-5 text-base md:text-lg text-surface-dim leading-relaxed max-w-xl">
          {offer.cardLead}
        </p>

        <div className="mt-6 flex items-baseline gap-3">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.18em] text-white/50 font-bold">
              À partir de
            </p>
            <p className="text-2xl font-black text-primary-fixed tracking-tight">
              {fmtPrice(priceFrom(offer))}
            </p>
          </div>
          <p className="text-xs text-white/50 tracking-tight">{offer.metaShort}</p>
        </div>

        <Link
          href={`/academy/${offer.slug}`}
          onClick={() =>
            track(`click_carte_${offer.slug.replace(/-/g, '_')}`, { context: 'featured' })
          }
          className="mt-8 inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed font-black uppercase px-7 py-4 text-xs tracking-[0.18em] hover:bg-primary-fixed-dim transition-colors"
        >
          Découvrir {offer.name} →
        </Link>
      </div>

      {modules.length > 0 && (
        <div className="lg:col-span-5">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] font-bold text-primary-fixed mb-5">
            Les modules au choix
          </p>
          <ul className="grid gap-4">
            {modules.map((m, i) => (
              <li key={m.slug} className="border-l-2 border-primary-fixed pl-4">
                <p className="text-sm font-black uppercase tracking-tight text-white mb-1">
                  {String(i + 1).padStart(2, '0')} · {m.title}
                </p>
                <p className="text-sm text-white/70 leading-snug">
                  {m.lead}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
