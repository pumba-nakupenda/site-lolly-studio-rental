import { createStaticClient } from "@/lib/supabase/static";
import type { MetadataRoute } from "next";

const BASE = "https://lolly.sn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const [{ data: portfolio }, { data: equipment }] = await Promise.all([
    supabase.from("portfolio").select("slug").order("grid_order"),
    supabase.from("rental_equipment").select("slug").order("order_id"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE },
    { url: `${BASE}/studio` },
    { url: `${BASE}/studio/projets` },
    { url: `${BASE}/production` },
    { url: `${BASE}/academy` },
    { url: `${BASE}/academy/formation-intensive` },
    { url: `${BASE}/academy/accompagnement` },
    { url: `${BASE}/academy/ateliers` },
    { url: `${BASE}/academy/diagnostic` },
    { url: `${BASE}/about` },
    { url: `${BASE}/contact` },
  ];

  const portfolioPages: MetadataRoute.Sitemap = (portfolio ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE}/studio/projets/${p.slug}`,
    }));

  const equipmentPages: MetadataRoute.Sitemap = (equipment ?? [])
    .filter((e) => e.slug)
    .map((e) => ({
      url: `${BASE}/production/${e.slug}`,
    }));

  return [...staticPages, ...portfolioPages, ...equipmentPages];
}
