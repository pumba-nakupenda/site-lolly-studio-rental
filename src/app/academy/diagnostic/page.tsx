import DiagnosticClient from './DiagnosticClient';

export const metadata = {
  title: 'Diagnostic gratuit en communication',
  description:
    'Un premier diagnostic gratuit de ton activité, de ton public, de tes objectifs et de tes canaux de communication.',
  alternates: { canonical: '/academy/diagnostic' },
  openGraph: {
    title: 'Diagnostic gratuit en communication | LOLLY Academy',
    description: 'Un premier diagnostic gratuit pour clarifier ton activité, ton public et tes canaux de communication.',
    url: 'https://lolly.sn/academy/diagnostic',
    type: 'website',
  },
};

export default function DiagnosticPage() {
  return <DiagnosticClient />;
}
