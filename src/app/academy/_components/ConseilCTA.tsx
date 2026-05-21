'use client';

import { track } from './Track';

type Props = {
  whatsappUrl: string;
  calendlyUrl: string;
  context?: string;
};

export function ConseilCTA({ whatsappUrl, calendlyUrl, context }: Props) {
  return (
    <section className="bg-on-surface text-white px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-4">
          Conseil premium
        </p>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Tu préfères en parler de vive voix&nbsp;?
        </h2>
        <p className="text-base md:text-lg text-surface-dim mb-10 max-w-2xl mx-auto">
          30 minutes en visio avec Amadou Mbaye Gueye, fondateur de{' '}
          <span className="lolly-wordmark">LOLLY</span>. Gratuit si tu t’inscris ensuite à une formation. 15 000 XOF sinon.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('click_conseil_30min', { via: 'calendly', context })}
            className="bg-primary-fixed text-on-primary-fixed font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-primary-fixed-dim transition-colors"
          >
            Réserver via Calendly →
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('click_conseil_30min', { via: 'whatsapp', context })}
            className="border-2 border-white text-white font-black uppercase px-8 py-4 text-xs tracking-[0.18em] hover:bg-white hover:text-on-surface transition-colors"
          >
            WhatsApp direct →
          </a>
        </div>
      </div>
    </section>
  );
}

export default ConseilCTA;
