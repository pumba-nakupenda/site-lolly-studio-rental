'use client';

import { track } from './Track';

type Props = {
  whatsappUrl: string;
  calendlyUrl: string;
  context?: string;
};

export function ConseilCTA({ whatsappUrl, calendlyUrl, context }: Props) {
  return (
    <section id="conseil" className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-14 md:py-20 scroll-mt-20">
      <div className="max-w-3xl mx-auto text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] font-bold mb-4">
          Conseil avant la vente
        </p>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Parlons de ton business.
        </h2>
        <p className="text-base md:text-lg mb-10 max-w-2xl mx-auto">
          Présente-nous ton activité, ce qui fonctionne et ce qui te bloque. L’équipe{' '}
          <span className="lolly-wordmark">LOLLY</span> t’oriente vers la bonne prochaine étape, même si ce n’est pas encore le moment d’acheter une formation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('click_conseil_30min', { via: 'calendly', context })}
            className="bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface/85 transition-colors"
          >
            Réserver mon échange conseil →
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('click_conseil_30min', { via: 'whatsapp', context })}
            className="border-2 border-on-surface text-on-surface font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-on-surface hover:text-primary-fixed transition-colors"
          >
            Poser ma question sur WhatsApp →
          </a>
        </div>
      </div>
    </section>
  );
}

export default ConseilCTA;
