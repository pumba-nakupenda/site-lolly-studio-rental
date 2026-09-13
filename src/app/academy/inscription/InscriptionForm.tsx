'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';
import { CONTACT, EVENT_TOPICS, OFFERS, getOffer, reserveWhatsappUrl, type Offer } from '../_lib/offers';
import { track } from '../_components/Track';

type RegistrationSlug = Offer['slug'] | 'masterclass' | 'conseil';
type FormState = { offer: RegistrationSlug; topic: string; sessionPreference: string; nom: string; prenom: string; email: string; whatsapp: string; entreprise: string; message: string; website: string };

const REGISTRATION_OPTIONS: { slug: RegistrationSlug; name: string; durationLine: string }[] = [
  { slug: 'conseil', name: 'Échange conseil après diagnostic', durationLine: 'Gratuit · sans engagement' },
  { slug: 'masterclass', name: 'Les Masterclass de LOLLY', durationLine: 'Tous les samedis · gratuit' },
  ...OFFERS.map(({ slug, name, durationLine }) => ({ slug, name, durationLine })),
];

function getRegistrationOption(slug: string) {
  return REGISTRATION_OPTIONS.find((option) => option.slug === slug);
}

export default function InscriptionForm({ initialOffer, initialDiagnostic = '' }: { initialOffer: string; initialDiagnostic?: string }) {
  const validInitialOffer = getRegistrationOption(initialOffer)?.slug ?? OFFERS[0].slug;
  const [form, setForm] = useState<FormState>({ offer: validInitialOffer, topic: '', sessionPreference: '', nom: '', prenom: '', email: '', whatsapp: '', entreprise: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (form.offer === 'masterclass' && form.sessionPreference) {
      const requestedDate = new Date(`${form.sessionPreference}T00:00:00Z`);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      if (requestedDate.getUTCDay() !== 6 || requestedDate < today) {
        setError('Choisis un samedi à venir, ou laisse le champ vide pour recevoir la prochaine date.');
        setStatus('error');
        return;
      }
    }
    setStatus('sending');
    setError('');
    const registration = getRegistrationOption(form.offer) ?? REGISTRATION_OPTIONS[0];
    track('inscription_form_submit', { offer: registration.slug });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.prenom.trim()} ${form.nom.trim()}`.trim(),
          email: form.email,
          phone: form.whatsapp,
          service_interest: `LOLLY Academy — ${registration.name}`,
          message: initialDiagnostic ? `${initialDiagnostic}${form.message.trim() ? `\n\nPrécisions :\n${form.message.trim()}` : ''}` : form.message,
          request_type: 'academy_registration',
          request_data: { offer: registration.slug, offer_name: registration.name, company: form.entreprise, topic: form.topic, session_preference: form.offer === 'masterclass' ? form.sessionPreference : '' },
          website: form.website,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Impossible d’envoyer la demande.');
      setStatus('success');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Impossible d’envoyer la demande.');
      setStatus('error');
    }
  }

  const selectedOffer = getOffer(form.offer);
  const selectedRegistration = getRegistrationOption(form.offer) ?? REGISTRATION_OPTIONS[0];
  const successWhatsappUrl = selectedOffer
    ? reserveWhatsappUrl(selectedOffer)
    : `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(form.offer === 'conseil' ? 'Bonjour LOLLY Academy, je viens de transmettre mon diagnostic sur le site et souhaite en discuter avec vous.' : 'Bonjour LOLLY Academy, je viens de m’inscrire aux Masterclass de LOLLY sur le site. Je souhaite connaître le thème et l’horaire du prochain samedi. Merci.')}`;
  const showTopic = form.offer === 'masterclass' || form.offer === 'ateliers';

  return (
    <section className="px-6 md:px-12 py-12 md:py-20 max-w-3xl mx-auto">
      <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">{form.offer === 'conseil' ? 'Demande de conseil' : 'Demande d’inscription'}</span>
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.05]">{form.offer === 'conseil' ? 'Parlons de ton diagnostic.' : 'Dis-nous où tu veux avancer.'}</h1>
      <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl">Cette demande ne déclenche aucun paiement. Pour les Masterclass et ateliers, la date, l’horaire et la place seront confirmés par l’équipe LOLLY.</p>

      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="grid gap-4 mt-10">
          <div className="absolute -left-[9999px]" aria-hidden="true"><label>Site web<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label></div>
          <Field label="Rendez-vous ou offre"><select value={form.offer} onChange={(event) => update('offer', event.target.value)} className={inputClass}>{REGISTRATION_OPTIONS.map((option) => <option key={option.slug} value={option.slug}>{option.name} — {option.durationLine}</option>)}</select></Field>
          {showTopic ? <Field label="Sujet qui t’intéresse"><select value={form.topic} onChange={(event) => update('topic', event.target.value)} className={inputClass}><option value="">Je souhaite découvrir le prochain thème</option>{EVENT_TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></Field> : null}
          {form.offer === 'masterclass' ? <Field label="Samedi souhaité (facultatif, sous réserve de confirmation)"><input type="date" className={inputClass} value={form.sessionPreference} onChange={(event) => update('sessionPreference', event.target.value)} /><span className="text-xs text-secondary">Laisse vide si tu préfères connaître la prochaine date disponible.</span></Field> : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prénom"><input className={inputClass} required maxLength={80} autoComplete="given-name" value={form.prenom} onChange={(event) => update('prenom', event.target.value)} /></Field>
            <Field label="Nom"><input className={inputClass} required maxLength={80} autoComplete="family-name" value={form.nom} onChange={(event) => update('nom', event.target.value)} /></Field>
          </div>
          <Field label="Email"><input type="email" className={inputClass} required maxLength={160} autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></Field>
          <Field label="WhatsApp"><input type="tel" className={inputClass} required maxLength={40} autoComplete="tel" placeholder="+221 ..." value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} /></Field>
          <Field label="Entreprise (optionnel)"><input className={inputClass} maxLength={120} autoComplete="organization" value={form.entreprise} onChange={(event) => update('entreprise', event.target.value)} /></Field>
          {initialDiagnostic && <div className="border-l-4 border-primary-fixed bg-white p-5"><p className="text-xs font-black uppercase tracking-wider">Synthèse jointe à ta demande</p><pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm text-on-surface-variant">{initialDiagnostic}</pre></div>}
          <Field label={form.offer === 'conseil' ? 'Une précision sur ton diagnostic (optionnel)' : 'Ton objectif ou ton besoin (optionnel)'}><textarea className={`${inputClass} min-h-[120px] resize-y`} maxLength={initialDiagnostic ? 600 : 1200} value={form.message} onChange={(event) => update('message', event.target.value)} /></Field>
          <p className="text-xs text-secondary">Les informations sont utilisées uniquement pour enregistrer ta demande et te communiquer les prochaines informations pratiques.</p>
          {status === 'error' && <p role="alert" className="border-l-4 border-error pl-3 text-sm text-error">{error}</p>}
          <div><button type="submit" disabled={status === 'sending'} className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] disabled:opacity-60">{status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande →'}</button></div>
        </form>
      ) : (
        <div role="status" className="mt-10 border-t-4 border-primary-fixed bg-white p-7 md:p-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Demande bien reçue.</h2>
          <p className="mt-4 text-on-surface-variant">{form.offer === 'conseil' ? 'Ton diagnostic est transmis à l’équipe LOLLY. Nous te recontacterons pour en parler avant de proposer une solution.' : `Ta demande pour « ${selectedRegistration.name} » est enregistrée. L’équipe LOLLY te recontactera pour confirmer la date, l’horaire et la disponibilité de la place.`}</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3"><a href={successWhatsappUrl} target="_blank" rel="noopener noreferrer" className="bg-on-surface text-primary-fixed font-black uppercase px-7 py-4 text-xs tracking-[0.18em]">Continuer sur WhatsApp →</a><Link href="/academy" className="border-2 border-on-surface px-7 py-4 font-black uppercase text-xs tracking-[0.18em]">Retour à Academy</Link></div>
        </div>
      )}
    </section>
  );
}

const inputClass = 'w-full bg-white border-2 border-outline-variant/40 px-4 py-3 text-base text-on-surface focus:border-on-surface focus:outline-none';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2"><span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-secondary">{label}</span>{children}</label>;
}
