import DiagnosticClient from './DiagnosticClient';

export const metadata = {
  title: 'Diagnostic 2 minutes',
  description:
    '4 questions pour identifier le format LOLLY Academy adapté à ton objectif, ton temps et ton besoin de suivi.',
};

export default function DiagnosticPage() {
  return <DiagnosticClient />;
}
