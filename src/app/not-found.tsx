import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-on-surface flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-[8rem] md:text-[12rem] font-black text-white/5 leading-none">
          404
        </h1>
        <div className="-mt-16 md:-mt-24">
          <p className="text-xl text-white font-bold uppercase tracking-tighter mb-2">
            Page introuvable
          </p>
          <p className="text-sm text-surface-variant mb-8">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-primary-fixed text-on-primary-fixed px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-on-surface transition-all"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
