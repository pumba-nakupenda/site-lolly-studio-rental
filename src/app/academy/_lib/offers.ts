// Données centrales des 4 offres LOLLY Academy.
// Source : BRIEF_PAGE_CARTE_ACADEMY.md + PLAN_LANCEMENT_LOLLY_ACADEMY_2026 v3.

export type Offer = {
  slug: 'fondations' | 'reprise-en-main' | 'pilotage' | 'posture';
  level: 'N0' | 'N1' | 'N2' | 'N3';
  name: string;
  cardTitle: string;
  cardLead: string;
  meta: string;
  metaShort: string;
  priceFull: number;
  priceEarly: number | null;
  durationLine: string;
  promiseHeadline: string;
  problemBody: string[];
  programme: string[];
  format: string[];
  waveText: string;
};

export const OFFERS: Offer[] = [
  {
    slug: 'fondations',
    level: 'N0',
    name: 'FONDATIONS',
    cardTitle: 'Tu vends sur les réseaux mais rien ne décolle.',
    cardLead:
      'Stories quotidiennes, promos lancées, DM envoyés — et toujours pas de ventes. Les réseaux, ce n’est pas comme le marché. Tu n’as pas appris comment ça marche vraiment.',
    meta: '5 jours intensifs · cohorte en ligne live · 50 000 XOF (early bird 35 000 XOF)',
    metaShort: '5 jours · 50 000 XOF',
    priceFull: 50000,
    priceEarly: 35000,
    durationLine: '5 jours intensifs · sessions live en visio',
    promiseHeadline:
      'À la fin de la semaine, tu sais exactement comment transformer un follower en client.',
    problemBody: [
      'Tu publies tous les jours et tu sens que rien ne bouge. Pas un DM sérieux, pas une vente. Tu commences à te demander si ce n’est pas toi le problème.',
      'Le marché, tu sais le tenir. Tu sens les gens, tu négocies, tu conclus. Mais sur les réseaux les codes sont inversés : ce n’est pas la voix qui vend, c’est la régularité, l’angle, la preuve. Personne ne te l’a appris.',
    ],
    programme: [
      'Comprendre la logique d’un feed et d’un algorithme',
      'Construire un message clair qui parle à un seul client idéal',
      'Le format qui te ressemble : reel, story, photo, audio',
      'Le pipeline DM → catalogue → commande',
      'Les preuves sociales : témoignages, before/after, lives',
    ],
    format: [
      '5 sessions live (2h chacune) du lundi au vendredi, 18h00-20h00 Dakar',
      'Replays disponibles 30 jours',
      'Communauté WhatsApp dédiée à la cohorte',
      'Exercice quotidien à publier — feedback du formateur',
    ],
    waveText:
      'Bonjour LOLLY Academy, je souhaite m’inscrire à la formation FONDATIONS (5 jours, early bird 35 000 XOF). Voici mes coordonnées : Nom — Prénom — WhatsApp — Email. Merci.',
  },
  {
    slug: 'reprise-en-main',
    level: 'N1',
    name: 'REPRISE EN MAIN',
    cardTitle: 'Tu avais commencé, tu as abandonné par stress.',
    cardLead:
      'Tu publiais, tu prospectais, tu y croyais. Puis ça s’est arrêté. Pas parce que tu es paresseux. Parce que c’était devenu trop, et que tu ne savais pas conclure tes ventes.',
    meta: '4 semaines · cohorte en ligne live · 100 000 XOF (early bird 75 000 XOF)',
    metaShort: '4 semaines · 100 000 XOF',
    priceFull: 100000,
    priceEarly: 75000,
    durationLine: '4 semaines · 2 sessions live par semaine + suivi',
    promiseHeadline:
      'Tu remets ta com en route avec un rythme tenable et un système de vente qui n’a plus besoin de toi 24/7.',
    problemBody: [
      'Tu te souviens du moment où tu y croyais. Tu publiais, tu prospectais, tu répondais. Et puis le mur. Tu n’avais plus la tête à ça, plus le souffle. Ça s’est éteint sans bruit.',
      'Le problème n’était pas ta motivation. Le problème était que personne ne t’avait montré comment installer un système qui tient sans toi. On va le faire ensemble — calmement, en 4 semaines.',
    ],
    programme: [
      'Diagnostic : pourquoi tu as lâché, ce qu’il faut récupérer',
      'Calendrier éditorial minimum viable (3 publications / semaine)',
      'Scripts DM pour faire repartir le pipeline froid',
      'Conclusion de vente : le moment où ça bascule',
      'Routine hebdomadaire — 4 h par semaine maximum',
    ],
    format: [
      '8 sessions live sur 4 semaines (mardi + jeudi, 19h-20h30)',
      'Replays + ressources PDF',
      'WhatsApp dédié + 1 appel de suivi en fin de cycle',
      'Audit complet de ta page à l’entrée',
    ],
    waveText:
      'Bonjour LOLLY Academy, je souhaite m’inscrire à la formation REPRISE EN MAIN (4 semaines, early bird 75 000 XOF). Voici mes coordonnées : Nom — Prénom — WhatsApp — Email. Merci.',
  },
  {
    slug: 'pilotage',
    level: 'N2',
    name: 'PILOTAGE',
    cardTitle: 'Ta communication tourne, mais tu t’épuises à tout porter.',
    cardLead:
      'Tu publies, tu réponds, tu relances, tu produis. Et personne ne peut le faire à ta place. Tu veux automatiser, contrôler avec les bons outils, reprendre la main.',
    meta: '12 semaines · parcours + suivi mensuel · 150 000 XOF (early bird 120 000 XOF)',
    metaShort: '12 semaines · 150 000 XOF',
    priceFull: 150000,
    priceEarly: 120000,
    durationLine: '12 semaines · 1 atelier hebdo + 3 coaching individuels',
    promiseHeadline:
      'Tu sors avec une équipe (ou un freelance), des outils qui tournent seuls, et ton temps récupéré.',
    problemBody: [
      'Tu produis tout, tu valides tout, tu réponds à tout. Ta com fonctionne précisément parce que tu portes tout — et c’est exactement ce qui t’empêche de scaler.',
      'En 12 semaines on installe les outils, les procédures, les indicateurs et la posture qui te permettent de déléguer sans perdre le contrôle. Tu redeviens directeur, pas exécutant.',
    ],
    programme: [
      'Cartographie de ta com : ce que toi seul peux faire vs ce qui peut sortir',
      'Outils : Notion, Airtable, Buffer/Metricool, ManyChat, IA assistante',
      'Scripts SOP — chaque tâche documentée, transférable',
      'Recrutement : community manager, monteur, prospecteur',
      'Indicateurs hebdo : ce que tu regardes pour piloter',
    ],
    format: [
      '12 ateliers live (mercredi 18h-20h)',
      '3 coachings individuels 1:1 (45 min)',
      'Bibliothèque de templates LOLLY (Notion, Airtable, scripts DM)',
      'Communauté WhatsApp Pilotage + revue mensuelle',
    ],
    waveText:
      'Bonjour LOLLY Academy, je souhaite m’inscrire à la formation PILOTAGE (12 semaines, early bird 120 000 XOF). Voici mes coordonnées : Nom — Prénom — WhatsApp — Email. Merci.',
  },
  {
    slug: 'posture',
    level: 'N3',
    name: 'POSTURE',
    cardTitle: 'Tu portes ton entreprise sur tes épaules.',
    cardLead:
      'Tu veux que tes équipes parlent de ta marque avec la même posture que toi. Que ta com tourne aussi quand tu n’es pas là. Ça ne s’improvise pas — ça se transmet.',
    meta: '6 à 8 semaines · coaching dirigeant + atelier équipe · à partir de 300 000 XOF',
    metaShort: '6-8 semaines · dès 300 000 XOF',
    priceFull: 300000,
    priceEarly: null,
    durationLine: '6 à 8 semaines · coaching dirigeant 1:1 + atelier équipe',
    promiseHeadline:
      'Tes équipes portent ta voix avec la même conviction que toi. Ta com tourne même quand tu n’es pas dans la pièce.',
    problemBody: [
      'Ton entreprise marche parce que tu es là. Tu fais les appels stratégiques, tu trouves les bons mots, tu rassures les clients. Quand tu pars en voyage, tout ralentit.',
      'POSTURE est un programme sur mesure : coaching dirigeant 1:1 pour clarifier ta voix, puis atelier équipe pour la transmettre. À la sortie, ta marque a une signature partageable, pas juste une intuition logée dans ta tête.',
    ],
    programme: [
      'Audit dirigeant : ta voix, tes convictions, ce qui fait ta différence',
      'Manifeste de marque + charte de prise de parole interne',
      'Atelier équipe (2 jours) : transmettre la posture LOLLY',
      'Scripts de gestion de crise + porte-parole secondaire',
      'Plan de mesure et de suivi sur 90 jours après le programme',
    ],
    format: [
      '6 à 8 séances 1:1 dirigeant (selon profil)',
      '1 atelier équipe (2 jours, présentiel Dakar ou hybride)',
      'Livrables documentés : manifeste, charte interne, scripts',
      'Suivi trimestriel après livraison',
    ],
    waveText:
      'Bonjour LOLLY Academy, je souhaite échanger sur le programme POSTURE (sur mesure, à partir de 300 000 XOF). Voici mes coordonnées : Nom — Prénom — WhatsApp — Email — Entreprise. Merci.',
  },
];

export function getOffer(slug: string): Offer | undefined {
  return OFFERS.find((o) => o.slug === slug);
}

export const CONTACT = {
  whatsapp: '+221772354747',
  whatsappDigits: '221772354747',
  email: 'oudama@lolly.sn',
  calendly: 'https://calendly.com/lolly-sn/conseil-30min',
  city: 'Dakar, Sénégal',
};

export function reserveWhatsappUrl(offer: Offer): string {
  const text = encodeURIComponent(offer.waveText);
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${text}`;
}

export function conseilWhatsappUrl(offer: Offer | null): string {
  const text = encodeURIComponent(
    offer
      ? `Bonjour LOLLY Academy, je voudrais réserver un conseil 30 min avant de m’inscrire à ${offer.name}. Mes coordonnées : Nom — WhatsApp — Email.`
      : 'Bonjour LOLLY Academy, je voudrais réserver un conseil 30 min pour choisir l’offre qui me correspond. Mes coordonnées : Nom — WhatsApp — Email.',
  );
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${text}`;
}

export function fmtPrice(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' XOF';
}
