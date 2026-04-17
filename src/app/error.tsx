"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-5xl text-error mb-4 block">
          error
        </span>
        <h2 className="text-2xl font-bold uppercase tracking-tighter mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-sm text-secondary mb-8">
          Nous sommes désolés, quelque chose ne s&apos;est pas passé comme
          prévu. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          className="bg-on-surface text-surface px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
