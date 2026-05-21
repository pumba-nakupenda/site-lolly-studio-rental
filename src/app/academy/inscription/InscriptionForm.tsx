'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';
import { OFFERS, CONTACT, reserveWhatsappUrl, getOffer } from '../_lib/offers';
import { track } from '../_components/Track';

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

    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      'Inscription LOLLY Academy — ' + (offer ? offer.name : form.offer),
    )}&body=${body}`;
    const wa = `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(lines.join('\n'))}`;

    window.open(mailto, '_blank');
    window.open(wa, '_blank');
    setSubmitted(true);
  }

  return (
    <>
      <section className="px-6 md:px-12 pt-10 md:pt-14 pb-6 max-w-3xl mx-auto">
        <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">
          Formulaire d’inscription
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-on-surface leading-[1.05]">
          Tes coordonnées, on revient vers toi en moins de 24 h ouvrées.
        </h1>
        <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl">
          Le paiement Wave en ligne arrive bientôt. En attendant, on confirme ton inscription par WhatsApp ou e-mail.
        </p>
      </section>

      {!submitted ? (
        <section className="px-6 md:px-12 pb-16 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Field label="Offre">
              <select
                value={form.offer}
                onChange={(e) => update('offer', e.target.value)}
                className={inputClass}
                required
              >
                {OFFERS.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.level} — {o.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom">
                <input
                  className={inputClass}
                  required
                  value={form.prenom}
                  onChange={(e) => update('prenom', e.target.value)}
                />
              </Field>
              <Field label="Nom">
                <input
                  className={inputClass}
                  required
                  value={form.nom}
                  onChange={(e) => update('nom', e.target.value)}
                />
              </Field>
            </div>
            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
            </Field>
            <Field label="WhatsApp">
              <input
                type="tel"
                className={inputClass}
                required
                placeholder="+221 ..."
                value={form.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
              />
            </Field>
            <Field label="Entreprise (optionnel)">
              <input
                className={inputClass}
                value={form.entreprise}
                onChange={(e) => update('entreprise', e.target.value)}
              />
            </Field>
            <Field label="Quelque chose à nous dire avant inscription (optionnel)">
              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
              />
            </Field>

            <p className="text-xs text-secondary">
              En validant tu déclenches l’ouverture de WhatsApp avec un message pré-rempli et l’envoi d’un brouillon e-mail vers <span className="font-bold">oudama@lolly.sn</span>. Aucune donnée n’est stockée en ligne.
            </p>

            <div>
              <button
                type="submit"
                className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface/80 transition-colors"
              >
                Envoyer mon inscription →
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="px-6 md:px-12 pb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-on-surface">
            Merci, c’est bien parti.
          </h2>
          <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl">
            WhatsApp et ton client mail viennent de s’ouvrir avec ton message pré-rempli. Envoie l’un OU l’autre — on confirme ton inscription en moins de 24 h ouvrées.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href={reserveWhatsappUrl(getOffer(form.offer) || OFFERS[0])}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track('click_reserver_paiement_wave_fallback', {
                  offer: form.offer,
                  channel: 'whatsapp_postform',
                })
              }
              className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface/80 transition-colors"
            >
              Renvoyer le WhatsApp →
            </a>
            <Link
              href="/academy"
              className="border-2 border-on-surface text-on-surface font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface hover:text-primary-fixed transition-colors"
            >
              Revenir au catalogue
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

const inputClass =
  'w-full bg-surface-container-lowest border-2 border-outline-variant/40 px-4 py-3 text-base text-on-surface focus:border-on-surface focus:outline-none transition-colors';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}
