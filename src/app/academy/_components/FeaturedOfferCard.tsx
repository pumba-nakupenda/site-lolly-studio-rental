'use client';

import Link from 'next/link';
import { track } from './Track';
import type { Offer } from '../_lib/offers';

export default function FeaturedOfferCard({ offer }: { offer: Offer }) {
  const modules = offer.modules ?? [];

  return (
    <div
      style={{
        background: '#000',
        color: '#FFFFFF',
        padding: 'clamp(28px, 5vw, 56px)',
        display: 'grid',
        gap: 28,
      }}
      className="academy-card"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        <div>
          <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <span
              className="academy-body"
              style={{
                background: '#FED700',
                color: '#000',
                padding: '6px 12px',
                fontSize: 11,
                letterSpacing: '0.2em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Offre vedette
            </span>
            <span
              className="academy-body"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF',
                padding: '6px 12px',
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {offer.level} — {offer.name}
            </span>
          </div>

          <h2
            className="academy-display"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', color: '#FFFFFF', maxWidth: 540 }}
          >
            {offer.cardTitle}
          </h2>

          <p
            className="academy-body"
            style={{ marginTop: 18, color: '#D4D4D4', fontSize: '1.05rem', maxWidth: 540 }}
          >
            {offer.cardLead}
          </p>

          <p
            className="academy-body"
            style={{ marginTop: 24, fontSize: 13, color: '#9A9A9A', letterSpacing: '0.02em', maxWidth: 540 }}
          >
            {offer.meta}
          </p>

          <Link
            href={`/academy/${offer.slug}`}
            onClick={() => track(`click_carte_${offer.slug.replace(/-/g, '_')}`, { context: 'featured' })}
            className="academy-display"
            style={{
              marginTop: 28,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: '#FED700',
              color: '#000',
              padding: '16px 28px',
              fontSize: 13,
              letterSpacing: '0.18em',
              textDecoration: 'none',
              border: '2px solid #FED700',
            }}
          >
            Découvrir {offer.name} →
          </Link>
        </div>

        {modules.length > 0 && (
          <div>
            <p
              className="academy-body"
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#FED700',
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              Les modules au choix
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 14 }}>
              {modules.map((m, i) => (
                <li
                  key={m.slug}
                  style={{
                    borderLeft: '3px solid #FED700',
                    paddingLeft: 14,
                  }}
                >
                  <p
                    className="academy-display"
                    style={{ color: '#FFFFFF', fontSize: 14, marginBottom: 4 }}
                  >
                    {String(i + 1).padStart(2, '0')} · {m.title}
                  </p>
                  <p className="academy-body" style={{ color: '#C7C7C7', fontSize: 13.5 }}>
                    {m.lead}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
