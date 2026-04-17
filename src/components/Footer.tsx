import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-surface-dim w-full py-16 px-6 md:px-12">
      <div className="flex flex-col md:flex-row justify-between items-end w-full">
        <div className="flex flex-col gap-8 w-full md:w-auto mb-12 md:mb-0">
          <Link href="/" aria-label="LOLLY — Accueil">
            <Logo height={24} color="black" />
          </Link>
          <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface max-w-xs">
            Agence de Conseil en Communication. Votre partenaire stratégique
            pour une communication à fort impact.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link
              href="/studio"
              className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface hover:text-primary-fixed transition-colors"
            >
              Studio
            </Link>
            <Link
              href="/rental"
              className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface hover:text-primary-fixed transition-colors"
            >
              Rental
            </Link>
            <Link
              href="/about"
              className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface hover:text-primary-fixed transition-colors"
            >
              À Propos
            </Link>
            <Link
              href="/contact"
              className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface hover:text-primary-fixed transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="text-right w-full md:w-auto">
          <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant mb-2">
            Suivez-nous
          </p>
          <div className="flex gap-4 justify-start md:justify-end mb-8">
            <a
              href="https://www.linkedin.com/company/lolly-sas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface hover:text-primary-fixed transition-colors"
            >
              LN
            </a>
            <a
              href="https://www.instagram.com/agence_lolly/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface hover:text-primary-fixed transition-colors"
            >
              IG
            </a>
            <a
              href="https://www.facebook.com/AGENCELOLLY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface hover:text-primary-fixed transition-colors"
            >
              FB
            </a>
            <a
              href="https://www.tiktok.com/@agence_lolly"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface hover:text-primary-fixed transition-colors"
            >
              TK
            </a>
          </div>
          <p className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface">
            &copy; {new Date().getFullYear()} LOLLY SAS — Dakar, Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
}
