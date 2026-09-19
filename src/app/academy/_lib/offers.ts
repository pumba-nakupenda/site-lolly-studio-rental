export type Workshop = { title: string; description: string };

export type Offer = {
  slug: 'formation-intensive' | 'accompagnement' | 'ateliers';
  eyebrow: string;
  name: string;
  cardTitle: string;
  cardLead: string;
  price: number;
  pricePrefix?: string;
  priceSuffix?: string;
  durationLine: string;
  promiseHeadline: string;
  problemBody: string[];
  programme: string[];
  format: string[];
  waveText: string;
  featured?: boolean;
  workshops?: Workshop[];
};

export const WORKSHOPS: Workshop[] = [
  { title: 'Stratégie digitale & positionnement', description: 'Clarifier sa cible, sa promesse et les canaux qui méritent vraiment du temps.' },
  { title: 'Créer du contenu au smartphone', description: 'Préparer, tourner et monter des contenus propres avec les moyens disponibles.' },
  { title: 'Instagram & TikTok', description: 'Choisir les bons formats et construire une présence régulière sans publier au hasard.' },
  { title: 'WhatsApp Business & vente', description: 'Transformer les conversations en demandes, relances et commandes mieux suivies.' },
  { title: 'Copywriting & storytelling', description: 'Écrire des messages plus clairs, crédibles et capables de faire passer à l’action.' },
  { title: 'Community management', description: 'Organiser un calendrier éditorial, animer une communauté et répondre avec méthode.' },
  { title: 'Publicité Meta', description: 'Préparer une campagne simple et lire les résultats pour éviter de dépenser à l’aveugle.' },
  { title: 'IA pratique pour la communication', description: 'Accélérer la préparation des contenus sans perdre sa voix, son jugement ni son identité.' },
];

export const EVENT_TOPICS = [
  'Créer du contenu pour les réseaux sociaux',
  'Présenter son business avec clarté',
  'Filmer et monter avec son smartphone',
  'Transformer WhatsApp en outil de vente',
  'Organiser un mois de communication',
  'Écrire des contenus qui donnent envie d’agir',
] as const;

export const OFFERS: Offer[] = [
  {
    slug: 'formation-intensive', eyebrow: '5 jours', name: 'Formation intensive', featured: true,
    cardTitle: 'Cinq jours pour rendre ta communication plus claire et plus utile à la vente.',
    cardLead: 'Un parcours concentré pour poser les bases, produire avec méthode et repartir avec un plan d’action applicable dès la semaine suivante.',
    price: 75000,
    durationLine: '5 jours de formation · exercices appliqués · plan d’action final',
    promiseHeadline: 'Tu repars avec un message clair, des contenus prêts à produire et une méthode de vente que tu peux répéter.',
    problemBody: [
      'Tu communiques, mais les actions restent dispersées : un post aujourd’hui, une promotion demain, puis plus rien quand l’activité devient chargée.',
      'Pendant cinq jours, on remet chaque élément dans le bon ordre : la cible, le message, le contenu, la conversion et le suivi. Chaque notion est appliquée à ton activité.',
    ],
    programme: [
      'Jour 1 — Positionnement, cible et promesse commerciale',
      'Jour 2 — Ligne éditoriale et contenus qui attirent l’attention',
      'Jour 3 — Production au smartphone et organisation du calendrier',
      'Jour 4 — WhatsApp Business, prise de contact et relance',
      'Jour 5 — Plan de communication et feuille de route sur 30 jours',
    ],
    format: ['Apports courts suivis d’exercices sur ton activité', 'Corrections et retours concrets pendant la formation', 'Supports de travail réutilisables après les cinq jours', 'Attestation de participation en fin de parcours'],
    waveText: 'Bonjour LOLLY Academy, je souhaite m’inscrire à la formation intensive de 5 jours à 75 000 XOF. Voici mes coordonnées : Nom — Prénom — WhatsApp — Email. Merci.',
  },
  {
    slug: 'accompagnement', eyebrow: '3 à 5 mois', name: 'Accompagnement',
    cardTitle: 'Installer une communication qui tient dans le temps, avec un regard à tes côtés.',
    cardLead: 'Pour les entrepreneurs et équipes qui veulent être suivis dans l’exécution, corriger rapidement et progresser sur des objectifs réels.',
    price: 85000, pricePrefix: 'À partir de',
    durationLine: '3 à 5 mois · rythme défini après diagnostic · suivi de l’exécution',
    promiseHeadline: 'Tu ne repars pas seulement avec des idées : tu avances avec un cadre, des priorités et des corrections régulières.',
    problemBody: [
      'Tu sais globalement ce qu’il faudrait faire, mais l’urgence quotidienne reprend le dessus. Les actions s’arrêtent, les contenus s’accumulent et les résultats sont difficiles à lire.',
      'L’accompagnement transforme la stratégie en habitudes de travail. Nous fixons les objectifs, construisons les outils utiles et suivons leur mise en œuvre avec toi.',
    ],
    programme: ['Diagnostic de la communication et choix de trois priorités', 'Positionnement, messages et parcours de conversion', 'Organisation éditoriale et production des contenus', 'Suivi des prospects, relances et fidélisation', 'Lecture des résultats et ajustements réguliers'],
    format: ['Accompagnement personnalisé sur 3 à 5 mois', 'Objectifs et rythme adaptés après un premier diagnostic', 'Points de suivi, corrections et ressources de travail', 'Tarif final défini selon le périmètre et le niveau de suivi'],
    waveText: 'Bonjour LOLLY Academy, je souhaite échanger sur l’accompagnement de 3 à 5 mois à partir de 85 000 XOF. Voici mes coordonnées : Nom — WhatsApp — Email — Activité. Merci.',
  },
  {
    slug: 'ateliers', eyebrow: 'Format court', name: 'Ateliers LOLLY',
    cardTitle: 'Travailler une compétence précise et repartir avec quelque chose de prêt.',
    cardLead: 'Des sessions pratiques en petit groupe autour d’un sujet concret de communication digitale. Tu apprends, tu produis, tu corriges.',
    price: 25000, priceSuffix: 'personne',
    durationLine: '25 000 XOF par personne · thèmes et dates annoncés selon le calendrier',
    promiseHeadline: 'Un atelier, un sujet, un résultat directement utilisable dans ton activité.',
    problemBody: [
      'Tu n’as pas forcément besoin d’un programme complet. Tu veux débloquer un point précis : mieux filmer, mieux écrire, organiser tes publications ou mieux vendre sur WhatsApp.',
      'Les Ateliers LOLLY vont droit au travail utile. Le groupe avance sur un même objectif et chacun repart avec une production ou un outil adapté à son activité.',
    ],
    programme: ['Comprendre les principes essentiels du sujet', 'Observer des exemples adaptés au marché local', 'Appliquer la méthode à son activité pendant l’atelier', 'Recevoir une correction et une prochaine action claire'],
    format: ['Atelier pratique en groupe', '25 000 XOF par participant et par atelier', 'Thèmes proposés selon le calendrier LOLLY Academy', 'Possibilité d’organiser un atelier dédié pour une équipe'],
    waveText: 'Bonjour LOLLY Academy, je souhaite connaître les prochaines dates des Ateliers LOLLY à 25 000 XOF par personne. Le thème qui m’intéresse est : … Mes coordonnées : Nom — WhatsApp — Email. Merci.',
    workshops: WORKSHOPS,
  },
];

export const LEGACY_OFFER_REDIRECTS: Record<string, Offer['slug']> = {
  fondations: 'formation-intensive', 'reprise-en-main': 'accompagnement', pilotage: 'accompagnement', posture: 'accompagnement',
};

export function getOffer(slug: string): Offer | undefined { return OFFERS.find((offer) => offer.slug === slug); }

export const CONTACT = { whatsapp: '+221 77 235 47 47', whatsappDigits: '221772354747', email: 'oudama@lolly.sn', calendly: 'https://calendly.com/lolly-sn/conseil-30min', city: 'Dakar, Sénégal' };

export function fmtPrice(n: number): string { return `${new Intl.NumberFormat('fr-FR').format(n)} XOF`; }

export function offerPriceLabel(offer: Offer): string {
  return `${offer.pricePrefix ? `${offer.pricePrefix} ` : ''}${fmtPrice(offer.price)}${offer.priceSuffix ? ` / ${offer.priceSuffix}` : ''}`;
}

export function reserveWhatsappUrl(offer: Offer): string { return `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(offer.waveText)}`; }

export function diagnosticWhatsappUrl(offer: Offer): string {
  const text = `Bonjour LOLLY Academy, j’ai fait le diagnostic et je souhaite avancer avec l’offre ${offer.name} (${offerPriceLabel(offer)}). Mes coordonnées : Nom — Prénom — WhatsApp — Email. Merci.`;
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(text)}`;
}

export function conseilWhatsappUrl(offer: Offer | null): string {
  const text = offer ? `Bonjour LOLLY Academy, je voudrais échanger avant de choisir l’offre ${offer.name}. Mes coordonnées : Nom — WhatsApp — Email.` : 'Bonjour LOLLY Academy, je voudrais être conseillé pour choisir la formule adaptée à mon besoin. Mes coordonnées : Nom — WhatsApp — Email.';
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(text)}`;
}
