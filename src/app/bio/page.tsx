import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Tous les liens LOLLY | Agence, production et formation",
  description:
    "Confiez votre projet à LOLLY, découvrez nos réalisations, formez votre équipe ou accédez à nos moyens de production à Dakar.",
  alternates: { canonical: "/bio" },
  openGraph: {
    title: "LOLLY — Tous nos liens au même endroit",
    description: "Conseil, création, production et formation à Dakar. Choisissez votre point de départ.",
    url: "https://lolly.sn/bio",
    type: "website",
  },
};

const agencyRequestMessage =
  "Bonjour, je viens de la page bio et je souhaite confier un projet à LOLLY. Mon objectif est : …";
const agencyRequestUrl = `/contact?service=Studio&message=${encodeURIComponent(agencyRequestMessage)}`;
const whatsappUrl = `https://wa.me/221772354747?text=${encodeURIComponent("Bonjour LOLLY, je viens de votre bio et je souhaite vous confier un projet de communication. Mon besoin concerne : …")}`;

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/agence_lolly/" },
  { label: "TikTok", href: "https://www.tiktok.com/@agence_lolly" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/lolly-sas" },
  { label: "Facebook", href: "https://www.facebook.com/AGENCELOLLY" },
];

function LinkCard({
  href,
  number,
  title,
  description,
  featured = false,
}: {
  href: string;
  number: string;
  title: string;
  description: string;
  featured?: boolean;
}) {
  const className = `group flex min-h-24 items-center gap-4 border px-5 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FED700] ${
    featured
      ? "border-[#FED700] bg-[#FED700] text-black hover:bg-[#ebc800]"
      : "border-white/25 bg-white/[0.04] text-white hover:border-[#FED700] hover:bg-white/[0.09]"
  }`;
  const content = (
    <>
      <span className={`self-start pt-1 font-headline text-sm font-black ${featured ? "text-black/60" : "text-[#FED700]"}`}>{number}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-headline text-base font-black uppercase leading-snug tracking-tight sm:text-lg">{title}</span>
        <span className={`mt-1 block text-sm leading-snug ${featured ? "text-black/75" : "text-white/65"}`}>{description}</span>
      </span>
      <span aria-hidden="true" className="self-start font-headline text-xl transition-transform group-hover:translate-x-1">→</span>
    </>
  );

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default function BioPage() {
  return (
    <main id="main-content" className="min-h-dvh bg-[#111111] px-5 pb-12 pt-8 text-white sm:px-8 sm:pt-12">
      <div className="mx-auto w-full max-w-xl">
        <header className="border-b border-white/20 pb-7">
          <Link href="/" aria-label="LOLLY — Voir le site" className="inline-flex focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FED700]">
            <Logo height={43} color="white" />
          </Link>
          <p className="mt-8 font-headline text-xs font-bold uppercase tracking-[0.18em] text-[#FED700]">Agence · Production · Formation · Dakar</p>
          <h1 className="mt-3 font-headline text-4xl font-black uppercase leading-[0.98] tracking-[-0.055em] sm:text-5xl">
            Fais avancer <span className="text-[#FED700]">ton projet.</span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            Un projet de communication, de contenu ou d&apos;image ? Dis-nous ce que tu veux faire avancer.
          </p>
        </header>

        <nav aria-label="Les liens essentiels de LOLLY" className="mt-6 grid gap-3">
          <LinkCard href={agencyRequestUrl} number="01" title="Confier un projet à LOLLY" description="Décris ton objectif : notre équipe te conseille avant de proposer la bonne solution." featured />
          <div className="grid grid-cols-2 gap-3" aria-label="Contacter LOLLY">
            <a href="tel:+221772354747" className="flex min-h-24 flex-col justify-center border border-[#FED700] px-4 py-3 text-white transition-colors hover:bg-[#FED700] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FED700]">
              <span className="font-headline text-sm font-black uppercase sm:text-base">Appeler LOLLY</span>
              <span className="mt-1 text-sm">+221 77 235 47 47</span>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-24 flex-col justify-center border border-[#25D366] bg-[#25D366] px-4 py-3 text-black transition-colors hover:bg-[#20bd5b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FED700]">
              <span className="font-headline text-sm font-black uppercase sm:text-base">WhatsApp</span>
              <span className="mt-1 text-sm">Écrire à l’équipe ↗</span>
            </a>
          </div>
          <LinkCard href="/studio/projets" number="02" title="Voir nos réalisations" description="Découvre nos projets de stratégie, d’image, de contenu et de production." />
          <LinkCard href="/academy" number="03" title="Se former ou former son équipe" description="Formations, accompagnements, ateliers et Masterclass de LOLLY Academy." />
          <LinkCard href="/production" number="04" title="Production et location" description="Studios, matériel audiovisuel et moyens techniques pour passer à l’action." />
        </nav>

        <section aria-labelledby="services-title" className="mt-9 border-t border-white/20 pt-6">
          <h2 id="services-title" className="font-headline text-xs font-bold uppercase tracking-[0.18em] text-white/55">Découvrir l’agence</h2>
          <Link href="/studio" className="mt-4 flex items-center justify-between border border-white/25 px-5 py-4 font-headline text-sm font-bold uppercase transition-colors hover:border-[#FED700] hover:text-[#FED700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FED700]">
            <span>Voir toutes les prestations</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        <footer className="mt-9 border-t border-white/20 pt-6">
          <p className="font-headline text-xs font-bold uppercase tracking-[0.18em] text-white/55">Retrouve-nous aussi sur</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {socialLinks.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline decoration-[#FED700] underline-offset-4 transition-colors hover:text-[#FED700] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FED700]">
                {label}
              </a>
            ))}
          </div>
          <Link href="/" className="mt-8 inline-block text-sm text-white/55 underline underline-offset-4 transition-colors hover:text-[#FED700] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FED700]">lolly.sn</Link>
        </footer>
      </div>
    </main>
  );
}
