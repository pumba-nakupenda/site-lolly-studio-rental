'use client';

import Link from 'next/link';
import { track } from './Track';

export default function HeroCTAs({ inverse = false }: { inverse?: boolean }) {
  return (
    <>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <Link
          href="/academy/diagnostic"
          onClick={() => track('click_diagnostic_start', { source: 'hero' })}
          className={`inline-flex items-center justify-center gap-2 font-black uppercase px-8 py-4 text-sm tracking-[0.16em] transition-colors ${inverse ? 'bg-primary-fixed text-on-primary-fixed hover:bg-white' : 'bg-on-surface text-primary-fixed hover:bg-on-surface/85'}`}
        >
          Faire mon diagnostic gratuit →
        </Link>
        <a
          href="#conseil"
          className={`inline-flex items-center justify-center gap-2 border-2 font-black uppercase px-8 py-4 text-sm tracking-[0.16em] transition-colors ${inverse ? 'border-white text-white hover:bg-white hover:text-on-surface' : 'border-on-surface text-on-surface hover:bg-on-surface hover:text-primary-fixed'}`}
        >
          Parler à un conseiller
        </a>
      </div>
      <p className={`mt-3 text-xs tracking-tight ${inverse ? 'text-white/50' : 'text-secondary'}`}>
        Environ 4 minutes · gratuit · sans engagement
      </p>
    </>
  );
}
