'use client';

import Link from 'next/link';
import { track } from './Track';
import { offerPriceLabel, type Offer } from '../_lib/offers';

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link
      href={`/academy/${offer.slug}`}
      onClick={() => track(`click_carte_${offer.slug.replace(/-/g, '_')}`)}
      className="group flex flex-col bg-surface-container-lowest border border-outline-variant/15 hover:border-on-surface hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all p-6 md:p-7 h-full"
    >
      <span className="inline-block self-start text-[0.6rem] uppercase tracking-[0.22em] font-bold text-primary-fixed bg-on-surface px-3 py-1.5 mb-5">
        {offer.eyebrow} — {offer.name}
      </span>

      <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-on-surface leading-tight">
        {offer.cardTitle}
      </h3>

      <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
        {offer.cardLead}
      </p>

      <div className="mt-5">
        <p className="text-[0.6rem] uppercase tracking-[0.18em] text-secondary font-bold">
          Tarif
        </p>
        <p className="text-xl font-black text-primary tracking-tight">
          {offerPriceLabel(offer)}
        </p>
        <p className="mt-1 text-xs text-secondary">{offer.durationLine}</p>
      </div>

      <span className="mt-auto pt-6 text-xs uppercase tracking-[0.18em] font-black text-on-surface group-hover:text-primary transition-colors">
        Voir le détail →
      </span>
    </Link>
  );
}
