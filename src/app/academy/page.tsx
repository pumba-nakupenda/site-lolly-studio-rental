import OfferCard from './_components/OfferCard';
import CTAButton from './_components/CTAButton';
import Footer from './_components/Footer';
import { OFFERS, CONTACT, conseilWhatsappUrl } from './_lib/offers';

export const metadata = {
  title: 'LOLLY Academy — Quel est ton défi de communication aujourd’hui ?',
  description:
    '4 chemins pour faire bouger ta com. FONDATIONS, REPRISE EN MAIN, PILOTAGE, POSTURE. Choisis celui qui te ressemble.',
};

export default function AcademyHome() {
  return (
    <main>
      {/* ── Hero ───────────────────────────────────────── */}
      <section
        style={{
          padding: '64px 24px 56px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <p
          className="academy-body"
          style={{
            fontSize: 13,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#000',
            background: '#FED700',
            display: 'inline-block',
            padding: '6px 14px',
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          Cohorte 1 · lundi 15 juin 2026
        </p>

        <h1
          className="academy-display"
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 4rem)',
            lineHeight: 1.05,
            color: '#000',
            maxWidth: 980,
          }}
        >
          Quel est ton défi de communication aujourd’hui&nbsp;?
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
          4 chemins pour faire bouger ta com. Choisis celui qui te ressemble.
        </p>

        <div style={{ marginTop: 32 }}>
          <CTAButton
            href="/academy/diagnostic"
            variant="outline"
            size="sm"
            event="click_diagnostic_start"
            eventProps={{ source: 'hero' }}
          >
            Je ne sais pas où je me situe → fais le diagnostic en 2 minutes
          </CTAButton>
        </div>
      </section>

      {/* ── 4 Cartes ────────────────────────────────────── */}
      <section
        id="offres"
        style={{
          padding: '0 24px 80px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
          className="academy-grid"
        >
          {OFFERS.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      {/* ── Mini diagnostic ─────────────────────────────── */}
      <section
        style={{
          background: '#FED700',
          padding: '80px 24px',
          color: '#000',
        }}
      >
        <div
          style={{
            maxWidth: 920,
            margin: '0 auto',
            display: 'grid',
            gap: 24,
          }}
        >
          <h2
            className="academy-display"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            Tu hésites entre deux profils&nbsp;?
          </h2>
          <p
            className="academy-body"
            style={{ fontSize: '1.15rem', color: '#000', maxWidth: 680 }}
          >
            Réponds à 5 questions en 2 minutes. Tu sauras exactement où tu en es et quelle offre te correspond.
          </p>
          <div>
            <CTAButton
              href="/academy/diagnostic"
              variant="primary"
              size="lg"
              event="click_diagnostic_start"
              eventProps={{ source: 'banner_yellow' }}
            >
              Faire le diagnostic →
            </CTAButton>
          </div>
        </div>
      </section>

      {/* ── Conseil 30 min ──────────────────────────────── */}
      <section
        style={{
          background: '#0A0A0A',
          color: '#FFFFFF',
          padding: '80px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 920,
            margin: '0 auto',
            textAlign: 'center',
            display: 'grid',
            gap: 24,
            justifyItems: 'center',
          }}
        >
          <p
            className="academy-body"
            style={{
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#FED700',
              fontWeight: 700,
            }}
          >
            CTA premium
          </p>
          <h2
            className="academy-display"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', color: '#FFFFFF' }}
          >
            Tu préfères en parler de vive voix&nbsp;?
          </h2>
          <p
            className="academy-body"
            style={{ fontSize: '1.1rem', color: '#CFCFCF', maxWidth: 620 }}
          >
            30 minutes en visio avec Amadou Mbaye Gueye, fondateur de <span className="lolly-wordmark" style={{ color: '#FFFFFF' }}>LOLLY</span>.
            Gratuit si tu t’inscris ensuite à une formation. 15 000 XOF sinon.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <CTAButton
              href={CONTACT.calendly}
              variant="yellow-on-black"
              size="lg"
              external
              event="click_conseil_30min"
              eventProps={{ via: 'calendly' }}
            >
              Réserver via Calendly →
            </CTAButton>
            <CTAButton
              href={conseilWhatsappUrl(null)}
              variant="outline-light"
              size="lg"
              external
              event="click_conseil_30min"
              eventProps={{ via: 'whatsapp' }}
            >
              WhatsApp direct →
            </CTAButton>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
