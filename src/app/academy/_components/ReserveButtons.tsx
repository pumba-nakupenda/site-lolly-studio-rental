'use client';

import Link from 'next/link';
import { track } from './Track';
import { reserveWhatsappUrl, type Offer } from '../_lib/offers';

export function ReserveButtons({ offer }: { offer: Offer }) {
  const event = `click_reserver_paiement_wave_${offer.slug.replace(/-/g, '_')}`;
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <a
        href={reserveWhatsappUrl(offer)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(event, { channel: 'whatsapp' })}
        className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface/80 transition-colors"
      >
        Réserver ma place — WhatsApp →
      </a>
      <Link
        href={`/academy/inscription?offre=${offer.slug}`}
        onClick={() => track(event, { channel: 'form' })}
        className="border-2 border-on-surface text-on-surface font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface hover:text-primary-fixed transition-colors"
      >
        Remplir un formulaire d’inscription
      </Link>
    </div>
  );
}

export default ReserveButtons;
