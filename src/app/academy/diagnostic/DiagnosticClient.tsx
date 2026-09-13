'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OFFERS, offerPriceLabel, type Offer } from '../_lib/offers';
import { track } from '../_components/Track';

type OfferSlug = Offer['slug'];
type Diagnostic = {
  sector: string; niche: string; audience: string; objective: string; obstacle: string;
  currentChannels: string[]; otherCurrentChannel: string; futureChannels: string[]; otherChannel: string;
  support: string; rhythm: string;
};

const EMPTY: Diagnostic = { sector: '', niche: '', audience: '', objective: '', obstacle: '', currentChannels: [], otherCurrentChannel: '', futureChannels: [], otherChannel: '', support: '', rhythm: '' };
const SECTORS = ['Commerce et e-commerce', 'Restauration et hôtellerie', 'Beauté, mode et bien-être', 'Santé et services à la personne', 'Immobilier, habitat et BTP', 'Éducation et formation', 'Culture, médias et événementiel', 'Agriculture et alimentation', 'Artisanat et industrie', 'Services professionnels et B2B', 'Technologie et services numériques', 'Association et institution', 'Autre activité'];
const AUDIENCES = ['Des particuliers près de chez moi', 'Des particuliers partout au Sénégal ou au-delà', 'Des entreprises ou des professionnels', 'Une communauté, des membres ou des bénéficiaires', 'Plusieurs publics ou je ne sais pas encore'];
const OBJECTIVES = ['Faire connaître mon activité', 'Recevoir plus de demandes ou de ventes', 'Mieux présenter mon offre', 'Fidéliser mes clients ou ma communauté', 'Lancer une offre ou un événement', 'Structurer la communication de mon équipe'];
const OBSTACLES = ['Je ne sais pas à qui parler ni quoi dire', 'Je manque de contenus ou de régularité', 'Je suis visible mais les contacts ne se transforment pas', 'Je ne sais pas quels canaux choisir', 'Je manque de temps ou de méthode', 'Autre difficulté'];
const CHANNEL_GROUPS = [
  { name: 'Réseaux et messageries', items: ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Snapchat', 'Pinterest', 'X / Twitter', 'WhatsApp Business', 'Telegram / autres messageries'] },
  { name: 'Canaux directs et recherche', items: ['Site web / SEO', 'Google Business Profile', 'E-mail / newsletter', 'SMS / téléphone', 'Marketplace / plateforme de vente', 'Publicité en ligne'] },
  { name: 'Terrain et médias', items: ['Bouche-à-oreille / recommandation', 'Événements / rencontres', 'Partenariats / prescripteurs', 'Affichage / supports imprimés', 'Presse / radio / télévision', 'Podcast / audio'] },
];
const inputClass = 'w-full bg-white border-2 border-outline-variant/50 px-4 py-3 text-base text-on-surface focus:border-on-surface focus:outline-none';

function toggle(items: string[], item: string) { return items.includes(item) ? items.filter((value) => value !== item) : [...items, item]; }
function recommendation(data: Diagnostic): OfferSlug | null {
  if (data.support === 'Je préfère en discuter avant de choisir' && data.rhythm === 'À définir ensemble') return null;
  if (data.support === 'Être conseillé et suivi pendant la mise en œuvre' || data.rhythm === 'Des points réguliers sur plusieurs mois') return 'accompagnement';
  if (data.support === 'Travailler une compétence précise' || data.rhythm === 'Une session courte') return 'ateliers';
  return 'formation-intensive';
}
function channelsToDiscuss(data: Diagnostic) {
  if (data.futureChannels.length) return data.futureChannels.slice(0, 3).join(', ');
  if (data.otherChannel.trim()) return data.otherChannel.trim();
  if (data.currentChannels.length) return data.currentChannels.slice(0, 3).join(', ');
  if (data.otherCurrentChannel.trim()) return data.otherCurrentChannel.trim();
  if (data.audience.includes('entreprises')) return 'LinkedIn, site web / SEO et contact direct';
  if (data.audience.includes('près de chez moi')) return 'Google Business Profile, recommandation et WhatsApp Business';
  return 'un canal de découverte et un canal de contact à choisir avec LOLLY';
}
function firstWork(obstacle: string) {
  if (obstacle.includes('contacts ne se transforment')) return 'Revoir la façon dont une personne passe de ton contenu à une prise de contact, puis la qualité des réponses et des relances.';
  if (obstacle.includes('contenus ou de régularité')) return 'Créer quelques thèmes utiles à tes clients et choisir un rythme de publication que tu peux réellement tenir.';
  if (obstacle.includes('quels canaux')) return 'Observer où tes clients te découvrent et te contactent avant d’investir du temps sur une nouvelle plateforme.';
  if (obstacle.includes('temps ou de méthode')) return 'Réduire le nombre de canaux actifs et réserver un créneau simple pour préparer et suivre les actions.';
  return 'Clarifier ton public, ta promesse et le message que tu veux qu’il retienne.';
}
function nextAction(obstacle: string) {
  if (obstacle.includes('contacts ne se transforment')) return 'Relis les cinq dernières demandes reçues : à quel moment la conversation s’est-elle arrêtée ?';
  if (obstacle.includes('contenus ou de régularité')) return 'Note trois questions que tes clients posent souvent : chacune peut devenir un contenu utile.';
  if (obstacle.includes('quels canaux')) return 'Demande à trois clients récents comment ils ont entendu parler de toi.';
  if (obstacle.includes('temps ou de méthode')) return 'Choisis un seul créneau hebdomadaire pour préparer tes messages et tes relances.';
  return 'Écris en une phrase pour qui est ton offre et quel problème concret elle résout.';
}
function diagnosticSummary(data: Diagnostic, channels: string) {
  return [
    'Diagnostic LOLLY Academy',
    `Activité : ${data.sector}${data.niche ? ` — ${data.niche}` : ''}`,
    `Public : ${data.audience}`, `Objectif : ${data.objective}`, `Frein : ${data.obstacle}`,
    `Canaux actuels : ${[...data.currentChannels, data.otherCurrentChannel].filter(Boolean).join(', ') || 'aucun indiqué'}`,
    `Canaux à explorer : ${data.futureChannels.join(', ') || 'à définir'}${data.otherChannel ? ` ; autre : ${data.otherChannel}` : ''}`,
    `Canaux à discuter : ${channels}`, `Besoin d’aide : ${data.support}`, `Rythme : ${data.rhythm}`,
  ].join('\n').slice(0, 1150);
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="grid gap-2"><span className="text-xs font-bold">{label}</span><select className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}><option value="">Choisir une réponse</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

export default function DiagnosticClient() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Diagnostic>(EMPTY);
  const [chosenSlug, setChosenSlug] = useState<OfferSlug | null>(null);
  const recommendedSlug = recommendation(data);
  const selectedOffer = OFFERS.find((offer) => offer.slug === (chosenSlug ?? recommendedSlug));
  const channelLine = channelsToDiscuss(data);
  const summary = diagnosticSummary(data, channelLine);
  const canContinue = step === 0 ? Boolean(data.sector && data.audience && (data.sector !== 'Autre activité' || data.niche.trim())) : step === 1 ? Boolean(data.objective && data.obstacle) : step === 4 ? Boolean(data.support && data.rhythm) : true;
  function update<K extends keyof Diagnostic>(key: K, value: Diagnostic[K]) { setData((current) => ({ ...current, [key]: value })); }
  function next() {
    if (!canContinue) return;
    if (step === 4) track('click_diagnostic_complete', { recommended: recommendedSlug, sector: data.sector });
    setStep((current) => Math.min(current + 1, 5));
  }
  function restart() { setData(EMPTY); setChosenSlug(null); setStep(0); }

  if (step < 5) return <section className="px-6 md:px-12 py-12 md:py-20 max-w-4xl mx-auto">
    <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">Diagnostic gratuit · environ 4 minutes</span>
    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.05]">Parlons d’abord de ton activité.</h1>
    <p className="mt-5 text-on-surface-variant max-w-2xl">Quel que soit ton domaine, nous regardons ton public, ton objectif et tes canaux avant de te conseiller un format.</p>
    <div className="mt-10 h-1.5 bg-outline-variant/30" role="progressbar" aria-label="Progression du diagnostic" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={5}><div className="h-full bg-on-surface transition-[width]" style={{ width: `${((step + 1) / 5) * 100}%` }} /></div>
    <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-secondary font-bold">Étape {step + 1} sur 5</p>
    {step === 0 && <div className="mt-8 grid gap-5">
      <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Ton activité et tes clients</h2>
      <SelectField label="Dans quel domaine travailles-tu ?" value={data.sector} options={SECTORS} onChange={(value) => update('sector', value)} />
      <label className="grid gap-2"><span className="text-xs font-bold">Ta niche ou ton activité exacte {data.sector === 'Autre activité' ? '(nécessaire pour préciser ton domaine)' : '(facultatif)'}</span><input className={inputClass} maxLength={100} placeholder="Ex. salon de coiffure, cabinet juridique, marque locale…" value={data.niche} onChange={(event) => update('niche', event.target.value)} /></label>
      <SelectField label="À qui veux-tu surtout parler ?" value={data.audience} options={AUDIENCES} onChange={(value) => update('audience', value)} />
    </div>}
    {step === 1 && <div className="mt-8 grid gap-5">
      <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Ce que tu veux changer</h2>
      <SelectField label="Ton objectif prioritaire" value={data.objective} options={OBJECTIVES} onChange={(value) => update('objective', value)} />
      <SelectField label="Ce qui te freine aujourd’hui" value={data.obstacle} options={OBSTACLES} onChange={(value) => update('obstacle', value)} />
    </div>}
    {(step === 2 || step === 3) && <div className="mt-8">
      <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">{step === 2 ? 'Où communiques-tu déjà ?' : 'Quels canaux souhaites-tu explorer ?'}</h2>
      <p className="mt-3 text-sm text-on-surface-variant">{step === 2 ? 'Choisis tous les canaux utilisés, même irrégulièrement. Si tu débutes, passe cette étape.' : 'Coche ceux qui t’intéressent. Aucun choix n’est obligatoire : LOLLY pourra t’aider à trier.'}</p>
      {CHANNEL_GROUPS.map((group) => <fieldset key={group.name} className="mt-6 border-t border-outline-variant/40 pt-4"><legend className="text-xs font-black uppercase tracking-wider">{group.name}</legend><div className="mt-3 grid sm:grid-cols-2 gap-2">{group.items.map((channel) => {
        const key = step === 2 ? 'currentChannels' : 'futureChannels';
        const checked = data[key].includes(channel);
        return <label key={channel} className={`flex items-center gap-3 border-2 px-4 py-3 cursor-pointer text-sm ${checked ? 'border-on-surface bg-primary-fixed/20' : 'border-outline-variant/40 bg-white'}`}><input type="checkbox" className="accent-black" checked={checked} onChange={() => update(key, toggle(data[key], channel))} />{channel}</label>;
      })}</div></fieldset>)}
      {step === 2 && <label className="mt-6 grid gap-2"><span className="text-xs font-bold">Un autre canal que tu utilises ? (facultatif)</span><input className={inputClass} maxLength={100} placeholder="Précise-le ici" value={data.otherCurrentChannel} onChange={(event) => update('otherCurrentChannel', event.target.value)} /></label>}
      {step === 3 && <label className="mt-6 grid gap-2"><span className="text-xs font-bold">Un autre canal en tête ? (facultatif)</span><input className={inputClass} maxLength={100} placeholder="Ex. réseau de revendeurs, application, porte-à-porte…" value={data.otherChannel} onChange={(event) => update('otherChannel', event.target.value)} /></label>}
    </div>}
    {step === 4 && <div className="mt-8 grid gap-5">
      <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Comment veux-tu avancer ?</h2>
      <SelectField label="De quelle aide as-tu besoin ?" value={data.support} options={['Travailler une compétence précise', 'Construire une méthode complète et devenir autonome', 'Être conseillé et suivi pendant la mise en œuvre', 'Je préfère en discuter avant de choisir']} onChange={(value) => update('support', value)} />
      <SelectField label="Quel rythme est réaliste pour toi ?" value={data.rhythm} options={['Une session courte', 'Cinq jours concentrés', 'Des points réguliers sur plusieurs mois', 'À définir ensemble']} onChange={(value) => update('rhythm', value)} />
    </div>}
    <div className="mt-9 flex flex-wrap items-center gap-5"><button type="button" onClick={next} disabled={!canContinue} className="bg-on-surface text-primary-fixed font-black uppercase px-7 py-4 text-xs tracking-[0.18em] disabled:opacity-40">{step === 4 ? 'Voir mon diagnostic →' : 'Continuer →'}</button>{step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)} className="text-xs uppercase tracking-wider font-bold">← Étape précédente</button>}</div>
  </section>;

  return <>
    <section className="px-6 md:px-12 py-12 md:py-20 max-w-4xl mx-auto">
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-3">Ton premier diagnostic</p>
      <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.05]">Une direction, pas une vente forcée.</h1>
      <p className="mt-5 text-on-surface-variant max-w-2xl">Cette lecture est une première orientation. Un échange avec LOLLY permettra de vérifier les priorités propres à ton activité.</p>
      <div className="mt-9 grid md:grid-cols-2 gap-px bg-outline-variant/30 border border-outline-variant/30">
        <div className="bg-white p-6"><p className="text-xs uppercase tracking-wider font-bold text-secondary">Ton point de départ</p><p className="mt-3 font-black">{data.niche || data.sector}</p><p className="mt-2 text-sm text-on-surface-variant">Public : {data.audience}</p><p className="mt-2 text-sm text-on-surface-variant">Priorité : {data.objective}</p></div>
        <div className="bg-white p-6"><p className="text-xs uppercase tracking-wider font-bold text-secondary">Le premier travail utile</p><p className="mt-3 text-sm">{firstWork(data.obstacle)}</p><p className="mt-2 text-sm text-on-surface-variant">Frein déclaré : {data.obstacle}</p></div>
        <div className="bg-white p-6"><p className="text-xs uppercase tracking-wider font-bold text-secondary">Canaux à examiner</p><p className="mt-3 font-black">{channelLine}</p><p className="mt-2 text-sm text-on-surface-variant">Il ne s’agit pas d’être partout : on choisira les canaux adaptés à tes clients et à tes moyens.</p></div>
        <div className="bg-white p-6"><p className="text-xs uppercase tracking-wider font-bold text-secondary">Prochaine action</p><p className="mt-3 text-sm">{nextAction(data.obstacle)}</p></div>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-3"><Link href={{ pathname: '/academy/inscription', query: { offre: 'conseil', diagnostic: summary } }} className="bg-on-surface text-primary-fixed font-black uppercase px-7 py-4 text-xs tracking-[0.18em] text-center">Parler de mon diagnostic →</Link><button type="button" onClick={restart} className="border-2 border-on-surface px-7 py-4 font-black uppercase text-xs tracking-[0.18em]">Recommencer</button></div>
      <p className="mt-3 text-xs text-secondary">La demande de conseil se fait sur le site, sans paiement. Ta synthèse sera ajoutée au message.</p>
    </section>
    <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-12 md:py-16"><div className="max-w-4xl mx-auto">
      <p className="text-xs font-black uppercase tracking-wider">Si tu souhaites te former</p><h2 className="mt-3 text-2xl md:text-4xl font-black uppercase tracking-tighter">{recommendedSlug ? `Le format à discuter : ${OFFERS.find((offer) => offer.slug === recommendedSlug)?.name}` : 'Le format reste à définir ensemble.'}</h2><p className="mt-3 text-sm md:text-base">Ce choix dépend de ton besoin de suivi et de ton rythme, pas de ton secteur. Il reste à confirmer ensemble.</p>
      <div className="mt-7 grid gap-3">{OFFERS.map((offer) => <button key={offer.slug} type="button" onClick={() => setChosenSlug(offer.slug)} aria-pressed={selectedOffer?.slug === offer.slug} className={`text-left p-5 border-2 ${selectedOffer?.slug === offer.slug ? 'border-on-surface bg-white/40' : 'border-on-surface/30 bg-white/10'}`}><span className="font-black uppercase">{offer.name}</span><span className="block mt-1 text-sm">{offer.eyebrow} · {offerPriceLabel(offer)}</span></button>)}</div>
      {selectedOffer && <div className="mt-7 flex flex-col sm:flex-row gap-3"><Link href={{ pathname: '/academy/inscription', query: { offre: selectedOffer.slug, diagnostic: summary } }} className="bg-on-surface text-primary-fixed font-black uppercase px-7 py-4 text-xs tracking-[0.18em] text-center">Demander ce format →</Link><Link href={`/academy/${selectedOffer.slug}`} className="border-2 border-on-surface px-7 py-4 font-black uppercase text-xs tracking-[0.18em] text-center">Voir le détail</Link></div>}
    </div></section>
  </>;
}
