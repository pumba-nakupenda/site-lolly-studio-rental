'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { OFFERS, diagnosticWhatsappUrl, offerPriceLabel, type Offer } from '../_lib/offers';
import { track } from '../_components/Track';

type OfferSlug = Offer['slug'];
type Score = Partial<Record<OfferSlug, number>>;

const QUESTIONS: { q: string; options: { label: string; scores: Score }[] }[] = [
  {
    q: 'Quel résultat cherches-tu maintenant ?',
    options: [
      { label: 'Poser des bases solides et construire mon plan de communication', scores: { 'formation-intensive': 4 } },
      { label: 'Être suivi dans l’exécution et obtenir des résultats durables', scores: { accompagnement: 4 } },
      { label: 'Débloquer une compétence précise', scores: { ateliers: 4 } },
    ],
  },
  {
    q: 'Combien de temps veux-tu consacrer au parcours ?',
    options: [
      { label: 'Une session courte et ciblée', scores: { ateliers: 3 } },
      { label: 'Une semaine intensive', scores: { 'formation-intensive': 3 } },
      { label: 'Plusieurs mois pour installer une méthode', scores: { accompagnement: 3 } },
    ],
  },
  {
    q: 'De quel niveau de suivi as-tu besoin ?',
    options: [
      { label: 'Un atelier pratique et une correction sur place', scores: { ateliers: 3 } },
      { label: 'Un cadre complet pour devenir autonome', scores: { 'formation-intensive': 3 } },
      { label: 'Des points réguliers pour rester dans l’action', scores: { accompagnement: 3 } },
    ],
  },
  {
    q: 'Quel budget correspond le mieux à ton besoin actuel ?',
    options: [
      { label: '25 000 XOF pour un atelier', scores: { ateliers: 3 } },
      { label: '75 000 XOF pour cinq jours', scores: { 'formation-intensive': 3 } },
      { label: 'À partir de 85 000 XOF pour un suivi long', scores: { accompagnement: 3 } },
    ],
  },
];

function computeRecommendation(answers: (number | null)[]) {
  const scores: Record<OfferSlug, number> = { 'formation-intensive': 0, accompagnement: 0, ateliers: 0 };
  answers.forEach((optionIndex, questionIndex) => {
    if (optionIndex === null) return;
    Object.entries(QUESTIONS[questionIndex].options[optionIndex].scores).forEach(([slug, points]) => {
      scores[slug as OfferSlug] += points ?? 0;
    });
  });
  return (Object.entries(scores) as [OfferSlug, number][]).sort(([, a], [, b]) => b - a);
}

export default function DiagnosticClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [chosenSlug, setChosenSlug] = useState<OfferSlug | null>(null);
  const done = step >= QUESTIONS.length;
  const ranking = useMemo(() => (done ? computeRecommendation(answers) : []), [answers, done]);
  const recommendedSlug = ranking[0]?.[0];
  const selectedSlug = chosenSlug ?? recommendedSlug;
  const selectedOffer = OFFERS.find((offer) => offer.slug === selectedSlug);

  function answer(optionIndex: number) {
    const nextAnswers = [...answers];
    nextAnswers[step] = optionIndex;
    setAnswers(nextAnswers);
    if (step + 1 === QUESTIONS.length) {
      track('click_diagnostic_complete', { recommended: computeRecommendation(nextAnswers)[0][0] });
    }
    setStep(step + 1);
  }

  function restart() {
    setStep(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setChosenSlug(null);
  }

  if (!done) {
    return (
      <section className="px-6 md:px-12 py-12 md:py-20 max-w-3xl mx-auto">
        <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">Diagnostic · 2 minutes</span>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[1.05]">Trouve le format qui correspond à ton prochain objectif.</h1>
        <div className="mt-10 h-1.5 bg-outline-variant/30"><div className="h-full bg-on-surface transition-[width]" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} /></div>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-secondary font-bold">Question {step + 1} sur {QUESTIONS.length}</p>
        <h2 className="mt-8 text-xl md:text-3xl font-black uppercase tracking-tighter">{QUESTIONS[step].q}</h2>
        <div className="mt-6 grid gap-3">
          {QUESTIONS[step].options.map((option, index) => <button key={option.label} type="button" onClick={() => answer(index)} className="text-left bg-white border-2 border-outline-variant/40 hover:border-on-surface px-5 py-4 text-sm md:text-base">{option.label}</button>)}
        </div>
        {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="mt-6 text-[0.65rem] uppercase tracking-[0.18em] text-secondary font-bold">← Question précédente</button>}
      </section>
    );
  }

  if (!selectedOffer) return null;
  return (
    <>
      <section className="px-6 md:px-12 py-12 md:py-20 max-w-4xl mx-auto">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-3">Notre recommandation</p>
        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05]">{OFFERS.find((offer) => offer.slug === recommendedSlug)?.name}</h1>
        <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl">C’est le format le plus cohérent avec tes réponses. Compare les trois options ci-dessous avant de décider.</p>
        <div className="mt-10 grid gap-3">
          {OFFERS.map((offer) => <button key={offer.slug} type="button" onClick={() => setChosenSlug(offer.slug)} className={`text-left p-5 border-2 ${selectedOffer.slug === offer.slug ? 'border-on-surface bg-primary-fixed/10' : 'border-outline-variant/40 bg-white'}`}><span className="font-black uppercase">{offer.name}</span><span className="block mt-1 text-sm text-secondary">{offer.eyebrow} · {offerPriceLabel(offer)}</span></button>)}
        </div>
      </section>
      <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Ton choix : {selectedOffer.name}</h2>
          <p className="mt-3 text-base md:text-lg">{offerPriceLabel(selectedOffer)}. L’équipe confirme les prochaines disponibilités avant l’inscription définitive.</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link href={`/academy/inscription?offre=${selectedOffer.slug}`} className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em]">Envoyer ma demande d’inscription →</Link>
            <Link href={`/academy/${selectedOffer.slug}`} className="border-2 border-on-surface font-black uppercase px-8 py-4 text-xs tracking-[0.18em]">Voir le détail</Link>
          </div>
          <a href={diagnosticWhatsappUrl(selectedOffer)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-xs uppercase tracking-[0.18em] font-bold border-b-2 border-on-primary-fixed pb-1">Parler de cette recommandation sur WhatsApp →</a>
        </div>
      </section>
      <section className="px-6 md:px-12 py-10 max-w-4xl mx-auto"><button type="button" onClick={restart} className="text-[0.65rem] uppercase tracking-[0.18em] font-bold">↻ Refaire le diagnostic</button></section>
    </>
  );
}
