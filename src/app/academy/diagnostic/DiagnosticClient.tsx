'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { OFFERS, conseilWhatsappUrl } from '../_lib/offers';
import { track } from '../_components/Track';
import CTAButton from '../_components/CTAButton';
import Footer from '../_components/Footer';

// Chaque réponse incrémente le score d'une ou plusieurs offres (par slug).
// L'offre avec le score le plus élevé est recommandée à la fin.
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
  const top = sorted[0][0];
  return { topSlug: top, scores, sorted };
}

export default function DiagnosticClient() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 puis "done"
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const done = step >= QUESTIONS.length;
  const progress = Math.round(((step) / QUESTIONS.length) * 100);

  const recommendation = useMemo(() => (done ? computeRecommendation(answers) : null), [done, answers]);
  const offer = recommendation ? OFFERS.find((o) => o.slug === recommendation.topSlug) : null;

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
  }

  return (
    <main>
      <section
        style={{
          padding: '40px 24px 24px',
          maxWidth: 720,
          margin: '0 auto',
        }}
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
          Diagnostic 2 minutes
        </p>

        {!done && (
          <>
            <h1
              className="academy-display"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#000', marginBottom: 16 }}
            >
              5 questions pour situer ta com
            </h1>
            <p className="academy-body" style={{ color: '#3A3A3A', fontSize: '1rem' }}>
              Sois honnête, c’est anonyme. À la fin tu obtiens une recommandation d’offre.
            </p>

            <div
              aria-label="Progression"
              style={{
                height: 6,
                background: 'rgba(0,0,0,0.08)',
                borderRadius: 999,
                overflow: 'hidden',
                marginTop: 32,
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: '#000',
                  transition: 'width .3s ease',
                }}
              />
            </div>
            <p
              className="academy-body"
              style={{ marginTop: 8, fontSize: 12, letterSpacing: '0.12em', color: '#6B6B6B', textTransform: 'uppercase' }}
            >
              Question {step + 1} sur {QUESTIONS.length}
            </p>
          </>
        )}
      </section>

      {!done && (
        <section style={{ padding: '0 24px 64px', maxWidth: 720, margin: '0 auto' }}>
          <h2
            className="academy-display"
            style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', color: '#000', marginBottom: 24 }}
          >
            {QUESTIONS[step].q}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {QUESTIONS[step].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => answer(idx)}
                style={{
                  textAlign: 'left',
                  background: '#FFFFFF',
                  border: '2px solid rgba(0,0,0,0.12)',
                  padding: '18px 20px',
                  fontFamily: 'var(--font-lato, "Lato", sans-serif)',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  color: '#000',
                  transition: 'border-color .15s ease, background .15s ease, transform .15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = '#FFFDF0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                marginTop: 24,
                background: 'transparent',
                border: 'none',
                color: '#6B6B6B',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              ← Question précédente
            </button>
          )}
        </section>
      )}

      {done && offer && recommendation && (
        <>
          <section
            style={{
              padding: '40px 24px 56px',
              maxWidth: 820,
              margin: '0 auto',
            }}
          >
            <p
              className="academy-body"
              style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B6B', fontWeight: 700 }}
            >
              Recommandation
            </p>
            <h1
              className="academy-display"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#000', marginTop: 12 }}
            >
              {offer.cardTitle}
            </h1>
            <p
              className="academy-body"
              style={{ marginTop: 16, fontSize: '1.15rem', color: '#3A3A3A', maxWidth: 720 }}
            >
              Au vu de tes réponses, l’offre <strong>{offer.level} — {offer.name}</strong> est celle qui correspond le mieux à ta situation actuelle.
            </p>
            <p className="academy-body" style={{ marginTop: 12, fontSize: 14, color: '#6B6B6B' }}>
              {offer.meta}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
              <CTAButton
                href={`/academy/${offer.slug}`}
                variant="primary"
                size="lg"
                event="click_diagnostic_to_offer"
                eventProps={{ offer: offer.slug }}
              >
                Voir l’offre {offer.name} →
              </CTAButton>
              <CTAButton
                href={conseilWhatsappUrl(offer)}
                variant="outline"
                size="lg"
                external
                event="click_conseil_30min"
                eventProps={{ via: 'whatsapp', from: 'diagnostic' }}
              >
                Conseil 30 min avant inscription
              </CTAButton>
            </div>
          </section>

          <section
            style={{
              background: '#FFFFFF',
              padding: '48px 24px',
              borderTop: '1px solid rgba(0,0,0,0.08)',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ maxWidth: 820, margin: '0 auto' }}>
              <p
                className="academy-body"
                style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6B6B6B', fontWeight: 700, marginBottom: 16 }}
              >
                Tes autres options
              </p>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
                {recommendation.sorted.slice(1).map(([slug, score]) => {
                  const o = OFFERS.find((x) => x.slug === slug);
                  if (!o) return null;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/academy/${o.slug}`}
                        className="academy-body"
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px dashed rgba(0,0,0,0.08)', color: '#000', textDecoration: 'none' }}
                      >
                        <span style={{ fontSize: 14 }}>
                          <strong>{o.level} — {o.name}</strong> · {o.metaShort}
                        </span>
                        <span style={{ fontSize: 12, color: '#6B6B6B' }}>{score} pts →</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={restart}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#000',
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ↻ Refaire le diagnostic
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
