import InscriptionForm from './InscriptionForm';

export const metadata = {
  title: 'Inscription — LOLLY Academy',
  description: 'Formulaire d’inscription LOLLY Academy. Tes coordonnées sont confirmées en moins de 24h ouvrées.',
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ offre?: string }>;
}) {
  const sp = await searchParams;
  const offerSlug = (sp?.offre || '').toString();
  return <InscriptionForm initialOffer={offerSlug} />;
}
