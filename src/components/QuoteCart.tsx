"use client";

import { useState, createContext, useContext, type ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price_label: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  isOpen: false,
  setIsOpen: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  function addItem(item: CartItem) {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    // Don't auto-open — let the user browse and open when ready
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function CartPanel() {
  const { items, removeItem, clearCart, isOpen, setIsOpen } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dates, setDates] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!name || !email || items.length === 0) return;
    setSubmitting(true);

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        service_interest: "Location Équipement",
        message: `Demande de devis pour ${items.length} équipement(s):\n${items.map((i) => `- ${i.brand} ${i.name} (${i.price_label})`).join("\n")}\n\nDates souhaitées: ${dates}\nNotes: ${notes}`,
        request_type: "equipment_quote",
        request_data: { items: items.map((i) => ({ name: i.name, brand: i.brand, price: i.price_label })), dates, notes },
      }),
    });

    setSubmitted(true);
    setSubmitting(false);
    clearCart();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/50" onClick={() => setIsOpen(false)} />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-surface h-full overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-outline-variant/15 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter">Votre devis</h2>
            <p className="text-xs text-secondary">{items.length} équipement{items.length > 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-primary-fixed text-5xl">check_circle</span>
            <h3 className="text-xl font-bold">Demande envoyée !</h3>
            <p className="text-sm text-secondary">Nous vous recontacterons sous 24h avec votre devis personnalisé.</p>
            <button onClick={() => { setSubmitted(false); setIsOpen(false); }} className="bg-on-surface text-surface px-6 py-3 font-bold uppercase text-xs tracking-widest">
              Fermer
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Items */}
            {items.length === 0 ? (
              <p className="text-center text-secondary py-8">Votre panier est vide.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-surface-container-lowest p-4 border border-outline-variant/15">
                    <div>
                      <p className="text-[0.6rem] text-secondary uppercase tracking-widest">{item.brand}</p>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-primary font-bold mt-1">{item.price_label}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-secondary hover:text-error">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <>
                {/* Dates */}
                <div>
                  <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">Dates souhaitées</label>
                  <input value={dates} onChange={(e) => setDates(e.target.value)} placeholder="Ex: 15-18 Janvier 2026" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                </div>

                {/* Contact info */}
                <div className="space-y-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom *" required className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" type="email" required className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" type="tel" className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent" />
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes complémentaires..." rows={2} className="w-full border border-outline-variant/30 py-2 px-3 text-sm bg-transparent resize-none" />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !name || !email}
                  className="w-full bg-primary-fixed text-on-primary-fixed font-black uppercase py-4 text-xs tracking-widest hover:bg-primary-fixed-dim transition-all disabled:opacity-50"
                >
                  {submitting ? "Envoi..." : "Envoyer la demande de devis"}
                </button>

                {/* WhatsApp alternative */}
                <a
                  href={`https://wa.me/+221772354747?text=${encodeURIComponent(
                    `Bonjour LOLLY, je souhaiterais un devis pour:\n${items.map((i) => `- ${i.brand} ${i.name}`).join("\n")}\nDates: ${dates}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-on-surface text-on-surface font-bold uppercase py-3 text-xs tracking-widest text-center block hover:bg-on-surface hover:text-surface transition-all"
                >
                  Ou via WhatsApp
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function CartBadge() {
  const { items, setIsOpen } = useCart();
  if (items.length === 0) return null;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 bg-primary-fixed text-on-primary-fixed w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary-fixed-dim transition-all"
    >
      <span className="material-symbols-outlined text-xl">shopping_bag</span>
      <span className="absolute -top-1 -right-1 bg-on-surface text-surface text-[0.6rem] font-black w-5 h-5 flex items-center justify-center">
        {items.length}
      </span>
    </button>
  );
}
