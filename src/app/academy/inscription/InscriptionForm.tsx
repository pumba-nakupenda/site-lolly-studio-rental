'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { OFFERS, CONTACT, reserveWhatsappUrl, getOffer } from '../_lib/offers';
import { track } from '../_components/Track';
import CTAButton from '../_components/CTAButton';
import Footer from '../_components/Footer';

type FormState = {
  offer: string;
  nom: string;
  prenom: string;
  email: string;
  whatsapp: string;
  entreprise: string;
  message: string;
};

export default function InscriptionForm({ initialOffer }: { initialOffer: string }) {
  const [form, setForm] = useState<FormState>({
    offer: initialOffer || OFFERS[0].slug,
    nom: '',
    prenom: '',
    email: '',
    whatsapp: '',
    entreprise: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function update(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const offer = getOffer(form.offer);
    track('inscription_form_submit', { offer: form.offer });

    const lines = [
      `Inscription LOLLY Academy — ${offer ? offer.name : form.offer}`,
      `Nom : ${form.nom}`,
      `Prénom : ${form.prenom}`,
      `Email : ${form.email}`,
      `WhatsApp : ${form.whatsapp}`,
    ];
    if (form.entreprise) lines.push(`Entreprise : ${form.entreprise}`);
    if (form.message) lines.push(`Message : ${form.message}`);
    const body = encodeURIComponent(lines.join('\n'));

    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Inscription LOLLY Academy — ' + (offer ? offer.name : form.offer))}&body=${body}`;
    const wa = `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(lines.join('%0A').replace(/%0A/g, '\n'))}`;

    // Ouvre le mail dans un onglet et WhatsApp dans un autre, on garde la page pour confirm.
    window.open(mailto, '_blank');
    window.open(wa, '_blank');
    setSubmitted(true);
  }

  return (
    <main>
      <section
        style={{ padding: '40px 24px 24px', maxWidth: 720, margin: '0 auto' }}
      >
        <p
          className="academy-body"
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#000',
            background: '#FED700',
            display: 'inline-block',
            padding: '6px 14px',
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          Formulaire d’inscription
        </p>
        <h1
          className="academy-display"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#000' }}
        >
          Tes coordonnées, on revient vers toi en moins de 24 h ouvrées.
        </h1>
        <p className="academy-body" style={{ marginTop: 16, color: '#3A3A3A', fontSize: '1rem' }}>
          Le paiement Wave en ligne arrive bientôt. En attendant, on confirme ton inscription par WhatsApp ou e-mail.
        </p>
      </section>

      {!submitted ? (
        <section style={{ padding: '0 24px 64px', maxWidth: 720, margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <Field
              label="Offre"
              field={
                <select
                  value={form.offer}
                  onChange={(e) => update('offer', e.target.value)}
                  style={inputStyle}
                  required
                >
                  {OFFERS.map((o) => (
                    <option key={o.slug} value={o.slug}>{o.level} — {o.name}</option>
                  ))}
                </select>
              }
            />
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <Field label="Prénom" field={<input style={inputStyle} required value={form.prenom} onChange={(e) => update('prenom', e.target.value)} />} />
              <Field label="Nom" field={<input style={inputStyle} required value={form.nom} onChange={(e) => update('nom', e.target.value)} />} />
            </div>
            <Field label="Email" field={<input style={inputStyle} type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />} />
            <Field label="WhatsApp" field={<input style={inputStyle} type="tel" required placeholder="+221 ..." value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} />} />
            <Field label="Entreprise (optionnel)" field={<input style={inputStyle} value={form.entreprise} onChange={(e) => update('entreprise', e.target.value)} />} />
            <Field
              label="Quelque chose à nous dire avant inscription (optionnel)"
              field={<textarea style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }} value={form.message} onChange={(e) => update('message', e.target.value)} />}
            />

            <p className="academy-body" style={{ fontSize: 12, color: '#6B6B6B' }}>
              En validant tu déclenches l’ouverture de WhatsApp avec un message pré-rempli et l’envoi d’un brouillon e-mail vers oudama@lolly.sn. Aucune donnée n’est stockée en ligne.
            </p>

            <div>
              <CTAButton
                href="#"
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                event="inscription_form_submit"
                eventProps={{ offer: form.offer, channel: 'whatsapp+mail' }}
              >
                Envoyer mon inscription →
              </CTAButton>
            </div>
          </form>
        </section>
      ) : (
        <section style={{ padding: '0 24px 64px', maxWidth: 720, margin: '0 auto' }}>
          <h2 className="academy-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#000' }}>
            Merci, c’est bien parti.
          </h2>
          <p className="academy-body" style={{ marginTop: 16, color: '#3A3A3A', fontSize: '1.05rem', maxWidth: 600 }}>
            WhatsApp et ton client mail viennent de s’ouvrir avec ton message pré-rempli. Envoie l’un OU l’autre — on confirme ton inscription en moins de 24h ouvrées.
          </p>
          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <CTAButton
              href={reserveWhatsappUrl(getOffer(form.offer) || OFFERS[0])}
              variant="primary"
              size="lg"
              external
              event="click_reserver_paiement_wave_fallback"
              eventProps={{ offer: form.offer, channel: 'whatsapp_postform' }}
            >
              Renvoyer le WhatsApp →
            </CTAButton>
            <CTAButton href="/academy" variant="outline" size="lg">
              Revenir au catalogue
            </CTAButton>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

const inputStyle = {
  width: '100%',
  fontFamily: 'var(--font-lato, Lato, sans-serif)',
  fontSize: 15,
  padding: '12px 14px',
  background: '#FFFFFF',
  border: '2px solid rgba(0,0,0,0.16)',
  color: '#000',
};

function Field({ label, field }: { label: string; field: ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span
        className="academy-body"
        style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B6B6B', fontWeight: 700 }}
      >
        {label}
      </span>
      {field}
    </label>
  );
}
