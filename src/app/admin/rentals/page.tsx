"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RentalItem {
  name: string;
  brand: string;
  price: string;
  equipment_id?: string;
}

interface Rental {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  date_start: string;
  date_end: string;
  items: RentalItem[];
  equipment_ids: string[];
  status: string;
  total_fcfa: number | null;
  notes: string | null;
  created_at: string;
}

interface Equipment {
  id: string;
  name: string;
  brand: string;
  price_label: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-primary-fixed text-on-primary-fixed",
  active: "bg-on-surface text-surface",
  returned: "bg-surface-container text-on-surface-variant",
  overdue: "bg-error-container text-on-error-container",
  cancelled: "bg-outline-variant/30 text-secondary",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  active: "En cours",
  returned: "Retourné",
  overdue: "En retard",
  cancelled: "Annulé",
};

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Rental | null>(null);
  const [isNew, setIsNew] = useState(false);
  const supabase = createClient();

  useEffect(() => { load(); loadEquipment(); }, []);

  async function load() {
    const { data } = await supabase.from("rentals").select("*").order("created_at", { ascending: false });
    setRentals(data ?? []);
    setLoading(false);
  }

  async function loadEquipment() {
    const { data } = await supabase.from("rental_equipment").select("id, name, brand, price_label, status").order("order_id");
    setEquipment(data ?? []);
  }

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (isNew) {
      await supabase.from("rentals").insert(rest);
    } else {
      await supabase.from("rentals").update({ ...rest, updated_at: new Date().toISOString() }).eq("id", id);
    }
    // Sync equipment status
    if (rest.status === "active") {
      for (const eqId of rest.equipment_ids) {
        await supabase.from("rental_equipment").update({ status: "en_tournage" }).eq("id", eqId);
      }
    }
    setEditing(null);
    setIsNew(false);
    load();
    loadEquipment();
  }

  async function markReturned(rental: Rental) {
    await supabase.from("rentals").update({ status: "returned", updated_at: new Date().toISOString() }).eq("id", rental.id);
    // Set all equipment back to disponible
    for (const eqId of rental.equipment_ids) {
      await supabase.from("rental_equipment").update({ status: "disponible" }).eq("id", eqId);
    }
    load();
    loadEquipment();
  }

  async function activateRental(rental: Rental) {
    await supabase.from("rentals").update({ status: "active", updated_at: new Date().toISOString() }).eq("id", rental.id);
    for (const eqId of rental.equipment_ids) {
      await supabase.from("rental_equipment").update({ status: "en_tournage" }).eq("id", eqId);
    }
    load();
    loadEquipment();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette location ?")) return;
    const rental = rentals.find((r) => r.id === id);
    if (rental && rental.status === "active") {
      for (const eqId of rental.equipment_ids) {
        await supabase.from("rental_equipment").update({ status: "disponible" }).eq("id", eqId);
      }
    }
    await supabase.from("rentals").delete().eq("id", id);
    load();
    loadEquipment();
  }

  function addEquipmentToRental(eq: Equipment) {
    if (!editing) return;
    if (editing.equipment_ids.includes(eq.id)) return;
    setEditing({
      ...editing,
      equipment_ids: [...editing.equipment_ids, eq.id],
      items: [...editing.items, { name: eq.name, brand: eq.brand, price: eq.price_label, equipment_id: eq.id }],
    });
  }

  function removeEquipmentFromRental(eqId: string) {
    if (!editing) return;
    setEditing({
      ...editing,
      equipment_ids: editing.equipment_ids.filter((id) => id !== eqId),
      items: editing.items.filter((i) => i.equipment_id !== eqId),
    });
  }

  function update(field: string, value: string | number | null) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  // Check overdue
  const today = new Date().toISOString().split("T")[0];
  const activeCount = rentals.filter((r) => r.status === "active").length;
  const overdueCount = rentals.filter((r) => r.status === "active" && r.date_end < today).length;

  if (loading) return <p className="text-secondary">Chargement...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Locations</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-secondary">{activeCount} en cours</span>
            {overdueCount > 0 && <span className="text-xs text-error font-bold">{overdueCount} en retard</span>}
          </div>
        </div>
        <button
          onClick={() => {
            setEditing({
              id: "", client_name: "", client_email: "", client_phone: "",
              date_start: today, date_end: today, items: [], equipment_ids: [],
              status: "pending", total_fcfa: null, notes: "", created_at: "",
            });
            setIsNew(true);
          }}
          className="bg-primary-fixed text-on-primary-fixed px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-primary-fixed-dim transition-all"
        >
          + Nouvelle location
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-surface-container-lowest border border-primary-fixed p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">{isNew ? "Nouvelle location" : "Modifier"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Date début</label>
              <input type="date" value={editing.date_start} onChange={(e) => update("date_start", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Date fin</label>
              <input type="date" value={editing.date_end} onChange={(e) => update("date_end", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Statut</label>
              <select value={editing.status} onChange={(e) => update("status", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent">
                <option value="pending">En attente</option>
                <option value="active">En cours</option>
                <option value="returned">Retourné</option>
                <option value="overdue">En retard</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          {/* Equipment selector */}
          <div className="mb-6">
            <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-3">Équipements</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {editing.items.map((item) => (
                <span key={item.equipment_id} className="flex items-center gap-2 bg-on-surface text-surface px-3 py-1.5 text-xs font-bold">
                  {item.brand} {item.name}
                  <button onClick={() => removeEquipmentFromRental(item.equipment_id!)} className="text-surface/50 hover:text-white">×</button>
                </span>
              ))}
              {editing.items.length === 0 && <span className="text-xs text-secondary">Aucun équipement sélectionné</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {equipment.filter((eq) => !editing.equipment_ids.includes(eq.id)).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => addEquipmentToRental(eq)}
                  className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
                    eq.status === "disponible"
                      ? "border-outline-variant/30 hover:bg-primary-container hover:text-on-primary-fixed"
                      : "border-outline-variant/15 text-secondary/50 cursor-not-allowed"
                  }`}
                  disabled={eq.status !== "disponible"}
                >
                  + {eq.brand} {eq.name} {eq.status !== "disponible" ? `(${eq.status})` : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Total FCFA</label>
              <input type="number" value={editing.total_fcfa || ""} onChange={(e) => update("total_fcfa", parseInt(e.target.value) || 0)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
            <div>
              <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Notes</label>
              <input value={editing.notes || ""} onChange={(e) => update("notes", e.target.value)} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-on-surface/80 transition-all">Enregistrer</button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-6 py-3 font-bold uppercase text-xs tracking-widest text-secondary hover:text-on-surface">Annuler</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {rentals.map((r) => {
          const isOverdue = r.status === "active" && r.date_end < today;
          return (
            <div key={r.id} className={`bg-surface-container-lowest border p-5 ${isOverdue ? "border-error/30" : "border-outline-variant/15"} ${r.status === "cancelled" ? "opacity-40" : ""}`}>
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-bold">{r.client_name}</p>
                    <span className={`text-[0.55rem] font-black uppercase px-2 py-1 ${isOverdue ? STATUS_COLORS.overdue : STATUS_COLORS[r.status]}`}>
                      {isOverdue ? "En retard" : STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mb-2">
                    {new Date(r.date_start).toLocaleDateString("fr-FR")} → {new Date(r.date_end).toLocaleDateString("fr-FR")}
                    {r.total_fcfa ? ` — ${r.total_fcfa.toLocaleString()} FCFA` : ""}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.items.map((item, i) => (
                      <span key={i} className="text-[0.55rem] bg-surface-container px-2 py-1 font-bold uppercase tracking-widest">
                        {item.brand} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.status === "pending" && (
                    <button onClick={() => activateRental(r)} className="bg-on-surface text-surface px-4 py-2 text-[0.6rem] font-bold uppercase hover:bg-on-surface/80">
                      Activer
                    </button>
                  )}
                  {(r.status === "active" || isOverdue) && (
                    <button onClick={() => markReturned(r)} className="bg-primary-fixed text-on-primary-fixed px-4 py-2 text-[0.6rem] font-bold uppercase hover:bg-primary-fixed-dim">
                      Retour confirmé
                    </button>
                  )}
                  <button onClick={() => { setEditing(r); setIsNew(false); }} className="p-1.5 hover:bg-surface-container">
                    <span className="material-symbols-outlined text-sm text-secondary">edit</span>
                  </button>
                  <button onClick={() => remove(r.id)} className="p-1.5 hover:bg-error/10">
                    <span className="material-symbols-outlined text-sm text-secondary hover:text-error">delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {rentals.length === 0 && <p className="text-center text-secondary py-8">Aucune location.</p>}
      </div>
    </div>
  );
}
