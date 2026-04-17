"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SERVICES = [
  "Consulting Strat\u00e9gique",
  "Formation Digitale Pro",
  "Production Vid\u00e9o / Photo",
  "Design & Branding",
  "Community Management",
  "Cr\u00e9ation de Contenu",
  "Autre demande",
];

export default function ContactPage() {
  return (
    <Suspense>
      <ContactPageInner />
    </Suspense>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState(SERVICES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from URL params (?service=Production+Vidéo&message=...)
  useEffect(() => {
    const service = searchParams.get("service");
    const msg = searchParams.get("message");
    if (service && SERVICES.includes(service)) setServiceInterest(service);
    if (msg) setMessage(msg);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service_interest: serviceInterest,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l\u2019envoi.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Hero */}
        <section className="px-6 md:px-12 pt-24 pb-16">
          <div className="max-w-7xl mx-auto">
            <span className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant block mb-4">
              Une id&eacute;e ? Une question ?
            </span>
            <h1 className="text-[2.5rem] md:text-[5rem] font-black tracking-[-0.04em] leading-tight max-w-4xl">
              PARLONS DE VOTRE{" "}
              <span className="text-primary-fixed">PROJET</span>.
            </h1>
            <p className="text-xl text-secondary mt-6 max-w-2xl">
              Que vous soyez au d&eacute;but de votre r&eacute;flexion ou
              pr&ecirc;t &agrave; lancer votre campagne, nous sommes l&agrave;
              pour vous accompagner vers l&apos;excellence.
            </p>
          </div>
        </section>

        {/* Form & Info Grid */}
        <section className="px-6 md:px-12 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-12 shadow-[0px_24px_48px_-12px_rgba(12,15,15,0.04)]">
              <h2 className="text-2xl font-bold mb-12 uppercase tracking-tighter">
                Envoyer un message
              </h2>

              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <span className="material-symbols-outlined text-primary-fixed text-5xl">
                    check_circle
                  </span>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">
                    Message envoy&eacute; !
                  </h3>
                  <p className="text-on-surface-variant max-w-md mx-auto">
                    Merci pour votre message. Notre &eacute;quipe vous
                    recontactera dans les plus brefs d&eacute;lais.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setPhone("");
                      setServiceInterest(SERVICES[0]);
                      setMessage("");
                    }}
                    className="mt-6 px-8 py-3 bg-primary-container text-on-primary-fixed font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant">
                        Identit&eacute;
                      </label>
                      <input
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-4 px-0 transition-all placeholder:text-outline-variant"
                        placeholder="Votre nom complet"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant">
                        Contact Email
                      </label>
                      <input
                        className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-4 px-0 transition-all placeholder:text-outline-variant"
                        placeholder="votre@email.com"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant">
                      T&eacute;l&eacute;phone (Mobile)
                    </label>
                    <input
                      className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-4 px-0 transition-all placeholder:text-outline-variant"
                      placeholder="+221 7X XXX XX XX"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant">
                      Domaine d&apos;intervention
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {SERVICES.map((service) => (
                        <label key={service} className="cursor-pointer">
                          <input
                            checked={serviceInterest === service}
                            onChange={() => setServiceInterest(service)}
                            className="hidden peer"
                            name="service"
                            type="radio"
                          />
                          <span className="px-5 py-2.5 bg-secondary-container text-on-secondary-container font-bold uppercase text-[0.65rem] tracking-widest peer-checked:bg-primary-container peer-checked:text-on-primary-fixed transition-all">
                            {service}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface-variant">
                      D&eacute;tails de votre demande
                    </label>
                    <textarea
                      className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant py-4 px-0 transition-all placeholder:text-outline-variant resize-none"
                      placeholder="D&eacute;crivez votre projet, vos objectifs et vos d&eacute;lais..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                  )}

                  <button
                    className="w-full bg-primary-container text-on-primary-fixed font-black uppercase tracking-widest py-6 hover:bg-primary-fixed-dim transition-all shadow-[0px_24px_48px_-12px_rgba(12,15,15,0.04)] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Envoi en cours..."
                      : "D\u00e9marrez l\u2019aventure \u2192"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-16">
              <div>
                <h3 className="text-2xl font-bold mb-8 uppercase tracking-tighter">
                  On reste &agrave; votre &eacute;coute.
                </h3>
                <p className="text-on-surface-variant leading-relaxed mb-8">
                  Besoin d&apos;un conseil imm&eacute;diat ? N&apos;h&eacute;sitez
                  pas &agrave; nous solliciter via nos diff&eacute;rents canaux.
                  On adore discuter nouvelles id&eacute;es !
                </p>
              </div>

              {/* Address */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
                    Notre Si&egrave;ge
                  </p>
                  <p className="flex items-start gap-4 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary-fixed-dim mt-1">
                      location_on
                    </span>
                    <span>
                      LOLLY SAS, Fass Delorme Rue 22x13, Appt 201
                      <br />
                      Dakar, S&eacute;n&eacute;gal
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
                    Ligne Directe
                  </p>
                  <p className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary-fixed-dim">
                      call
                    </span>
                    <a
                      href="tel:+221772354747"
                      className="text-on-surface-variant hover:text-primary-fixed transition-colors"
                    >
                      +221 77 235 47 47
                    </a>
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
                    Email G&eacute;n&eacute;ral
                  </p>
                  <p className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary-fixed-dim">
                      mail
                    </span>
                    <a
                      href="mailto:contact@lolly.sn"
                      className="text-on-surface-variant hover:text-primary-fixed transition-colors"
                    >
                      contact@lolly.sn
                    </a>
                  </p>
                </div>
              </div>

              {/* Socials */}
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-bold mb-4">
                  Suivez-nous &mdash; @lolly_agency
                </p>
                <div className="flex gap-4">
                  {[
                    {
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/company/lolly-sas",
                    },
                    {
                      label: "Instagram",
                      href: "https://www.instagram.com/agence_lolly/",
                    },
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/AGENCELOLLY",
                    },
                    {
                      label: "TikTok",
                      href: "https://www.tiktok.com/@agence_lolly",
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-surface-container text-on-surface-variant text-[0.65rem] font-bold uppercase tracking-widest hover:bg-primary-container hover:text-on-primary-fixed transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/+221772354747?text=Bonjour%20LOLLY%20Agency%2C%20je%20souhaiterais%20en%20savoir%20plus%20sur%20vos%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-on-surface text-white hover:bg-on-surface/90 transition-colors"
              >
                <span className="material-symbols-outlined text-primary-fixed text-3xl">
                  chat
                </span>
                <div>
                  <p className="font-bold uppercase text-sm tracking-widest">
                    Discutez sur WhatsApp
                  </p>
                  <p className="text-surface-variant text-sm">
                    Disponibilit&eacute; imm&eacute;diate
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="px-6 md:px-12 pb-32">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-5 bg-on-surface text-surface p-12 flex flex-col justify-end min-h-[300px]">
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">
                LOLLY SAS
              </h4>
              <p className="text-sm opacity-70 leading-relaxed">
                Fass Delorme Rue 22x13, Dakar
              </p>
              <p className="text-sm opacity-70 mt-2 uppercase tracking-widest">
                Si&egrave;ge Social
              </p>
            </div>
            <div className="md:col-span-7 h-[400px]">
              <iframe
                src="https://maps.google.com/maps?ll=14.687817,-17.455592&z=15&t=m&hl=fr&gl=SN&output=embed"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                title="LOLLY SAS - Dakar"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
