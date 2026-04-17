"use client";

import { useState } from "react";

interface BookingFormProps {
  studioName: string;
  studioPrice: string;
  requestType: "studio_booking" | "training";
}

export default function BookingForm({ studioName, studioPrice, requestType }: BookingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("Journée");
  const [participants, setParticipants] = useState("");
  const [needs, setNeeds] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !date) return;
    setSubmitting(true);

    const requestData = requestType === "training"
      ? { room: studioName, date, duration, participants: parseInt(participants) || 0, topic: needs }
      : { studio: studioName, date, duration, needs };

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        service_interest: requestType === "training" ? "Location Salle Formation" : "Réservation Studio",
        message: `Réservation ${studioName}\nDate: ${date}\nDurée: ${duration}${participants ? `\nParticipants: ${participants}` : ""}\nBesoins: ${needs}`,
        request_type: requestType,
        request_data: requestData,
      }),
    });

    setSubmitted(true);
    setSubmitting(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary-fixed text-on-primary-fixed px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
      >
        {requestType === "training" ? "Réserver cette salle" : "Réserver ce studio"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-on-surface/50" onClick={() => setIsOpen(false)} />

      <div className="relative bg-surface w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 bg-on-surface text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[0.6rem] uppercase tracking-widest text-primary-fixed font-bold mb-1">
                {requestType === "training" ? "Réservation Formation" : "Réservation Studio"}
              </p>
              <h2 className="text-xl font-black uppercase tracking-tighter">{studioName}</h2>
              <p className="text-sm text-surface-variant mt-1">{studioPrice}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-primary-fixed text-5xl">check_circle</span>
            <h3 className="text-xl font-bold">Demande envoyée !</h3>
            <p className="text-sm text-secondary">Nous confirmerons votre réservation sous 24h.</p>
            <button onClick={() => { setSubmitted(false); setIsOpen(false); }} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Date *</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
              </div>
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Durée</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                  <option>Demi-journée</option>
                  <option>Journée</option>
                  <option>2 jours</option>
                  <option>3 jours</option>
                  <option>Semaine</option>
                </select>
              </div>
            </div>

            {requestType === "training" && (
              <div>
                <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Nombre de participants</label>
                <input type="number" value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Ex: 10" min="1" max="20" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
              </div>
            )}

            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">
                {requestType === "training" ? "Sujet / Thème de la formation" : "Besoins techniques"}
              </label>
              <textarea value={needs} onChange={(e) => setNeeds(e.target.value)} placeholder={requestType === "training" ? "Ex: Formation Marketing Digital pour 10 commerciaux" : "Ex: Cyclorama blanc, 3 flashs Profoto..."} rows={2} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
            </div>

            <div className="border-t border-outline-variant/15 pt-5 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom *" required className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
              <div className="grid grid-cols-2 gap-3">
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" type="email" required className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" type="tel" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !name || !email || !date}
              className="w-full bg-primary-fixed text-on-primary-fixed font-black uppercase py-4 text-xs tracking-widest hover:bg-primary-fixed-dim transition-all disabled:opacity-50"
            >
              {submitting ? "Envoi..." : "Confirmer la demande"}
            </button>

            <a
              href={`https://wa.me/+221772354747?text=${encodeURIComponent(
                `Bonjour LOLLY, je souhaiterais réserver ${studioName} le ${date} (${duration}).${participants ? ` ${participants} participants.` : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-on-surface text-on-surface font-bold uppercase py-3 text-xs tracking-widest text-center block hover:bg-on-surface hover:text-surface transition-all"
            >
              Ou réserver via WhatsApp
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
