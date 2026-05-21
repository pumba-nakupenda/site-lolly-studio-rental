// Helper de tracking analytics pour LOLLY Academy.
// Branche en priorité Vercel Analytics (déjà actif via <Analytics />
// dans le layout root), puis Plausible / GA4 si présents.

import { track as vercelTrack } from '@vercel/analytics/react';

type Props = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === 'undefined') return;
  try {
    vercelTrack(event, props as Record<string, string | number | boolean | null>);

    if (typeof window.plausible === 'function') {
      window.plausible(event, { props });
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, props);
    }
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[track]', event, props);
    }
  } catch {
    /* noop */
  }
}
