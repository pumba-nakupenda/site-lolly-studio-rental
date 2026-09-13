import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { ConseilCTA } from '../_components/ConseilCTA';
import { ReserveButtons } from '../_components/ReserveButtons';
import { CONTACT, LEGACY_OFFER_REDIRECTS, OFFERS, conseilWhatsappUrl, getOffer, offerPriceLabel } from '../_lib/offers';

export function generateStaticParams() {
  return OFFERS.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = getOffer(LEGACY_OFFER_REDIRECTS[slug] ?? slug);
  if (!offer) return { title: 'Offre introuvable | LOLLY Academy' };
  return {
    title: offer.name,
    description: offer.cardLead,
    alternates: { canonical: `/academy/${offer.slug}` },
    openGraph: {
      title: `${offer.name} | LOLLY Academy`,
      description: offer.cardLead,
      url: `https://lolly.sn/academy/${offer.slug}`,
      type: 'website',
    },
  };
}

export default async function OfferPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legacyTarget = LEGACY_OFFER_REDIRECTS[slug];
  if (legacyTarget) permanentRedirect(`/academy/${legacyTarget}`);
  const offer = getOffer(slug);
  if (!offer) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `LOLLY Academy — ${offer.name}`,
    description: offer.cardLead,
    provider: { '@type': 'Organization', name: 'LOLLY Communication', url: 'https://lolly.sn' },
    offers: { '@type': 'Offer', price: offer.price, priceCurrency: 'XOF', url: `https://lolly.sn/academy/${offer.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="px-6 md:px-12 pt-8 max-w-7xl mx-auto">
        <Link href="/academy" className="text-[0.65rem] uppercase tracking-[0.18em] text-secondary hover:text-primary">← Toutes les offres</Link>
      </div>

      <section className="px-6 md:px-12 pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block bg-on-surface text-primary-fixed text-[0.65rem] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6">{offer.eyebrow} — {offer.name}</span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-on-surface max-w-5xl leading-[1.05]">{offer.cardTitle}</h1>
          <p className="mt-6 text-base md:text-xl text-on-surface-variant max-w-3xl leading-relaxed">{offer.promiseHeadline}</p>
          <p className="mt-5 text-xs text-secondary">{offer.durationLine}</p>
        </div>
      </section>

      <section className="bg-surface-container-lowest border-y border-outline-variant/15 px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-4">Pourquoi cette formule</p>
          {offer.problemBody.map((paragraph) => <p key={paragraph} className="text-base md:text-lg text-on-surface leading-relaxed mb-4">{paragraph}</p>)}
        </div>
      </section>

      {offer.workshops && (
        <section className="bg-on-surface text-white px-6 md:px-12 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-primary-fixed font-bold mb-4">Catalogue des ateliers</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">Les sujets proposés</h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offer.workshops.map((workshop, index) => (
                <li key={workshop.title} className="border border-white/15 p-6 md:p-7">
                  <span className="text-xs font-black text-primary-fixed">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-base md:text-lg font-black uppercase tracking-tight">{workshop.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{workshop.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <div className="md:col-span-7">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-5">Ce que nous travaillons</p>
            <ol className="grid gap-3">{offer.programme.map((line, index) => <li key={line} className="grid grid-cols-[auto_1fr] gap-3 items-baseline"><span className="text-xs font-black text-primary-fixed bg-on-surface px-2 py-1">{String(index + 1).padStart(2, '0')}</span><span className="text-sm md:text-base leading-relaxed">{line}</span></li>)}</ol>
          </div>
          <div className="md:col-span-5">
            <p className="text-[0.65rem] uppercase tracking-[0.22em] text-secondary font-bold mb-5">Format</p>
            <ul className="grid gap-3">{offer.format.map((line) => <li key={line} className="border-l-2 border-primary-fixed pl-4 text-sm md:text-base leading-relaxed">{line}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="bg-primary-fixed text-on-primary-fixed px-6 md:px-12 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[0.65rem] uppercase tracking-[0.22em] font-bold mb-3">Tarif</p>
          <p className="text-4xl md:text-6xl font-black tracking-tighter">{offerPriceLabel(offer)}</p>
          <p className="mt-5 max-w-2xl text-base md:text-lg">Envoie ta demande en ligne ou contacte-nous sur WhatsApp. L’équipe te confirme les disponibilités, le calendrier et les modalités avant toute inscription définitive.</p>
          <ReserveButtons offer={offer} />
        </div>
      </section>

      <ConseilCTA whatsappUrl={conseilWhatsappUrl(offer)} calendlyUrl={CONTACT.calendly} context={offer.slug} />
    </>
  );
}
