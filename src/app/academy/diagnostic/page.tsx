import DiagnosticClient from './DiagnosticClient';

export const metadata = {
  title: 'Diagnostic gratuit en communication',
  description:
    'Un premier diagnostic gratuit de ton activité, de ton public, de tes objectifs et de tes canaux de communication.',
};

export default function DiagnosticPage() {
  return <DiagnosticClient />;
}
