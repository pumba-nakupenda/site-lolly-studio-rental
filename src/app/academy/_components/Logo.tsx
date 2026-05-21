import Link from 'next/link';

export default function Logo({ light = false, withAcademy = true, large = false }) {
  return (
    <Link
      href="/academy"
      className="inline-flex items-baseline gap-1 select-none"
      aria-label="LOLLY Academy — accueil"
    >
      <span
        className="lolly-wordmark"
        style={{
          color: light ? '#FFFFFF' : '#000000',
          fontSize: large ? '2.25rem' : '1.5rem',
          letterSpacing: '-0.03em',
        }}
      >
        LOLLY
      </span>
      {withAcademy && (
        <span
          className="academy-body"
          style={{
            color: light ? 'rgba(255,255,255,0.8)' : '#1A1A1A',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: large ? '1.5rem' : '1rem',
          }}
        >
          Academy
        </span>
      )}
    </Link>
  );
}
