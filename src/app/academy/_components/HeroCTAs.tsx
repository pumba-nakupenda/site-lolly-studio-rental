'use client';

import Link from 'next/link';
import { track } from './Track';

export default function HeroCTAs() {
  return (
    <>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <Link
          href="/academy/diagnostic"
          onClick={() => track('click_diagnostic_start', { source: 'hero' })}
          className="inline-flex items-center justify-center gap-2 bg-on-surface text-primary-fixed font-black uppercase px-8 py-4 text-sm tracking-[0.16em] hover:bg-on-surface/85 transition-colors"
        >
          Faire le diagnostic en 2 min →
        </Link>
        <a
          href="#offres"
          className="inline-flex items-center justify-center gap-2 border-2 border-on-surface text-on-surface font-black uppercase px-8 py-4 text-sm tracking-[0.16em] hover:bg-on-surface hover:text-primary-fixed transition-colors"
        >
          Comparer les offres
        </a>
      </div>
      <p className="mt-3 text-xs text-secondary tracking-tight">
        Gratuit · sans engagement · 4 questions
      </p>
    </>
  );
}
