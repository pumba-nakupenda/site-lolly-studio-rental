import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'LOLLY Academy — 4 chemins pour faire bouger ta com',
  description:
    'LOLLY Academy : 4 offres de formation pour vendre, reprendre la main, piloter et transmettre. Cohorte 1 le 15 juin 2026.',
  openGraph: {
    title: 'LOLLY Academy — Quel est ton défi de communication aujourd’hui ?',
    description:
      '4 chemins pour faire bouger ta com. FONDATIONS, REPRISE EN MAIN, PILOTAGE, POSTURE. Cohorte 1 le 15 juin 2026.',
    type: 'website',
    locale: 'fr_FR',
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
