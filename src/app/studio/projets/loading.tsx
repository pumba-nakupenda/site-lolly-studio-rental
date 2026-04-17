export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary-fixed border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-xs uppercase tracking-widest text-secondary">Chargement...</p>
      </div>
    </div>
  );
}
