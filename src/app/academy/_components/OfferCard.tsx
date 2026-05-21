'use client';

import Link from 'next/link';
import { track } from './Track';
import type { Offer } from '../_lib/offers';

export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link
      href={`/academy/${offer.slug}`}
      onClick={() => track(`click_carte_${offer.slug.replace(/-/g, '_')}`)}
      className="academy-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.08)',
        padding: '40px 32px',
        textDecoration: 'none',
        color: '#000',
        height: '100%',
        minHeight: 360,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          background: '#000',
          color: '#FED700',
          padding: '6px 14px',
          fontSize: 11,
          letterSpacing: '0.15em',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
        className="academy-body"
      >
        {offer.level} — {offer.name}
      </span>

      <h3
        className="academy-display"
        style={{
          marginTop: 24,
          fontSize: 'clamp(1.5rem, 2.4vw, 1.95rem)',
        }}
      >
        {offer.cardTitle}
      </h3>

      <p className="academy-body" style={{ marginTop: 16, color: '#3A3A3A', fontSize: '1rem' }}>
        {offer.cardLead}
      </p>

      <p
        className="academy-body"
        style={{
          marginTop: 24,
          fontSize: 13,
          color: '#6B6B6B',
          letterSpacing: '0.02em',
        }}
      >
        {offer.meta}
      </p>

      <span
        className="academy-display"
        style={{
          marginTop: 'auto',
          paddingTop: 32,
          fontSize: 14,
          letterSpacing: '0.14em',
          color: '#000',
        }}
      >
        Découvrir {offer.name} →
      </span>
    </Link>
  );
}
