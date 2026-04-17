"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-on-surface flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-2">
          <Logo height={32} color="white" />
        </div>
        <p className="text-surface-variant text-sm mb-10">
          Administration du site
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[0.65rem] uppercase tracking-widest text-surface-variant block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white py-3 px-4 text-sm focus:border-primary-fixed focus:outline-none transition-colors"
              placeholder="admin@lolly.sn"
            />
          </div>
          <div>
            <label className="text-[0.65rem] uppercase tracking-widest text-surface-variant block mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white py-3 px-4 text-sm focus:border-primary-fixed focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-error text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-fixed text-on-primary-fixed font-bold uppercase text-xs tracking-widest py-4 hover:bg-primary-fixed-dim transition-all disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
