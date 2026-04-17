"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Booking {
  id: string;
  studio_id: string | null;
  studio_name: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  date_start: string;
  date_end: string;
  duration: string;
  participants: number | null;
  needs: string | null;
  status: string;
  total_fcfa: number | null;
  notes: string | null;
  created_at: string;
}

interface Studio {
  id: string;
  name: string;
  price_fcfa: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-primary-fixed text-on-primary-fixed",
  confirmed: "bg-on-surface text-surface",
  cancelled: "bg-outline-variant/30 text-secondary line-through",
  completed: "bg-surface-container text-on-surface-variant",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
  completed: "Terminé",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const supabase = createClient();

  useEffect(() => { load(); loadStudios(); }, []);

  async function load() {
    const { data } = await supabase.from("bookings").select("*").order("date_start", { ascending: true });
    setBookings(data ?? []);
    setLoading(false);
  }

  async function loadStudios() {
    const { data } = await supabase.from("studio_spaces").select("id, name, price_fcfa").order("order_id");
    setStudios(data ?? []);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("bookings").insert(rest);
    } else {
      await supabase.from("bookings").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    }
    setEditing(null);
    setIsNew(false);
    load();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    load();
  }

  function update(field: string, value: string | number | null) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  // Calendar helpers
  const [calYear, calMonth] = viewMonth.split("-").map(Number);
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDay = new Date(calYear, calMonth - 1, 1).getDay();
  const calDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function getBookingsForDay(day: number) {
    const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => b.status !== "cancelled" && b.date_start <= dateStr && b.date_end >= dateStr);
  }

  function hasConflict(studioId: string | null, dateStart: string, dateEnd: string, excludeId?: string) {
    if (!studioId) return false;
    return bookings.some((b) =>
      b.id !== excludeId && b.studio_id === studioId && b.status !== "cancelled" &&
      b.date_start <= dateEnd && b.date_end >= dateStart
    );
  }

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Réservations</h1>
        <button
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            setEditing({
              id: "", studio_id: studios[0]?.id || null, studio_name: studios[0]?.name || "",
              client_name: "", client_email: "", client_phone: "",
              date_start: today, date_end: today, duration: "Journée",
              participants: null, needs: "", status: "pending",
              total_fcfa: studios[0]?.price_fcfa || null, notes: "", created_at: "",
            });
            setIsNew(true);
          }}
          className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
        >
          + Nouvelle réservation
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => {
            const d = new Date(calYear, calMonth - 2, 1);
            setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
          }} className="text-secondary hover:text-on-surface">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-lg font-bold uppercase tracking-tight">
            {new Date(calYear, calMonth - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </h2>
          <button onClick={() => {
            const d = new Date(calYear, calMonth, 1);
            setViewMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
          }} className="text-secondary hover:text-on-surface">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
            <div key={d} className="text-center text-[0.6rem] uppercase tracking-widest text-secondary font-bold py-2">{d}</div>
          ))}
          {/* Empty cells for first day offset (Mon=0) */}
          {Array.from({ length: (firstDay + 6) % 7 }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {calDays.map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isToday = new Date().toISOString().split("T")[0] === `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            return (
              <div key={day} className={`min-h-[80px] border border-outline-variant/10 p-1 ${isToday ? "bg-primary-fixed/10" : ""}`}>
                <span className={`text-xs font-bold ${isToday ? "text-primary" : "text-on-surface"}`}>{day}</span>
                {dayBookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setEditing(b); setIsNew(false); }}
                    className={`w-full text-left px-1.5 py-0.5 mt-0.5 text-[0.5rem] font-bold truncate ${
                      b.status === "confirmed" ? "bg-on-surface text-white" : "bg-primary-fixed/30 text-on-surface"
                    }`}
                  >
                    {b.studio_name.split("—")[0].trim()}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouvelle réservation" : "Modifier"}</h2>

          {/* Conflict warning */}
          {editing.studio_id && hasConflict(editing.studio_id, editing.date_start, editing.date_end, editing.id) && (
            <div className="bg-error/10 border border-error/30 p-4 mb-6 text-sm text-error font-bold">
              ⚠ Conflit : ce studio est déjà réservé sur ces dates.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Studio</label>
              <select value={editing.studio_id || ""} onChange={(e) => {
                const s = studios.find((s) => s.id === e.target.value);
                update("studio_id", e.target.value);
                if (s) { update("studio_name", s.name as unknown as string); update("total_fcfa", s.price_fcfa); }
              }} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                {studios.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Date début</label>
              <input type="date" value={editing.date_start} onChange={(e) => update("date_start", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Date fin</label>
              <input type="date" value={editing.date_end} onChange={(e) => update("date_end", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Client</label>
              <input value={editing.client_name} onChange={(e) => update("client_name", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Email</label>
              <input type="email" value={editing.client_email} onChange={(e) => update("client_email", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Téléphone</label>
              <input value={editing.client_phone || ""} onChange={(e) => update("client_phone", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Statut</label>
              <select value={editing.status} onChange={(e) => update("status", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Total FCFA</label>
              <input type="number" value={editing.total_fcfa || ""} onChange={(e) => update("total_fcfa", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Participants</label>
              <input type="number" value={editing.participants || ""} onChange={(e) => update("participants", parseInt(e.target.value) || null)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Besoins / Notes</label>
            <textarea value={editing.needs || ""} onChange={(e) => update("needs", e.target.value)} rows={2} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all">Enregistrer</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-secondary hover:text-on-surface">Annuler</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className={`bg-surface-container-lowest border border-outline-variant/15 p-5 flex justify-between items-center gap-4 ${b.status === "cancelled" ? "opacity-40" : ""}`}>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary">meeting_room</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{b.studio_name}</p>
                <p className="text-xs text-secondary">{b.client_name} — {new Date(b.date_start).toLocaleDateString("fr-FR")} → {new Date(b.date_end).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-[0.55rem] font-black uppercase px-2 py-1 ${STATUS_COLORS[b.status]}`}>
                {STATUS_LABELS[b.status]}
              </span>
              {b.status === "pending" && (
                <button onClick={() => updateStatus(b.id, "confirmed")} className="text-xs font-bold text-primary hover:text-primary-fixed">Confirmer</button>
              )}
              {b.status === "confirmed" && (
                <button onClick={() => updateStatus(b.id, "completed")} className="text-xs font-bold text-primary hover:text-primary-fixed">Terminer</button>
              )}
              <button onClick={() => { setEditing(b); setIsNew(false); }} className="p-1.5 hover:bg-surface-container">
                <span className="material-symbols-outlined text-sm text-secondary">edit</span>
              </button>
              <button onClick={() => remove(b.id)} className="p-1.5 hover:bg-error/10">
                <span className="material-symbols-outlined text-sm text-secondary hover:text-error">delete</span>
              </button>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-center text-secondary py-8">Aucune réservation.</p>}
      </div>
    </div>
  );
}
