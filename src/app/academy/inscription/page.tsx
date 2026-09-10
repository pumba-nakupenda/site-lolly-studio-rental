import InscriptionForm from './InscriptionForm';

export const metadata = {
  title: 'Inscription',
  description: 'Demande d’inscription aux formations, accompagnements et ateliers LOLLY Academy.',
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
