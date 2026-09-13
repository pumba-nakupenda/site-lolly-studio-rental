import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: { default: 'LOLLY Academy — Formations en communication digitale', template: '%s | LOLLY Academy' },
  description:
    'Formation intensive de 5 jours, accompagnement de 3 à 5 mois et ateliers pratiques à Dakar.',
  openGraph: {
    title: 'LOLLY Academy — Apprendre, appliquer, avancer',
    description:
      'Formation intensive, accompagnement et ateliers pratiques en communication digitale à Dakar.',
    type: 'website',
    locale: 'fr_SN',
  },
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-surface">
        {children}
      </main>
      <Footer />
    </>
  );
}
