import { notFound } from 'next/navigation';
import Link from 'next/link';
import CTAButton from '../_components/CTAButton';
import Footer from '../_components/Footer';
import {
  OFFERS,
  getOffer,
  reserveWhatsappUrl,
  conseilWhatsappUrl,
  CONTACT,
  fmtPrice,
} from '../_lib/offers';

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

  const reserveEvent = `click_reserver_paiement_wave_${offer.slug.replace(/-/g, '_')}`;

  return (
    <main>
      {/* ── Breadcrumb mini ─────────────────────────────── */}
      <div
        style={{ padding: '12px 24px 0', maxWidth: 1200, margin: '0 auto' }}
        className="academy-body"
      >
        <Link
          href="/academy"
          style={{ fontSize: 12, letterSpacing: '0.18em', color: '#6B6B6B', textTransform: 'uppercase' }}
        >
          ← Toutes les offres
        </Link>
      </div>

      {/* ── Hero offre ──────────────────────────────────── */}
      <section
        style={{
          padding: '32px 24px 56px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <p
          className="academy-body"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#FED700',
            background: '#000',
            display: 'inline-block',
            padding: '6px 14px',
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {offer.level} — {offer.name}
        </p>

        <h1
          className="academy-display"
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 4rem)',
            color: '#000',
            maxWidth: 980,
          }}
        >
          {offer.cardTitle}
        </h1>

        <p
          className="academy-body"
          style={{
            marginTop: 24,
            fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
            color: '#3A3A3A',
            maxWidth: 720,
          }}
        >
          {offer.promiseHeadline}
        </p>

        <p
          className="academy-body"
          style={{ marginTop: 24, fontSize: 14, color: '#6B6B6B', letterSpacing: '0.02em' }}
        >
          {offer.durationLine}
        </p>
      </section>

      {/* ── Problème vécu ────────────────────────────────── */}
      <section
        style={{
          background: '#FFFFFF',
          padding: '64px 24px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2
            className="academy-display"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', marginBottom: 24 }}
          >
            Le problème que tu connais
          </h2>
          {offer.problemBody.map((para, i) => (
            <p
              key={i}
              className="academy-body"
              style={{
                fontSize: '1.1rem',
                color: '#1A1A1A',
                marginBottom: 16,
                maxWidth: 720,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── Promesse ─────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ maxWidth: 820 }}>
          <p
            className="academy-body"
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#000',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            À la fin tu repars avec
          </p>
          <h2
            className="academy-display"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)' }}
          >
            {offer.promiseHeadline}
          </h2>
        </div>
      </section>

      {/* ── Programme + Format en 7/5 ───────────────────── */}
      <section
        style={{
          background: '#FFFFFF',
          padding: '64px 24px',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 48,
          }}
        >
          <div>
            <p
              className="academy-body"
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Programme
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
              {offer.programme.map((line, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'baseline' }}>
                  <span
                    className="academy-display"
                    style={{ color: '#FED700', background: '#000', padding: '2px 8px', fontSize: 12 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="academy-body" style={{ fontSize: '1rem', color: '#1A1A1A' }}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p
              className="academy-body"
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#6B6B6B',
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Format
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
              {offer.format.map((line, i) => (
                <li
                  key={i}
                  style={{ borderLeft: '3px solid #FED700', paddingLeft: 14, fontSize: '1rem', color: '#1A1A1A' }}
                  className="academy-body"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing + Conditions ─────────────────────────── */}
      <section
        style={{ padding: '64px 24px', maxWidth: 1120, margin: '0 auto' }}
      >
        <div
          style={{
            background: '#000',
            color: '#FFFFFF',
            padding: '48px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div>
            <p
              className="academy-body"
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#FED700',
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Tarif cohorte 1
            </p>
            <p
              className="academy-display"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                color: '#FFFFFF',
                lineHeight: 1,
              }}
            >
              {offer.priceEarly ? fmtPrice(offer.priceEarly) : 'Sur devis'}
            </p>
            {offer.priceEarly && (
              <p
                className="academy-body"
                style={{ marginTop: 8, color: '#9A9A9A', fontSize: 14 }}
              >
                Early bird — tarif plein {fmtPrice(offer.priceFull)}
              </p>
            )}
            {!offer.priceEarly && (
              <p
                className="academy-body"
                style={{ marginTop: 8, color: '#9A9A9A', fontSize: 14 }}
              >
                À partir de {fmtPrice(offer.priceFull)} — sur mesure selon profil d’entreprise
              </p>
            )}
          </div>
          <div className="academy-body" style={{ color: '#CFCFCF', fontSize: 14, lineHeight: 1.6 }}>
            <p style={{ marginBottom: 8 }}><strong style={{ color: '#FFFFFF' }}>Paiement</strong> en 2 fois (70 % à l’inscription, 30 % à mi-parcours).</p>
            <p style={{ marginBottom: 8 }}><strong style={{ color: '#FFFFFF' }}>Garantie</strong> satisfaction sur les 7 premiers jours.</p>
            <p><strong style={{ color: '#FFFFFF' }}>Annulation</strong> possible jusqu’à 5 jours avant le début de la cohorte.</p>
          </div>
        </div>
      </section>

      {/* ── CTA principaux ───────────────────────────────── */}
      <section
        style={{
          background: '#FED700',
          padding: '64px 24px',
          color: '#000',
        }}
      >
        <div
          style={{
            maxWidth: 920,
            margin: '0 auto',
            display: 'grid',
            gap: 16,
            textAlign: 'left',
          }}
        >
          <h2 className="academy-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Prêt à réserver ta place&nbsp;?
          </h2>
          <p className="academy-body" style={{ fontSize: '1.05rem', maxWidth: 640 }}>
            Le paiement Wave en ligne arrive bientôt. En attendant on confirme ton inscription par WhatsApp en moins de 24h ouvrées,
            ou par e-mail si tu préfères.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            <CTAButton
              href={reserveWhatsappUrl(offer)}
              variant="primary"
              size="lg"
              external
              event={reserveEvent}
              eventProps={{ channel: 'whatsapp' }}
            >
              Réserver ma place — WhatsApp →
            </CTAButton>
            <CTAButton
              href={`/academy/inscription?offre=${offer.slug}`}
              variant="outline"
              size="lg"
              event={reserveEvent}
              eventProps={{ channel: 'form' }}
            >
              Remplir un formulaire d’inscription
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── Conseil 30 min secondaire ───────────────────── */}
      <section style={{ background: '#0A0A0A', color: '#FFFFFF', padding: '56px 24px' }}>
        <div
          style={{
            maxWidth: 920,
            margin: '0 auto',
            display: 'grid',
            gap: 16,
          }}
        >
          <h3
            className="academy-display"
            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', color: '#FFFFFF' }}
          >
            Tu hésites encore&nbsp;?
          </h3>
          <p className="academy-body" style={{ color: '#CFCFCF', fontSize: '1rem', maxWidth: 640 }}>
            30 min en visio avec Amadou Mbaye Gueye avant inscription. Gratuit si tu finalises ensuite ton inscription.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <CTAButton
              href={CONTACT.calendly}
              variant="yellow-on-black"
              external
              event="click_conseil_30min"
              eventProps={{ via: 'calendly', offer: offer.slug }}
            >
              Calendly
            </CTAButton>
            <CTAButton
              href={conseilWhatsappUrl(offer)}
              variant="outline-light"
              external
              event="click_conseil_30min"
              eventProps={{ via: 'whatsapp', offer: offer.slug }}
            >
              WhatsApp
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
