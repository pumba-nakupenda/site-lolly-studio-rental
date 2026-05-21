'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  OFFERS,
  conseilWhatsappUrl,
  diagnosticWhatsappUrl,
  priceFrom,
  fmtPrice,
} from '../_lib/offers';
import { track } from '../_components/Track';

const QUESTIONS = [
  {
    q: 'Où tu en es avec ta com aujourd’hui ?',
    options: [
      { label: 'Je débute, je vends sur les réseaux mais rien ne décolle', scores: { fondations: 3 } },
      { label: 'J’avais commencé, j’ai abandonné par stress', scores: { 'reprise-en-main': 3 } },
      { label: 'Ça tourne mais je m’épuise à tout faire seul·e', scores: { pilotage: 3 } },
      { label: 'L’entreprise repose entièrement sur moi, je veux transmettre', scores: { posture: 3 } },
    ],
  },
  {
    q: 'Tu publies à quelle fréquence en ce moment ?',
    options: [
      { label: 'Tous les jours, mais sans résultats', scores: { fondations: 2 } },
      { label: 'Rarement, ça s’est arrêté il y a un moment', scores: { 'reprise-en-main': 2 } },
      { label: 'Très souvent, je porte tout', scores: { pilotage: 2 } },
      { label: 'Mon équipe publie, mais sans cohérence avec ma voix', scores: { posture: 2 } },
    ],
  },
  {
    q: 'Tu as combien de personnes qui t’aident sur la com ?',
    options: [
      { label: 'Personne, je fais tout', scores: { fondations: 1, 'reprise-en-main': 1, pilotage: 1 } },
      { label: 'Un·e freelance ou un·e CM', scores: { pilotage: 2 } },
      { label: 'Une équipe de 2-5 personnes', scores: { pilotage: 2, posture: 2 } },
      { label: 'Une équipe de plus de 5 personnes', scores: { posture: 3 } },
    ],
  },
  {
    q: 'Le frein principal que tu sens en ce moment ?',
    options: [
      { label: 'Je ne sais pas vraiment comment parler à mon client en ligne', scores: { fondations: 2 } },
      { label: 'La motivation, j’en peux plus de produire', scores: { 'reprise-en-main': 2 } },
      { label: 'Je dois déléguer mais je ne sais pas comment ni à qui', scores: { pilotage: 2 } },
      { label: 'Mon équipe n’a pas le bon discours quand je ne suis pas là', scores: { posture: 2 } },
    ],
  },
  {
    q: 'Budget que tu peux investir maintenant ?',
    options: [
      { label: '30 à 50 000 XOF', scores: { fondations: 2 } },
      { label: '75 à 120 000 XOF', scores: { 'reprise-en-main': 2, pilotage: 1 } },
      { label: '120 à 200 000 XOF', scores: { pilotage: 2 } },
      { label: 'Plus de 300 000 XOF', scores: { posture: 3 } },
    ],
  },
];

type OfferSlug = 'fondations' | 'reprise-en-main' | 'pilotage' | 'posture';
type Scores = Record<OfferSlug, number>;

function computeRecommendation(answers: (number | null)[]) {
  const scores: Scores = { fondations: 0, 'reprise-en-main': 0, pilotage: 0, posture: 0 };
  answers.forEach((idx, qIdx) => {
    if (idx == null) return;
    const opt = QUESTIONS[qIdx].options[idx];
    Object.entries(opt.scores).forEach(([slug, pts]) => {
      scores[slug as OfferSlug] += pts as number;
    });
  });
  const sorted = (Object.entries(scores) as [OfferSlug, number][]).sort(
    ([, a], [, b]) => b - a,
  );
  return { topSlug: sorted[0][0], scores, sorted };
}

export default function DiagnosticClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const done = step >= QUESTIONS.length;
  const progress = Math.round((step / QUESTIONS.length) * 100);

  const recommendation = useMemo(
    () => (done ? computeRecommendation(answers) : null),
    [done, answers],
  );
  const recommendedOffer = recommendation
    ? OFFERS.find((o) => o.slug === recommendation.topSlug)
    : null;

  // Formation choisie par l'utilisateur (par défaut la recommandée).
  // Il peut basculer vers une autre, notamment moins chère.
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  useEffect(() => {
    if (recommendation) setSelectedSlug(recommendation.topSlug);
  }, [recommendation]);
  const selectedOffer =
    OFFERS.find((o) => o.slug === selectedSlug) || recommendedOffer;

  // Formations classées par score décroissant pour l'affichage.
  const rankedOffers = recommendation
    ? recommendation.sorted
        .map(([slug]) => OFFERS.find((o) => o.slug === slug))
        .filter((o): o is (typeof OFFERS)[number] => Boolean(o))
    : [];

  function answer(optIdx: number) {
    const next = [...answers];
    next[step] = optIdx;
    setAnswers(next);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= QUESTIONS.length) {
      const result = computeRecommendation(next);
      track('click_diagnostic_complete', { recommended: result.topSlug });
    }
  }

  function restart() {
    setStep(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSelectedSlug(null);
  }

  return (
    <>
      <section className="px-6 md:px-12 pt-10 md:pt-14 pb-6 max-w-3xl mx-auto">
        <span className="inline-block bg-primary-fixed text-on-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">
          Diagnostic 2 minutes
        </span>

        {!done && (
          <>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-on-surface mb-4 leading-[1.05]">
              5 questions pour situer ta com
            </h1>
            <p className="text-base text-on-surface-variant">
              Sois honnête, c’est anonyme. À la fin tu obtiens une recommandation d’offre.
            </p>

            <div className="mt-10">
              <div className="h-1.5 bg-outline-variant/30 overflow-hidden">
                <div
                  className="h-full bg-on-surface transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-secondary font-bold">
                Question {step + 1} sur {QUESTIONS.length}
              </p>
            </div>
          </>
        )}
      </section>

      {!done && (
        <section className="px-6 md:px-12 pb-16 max-w-3xl mx-auto">
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-on-surface mb-6">
            {QUESTIONS[step].q}
          </h2>
          <div className="grid gap-3">
            {QUESTIONS[step].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => answer(idx)}
                className="text-left bg-surface-container-lowest border-2 border-outline-variant/40 hover:border-on-surface hover:bg-primary-fixed/10 transition-all px-5 py-4 text-sm md:text-base text-on-surface"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-[0.65rem] uppercase tracking-[0.18em] text-secondary hover:text-on-surface font-bold transition-colors"
            >
              ← Question précédente
            </button>
          )}
        </section>
      )}

      {done && recommendedOffer && selectedOffer && recommendation && (
        <>
          <section className="px-6 md:px-12 pt-6 pb-10 md:pb-12 max-w-4xl mx-auto">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-3">
              Recommandation
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-on-surface leading-[1.05]">
              {recommendedOffer.cardTitle}
            </h1>
            <p className="mt-5 text-base md:text-lg text-on-surface-variant max-w-2xl">
              Au vu de tes réponses, l’offre <strong>{recommendedOffer.level} — {recommendedOffer.name}</strong> est celle qui te correspond le mieux. Tu peux la garder ou choisir une formation plus accessible ci-dessous.
            </p>
          </section>

          {/* ── Choix de la formation (sélectionnable) ─────── */}
          <section className="px-6 md:px-12 pb-10 max-w-4xl mx-auto">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-5">
              Choisis ta formation
            </p>
            <div className="grid gap-3">
              {rankedOffers.map((o, i) => {
                const isSelected = o.slug === selectedOffer.slug;
                const isRecommended = i === 0;
                return (
                  <button
                    key={o.slug}
                    onClick={() => {
                      setSelectedSlug(o.slug);
                      track('diagnostic_select_offer', { offer: o.slug });
                    }}
                    className={`text-left p-5 border-2 transition-all ${
                      isSelected
                        ? 'border-on-surface bg-primary-fixed/10'
                        : 'border-outline-variant/40 bg-surface-container-lowest hover:border-on-surface'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="text-sm md:text-base font-black uppercase tracking-tight text-on-surface">
                        {o.level} — {o.name}
                        {isRecommended && (
                          <span className="ml-2 text-[0.55rem] tracking-[0.18em] bg-on-surface text-primary-fixed px-2 py-0.5 align-middle">
                            Recommandé
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-black text-primary tracking-tight whitespace-nowrap">
                        à partir de {fmtPrice(priceFrom(o))}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-secondary">{o.metaShort}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── CTA WhatsApp avec formation choisie ───────── */}
          <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-12 md:py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">
                Ton choix : {selectedOffer.name}
              </h2>
              <p className="mt-3 text-base md:text-lg">
                À partir de <strong>{fmtPrice(priceFrom(selectedOffer))}</strong>. On confirme ton inscription par WhatsApp en moins de 24 h ouvrées.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={diagnosticWhatsappUrl(selectedOffer)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track(`click_reserver_paiement_wave_${selectedOffer.slug.replace(/-/g, '_')}`, {
                      channel: 'whatsapp',
                      from: 'diagnostic',
                    })
                  }
                  className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface/80 transition-colors"
                >
                  M’inscrire via WhatsApp →
                </a>
                <Link
                  href={`/academy/${selectedOffer.slug}`}
                  onClick={() =>
                    track('click_diagnostic_to_offer', { offer: selectedOffer.slug })
                  }
                  className="border-2 border-on-surface text-on-surface font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface hover:text-primary-fixed transition-colors"
                >
                  Voir le détail
                </Link>
              </div>
              <a
                href={conseilWhatsappUrl(selectedOffer)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track('click_conseil_30min', { via: 'whatsapp', from: 'diagnostic' })
                }
                className="mt-5 inline-block text-xs uppercase tracking-[0.18em] font-bold border-b-2 border-on-primary-fixed pb-1 hover:opacity-70 transition-opacity"
              >
                Ou un conseil 30 min avant de décider →
              </a>
            </div>
          </section>

          <section className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
            <button
              onClick={restart}
              className="text-[0.65rem] uppercase tracking-[0.18em] font-bold text-on-surface hover:text-primary transition-colors"
            >
              ↻ Refaire le diagnostic
            </button>
          </section>
        </>
      )}
    </>
  );
}
