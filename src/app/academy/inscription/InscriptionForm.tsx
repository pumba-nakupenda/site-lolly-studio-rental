'use client';

import Link from 'next/link';
import { useState, type FormEvent, type ReactNode } from 'react';
import { OFFERS, getOffer, reserveWhatsappUrl } from '../_lib/offers';
import { track } from '../_components/Track';

type FormState = { offer: string; nom: string; prenom: string; email: string; whatsapp: string; entreprise: string; message: string; website: string };

export default function InscriptionForm({ initialOffer }: { initialOffer: string }) {
  const validInitialOffer = getOffer(initialOffer)?.slug ?? OFFERS[0].slug;
  const [form, setForm] = useState<FormState>({ offer: validInitialOffer, nom: '', prenom: '', email: '', whatsapp: '', entreprise: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  function update(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    const offer = getOffer(form.offer) ?? OFFERS[0];
    track('inscription_form_submit', { offer: offer.slug });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.prenom.trim()} ${form.nom.trim()}`.trim(),
          email: form.email,
          phone: form.whatsapp,
          service_interest: `LOLLY Academy — ${offer.name}`,
          message: form.message,
          request_type: 'academy_registration',
          request_data: { offer: offer.slug, offer_name: offer.name, company: form.entreprise },
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

  const selectedOffer = getOffer(form.offer) ?? OFFERS[0];

  return (
    <section className="px-6 md:px-12 py-12 md:py-20 max-w-3xl mx-auto">
      <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">Demande d’inscription</span>
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.05]">Dis-nous où tu veux avancer.</h1>
      <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl">Cette demande ne déclenche aucun paiement. L’équipe vérifie la formule, les disponibilités et revient vers toi.</p>

      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="grid gap-4 mt-10">
          <div className="absolute -left-[9999px]" aria-hidden="true"><label>Site web<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label></div>
          <Field label="Offre"><select value={form.offer} onChange={(event) => update('offer', event.target.value)} className={inputClass}>{OFFERS.map((offer) => <option key={offer.slug} value={offer.slug}>{offer.name} — {offer.durationLine}</option>)}</select></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prénom"><input className={inputClass} required maxLength={80} autoComplete="given-name" value={form.prenom} onChange={(event) => update('prenom', event.target.value)} /></Field>
            <Field label="Nom"><input className={inputClass} required maxLength={80} autoComplete="family-name" value={form.nom} onChange={(event) => update('nom', event.target.value)} /></Field>
          </div>
          <Field label="Email"><input type="email" className={inputClass} required maxLength={160} autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></Field>
          <Field label="WhatsApp"><input type="tel" className={inputClass} required maxLength={40} autoComplete="tel" placeholder="+221 ..." value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} /></Field>
          <Field label="Entreprise (optionnel)"><input className={inputClass} maxLength={120} autoComplete="organization" value={form.entreprise} onChange={(event) => update('entreprise', event.target.value)} /></Field>
          <Field label="Ton objectif ou ton besoin (optionnel)"><textarea className={`${inputClass} min-h-[120px] resize-y`} maxLength={1200} value={form.message} onChange={(event) => update('message', event.target.value)} /></Field>
          <p className="text-xs text-secondary">Les informations sont utilisées uniquement pour répondre à ta demande d’inscription.</p>
          {status === 'error' && <p role="alert" className="border-l-4 border-error pl-3 text-sm text-error">{error}</p>}
          <div><button type="submit" disabled={status === 'sending'} className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] disabled:opacity-60">{status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande →'}</button></div>
        </form>
      ) : (
        <div role="status" className="mt-10 border-t-4 border-primary-fixed bg-white p-7 md:p-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Demande bien reçue.</h2>
          <p className="mt-4 text-on-surface-variant">L’équipe LOLLY va vérifier ta demande et te recontacter. Pour préciser un point immédiatement, tu peux continuer sur WhatsApp.</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3"><a href={reserveWhatsappUrl(selectedOffer)} target="_blank" rel="noopener noreferrer" className="bg-on-surface text-primary-fixed font-black uppercase px-7 py-4 text-xs tracking-[0.18em]">Continuer sur WhatsApp →</a><Link href="/academy" className="border-2 border-on-surface px-7 py-4 font-black uppercase text-xs tracking-[0.18em]">Retour aux offres</Link></div>
        </div>
      )}
    </section>
  );
}

const inputClass = 'w-full bg-white border-2 border-outline-variant/40 px-4 py-3 text-base text-on-surface focus:border-on-surface focus:outline-none';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2"><span className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-secondary">{label}</span>{children}</label>;
}
