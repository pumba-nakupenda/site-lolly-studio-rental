import InscriptionForm from './InscriptionForm';

export const metadata = {
  title: 'Inscription',
  description: 'Inscription aux Masterclass de LOLLY, formations, accompagnements et ateliers LOLLY Academy.',
};

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ offre?: string; diagnostic?: string }>;
}) {
  const sp = await searchParams;
  const offerSlug = (sp?.offre || '').toString();
  return <InscriptionForm initialOffer={offerSlug} initialDiagnostic={(sp?.diagnostic || '').toString().slice(0, 1200)} />;
}
