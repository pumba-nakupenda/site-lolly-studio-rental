import { createStaticClient } from "@/lib/supabase/static";
import type { MetadataRoute } from "next";

const BASE = "https://lolly.sn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  const [{ data: portfolio }, { data: equipment }] = await Promise.all([
    supabase.from("portfolio").select("slug, created_at").order("grid_order"),
    supabase.from("rental_equipment").select("slug, created_at").order("order_id"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/studio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/studio/projets`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/rental`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const portfolioPages: MetadataRoute.Sitemap = (portfolio ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${BASE}/studio/projets/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const equipmentPages: MetadataRoute.Sitemap = (equipment ?? [])
    .filter((e) => e.slug)
    .map((e) => ({
      url: `${BASE}/rental/${e.slug}`,
      lastModified: e.created_at ? new Date(e.created_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

  return [...staticPages, ...portfolioPages, ...equipmentPages];
}
