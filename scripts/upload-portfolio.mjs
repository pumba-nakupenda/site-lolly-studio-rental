import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { basename } from "path";

const supabase = createClient(
  "https://mrycrcktcetlffxdpvvf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeWNyY2t0Y2V0bGZmeGRwdnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTk5NTUsImV4cCI6MjA4OTA3NTk1NX0.eqF-yfGCT9BPijP4-2ChS4qRUo8MsGQUlfIH3M-5CkY"
);

// Sign in first
const { error: authError } = await supabase.auth.signInWithPassword({
  email: "oudama@lolly.sn",
  password: "781227",
});
if (authError) { console.error("Auth failed:", authError.message); process.exit(1); }
console.log("Authenticated ✓");

async function upload(filePath, folder) {
  const file = readFileSync(filePath);
  const ext = filePath.split(".").pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(name, file, {
    contentType: ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "mp4" ? "video/mp4" : "application/octet-stream",
    upsert: false,
  });
  if (error) { console.error(`Upload failed: ${filePath}`, error.message); return null; }
  const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(name);
  console.log(`  ✓ ${basename(filePath)} → ${name}`);
  return publicUrl;
}

const BASE = "/Users/oudama/Library/CloudStorage/SynologyDrive-LOLLY/01_PROJETS";

const projects = [
  {
    title: "OMVS — 150ème Réunion",
    slug: "omvs-150eme-reunion",
    client: "OMVS",
    category: "Design Graphique",
    year: "2026",
    description: "Conception des supports visuels pour la 150ème réunion de l'Organisation pour la Mise en Valeur du fleuve Sénégal. Bannières, save the date, kakemonos, banderoles et carrousels réseaux sociaux.",
    services: ["Design Graphique", "Signalétique", "Social Media"],
    mainImage: `${BASE}/OMVS/03 Contenus/Publication/photo couverture 150-ème REUNION-01.jpg`,
    gallery: [
      `${BASE}/OMVS/03 Contenus/Publication/SAVE THE DATE 20 24 JANVIER 2026 BACHE.jpg`,
      `${BASE}/OMVS/03 Contenus/Publication/bonne annee 2026 omvs banniere-01.jpg`,
      `${BASE}/OMVS/03 Contenus/Publication/banderole version francais 4m 2m.jpg`,
      `${BASE}/OMVS/03 Contenus/Publication/kakemono 9eme connsiel du reseau.jpg`,
    ],
    gridSpan: "md:col-span-7 md:row-span-2",
    gridRatio: "aspect-[3/4]",
  },
  {
    title: "OMVS — Communication Digitale",
    slug: "omvs-communication-digitale",
    client: "OMVS",
    category: "Design Graphique",
    year: "2025",
    description: "Community management et création de contenu pour l'OMVS. Carrousels de présentation institutionnelle, visuels événementiels et campagnes digitales.",
    services: ["Social Media", "Design Graphique", "Community Management"],
    mainImage: `${BASE}/OMVS/03 Contenus/Visuels/Carroussel de presentation/Carroussel de presentation_Plan de travail 1.jpg`,
    gallery: [
      `${BASE}/OMVS/03 Contenus/Visuels/Carroussel de presentation/Carroussel de presentation-02.jpg`,
      `${BASE}/OMVS/03 Contenus/Visuels/Carroussel de presentation/Carroussel de presentation-03.jpg`,
    ],
    gridSpan: "md:col-span-5",
    gridRatio: "aspect-square",
  },
  {
    title: "FIRDO — Identité Événementielle",
    slug: "firdo-identite-evenementielle",
    client: "FIRDO",
    category: "Branding",
    year: "2025",
    description: "Création de l'identité visuelle événementielle pour FIRDO. Oriflammes, mockups t-shirt, supports de communication pour événements terrain.",
    services: ["Branding", "Design Event", "Signalétique"],
    mainImage: `${BASE}/FIRDO/03 Contenus/Visuels/MOCKUP TSHIRT-01.jpg`,
    gallery: [
      `${BASE}/FIRDO/03 Contenus/Visuels/ORIFLAMME-01-01-02.jpg`,
      `${BASE}/FIRDO/03 Contenus/Visuels/ORIFLAMME2-01.jpg`,
      `${BASE}/FIRDO/03 Contenus/Visuels/ORIFLAMME-01.jpg`,
    ],
    gridSpan: "md:col-span-5",
    gridRatio: "aspect-[8/5]",
  },
  {
    title: "Metal Azur — Identité Visuelle",
    slug: "metal-azur-identite-visuelle",
    client: "Metal Azur",
    category: "Branding",
    year: "2025",
    description: "Conception du logo et de l'identité visuelle pour Metal Azur, entreprise spécialisée dans les matériaux de construction au Sénégal.",
    services: ["Branding", "Logo", "Charte Graphique"],
    mainImage: `${BASE}/METAL AZUR/03 Contenus/Visuels/Untitled-5-01.png`,
    gallery: [
      `${BASE}/METAL AZUR/03 Contenus/Visuels/LOGO PNG-01.png`,
      `${BASE}/METAL AZUR/03 Contenus/Visuels/LOGO AZUR METAL (1)-01.jpg`,
    ],
    gridSpan: "md:col-span-7",
    gridRatio: "aspect-[8/5]",
  },
  {
    title: "ISD Group — Refonte Graphique",
    slug: "isd-group-refonte",
    client: "ISD Group",
    category: "Design Graphique",
    year: "2024",
    description: "Refonte de l'identité graphique et création de l'ensemble des supports de communication corporate pour ISD Group.",
    services: ["Design Graphique", "Charte Graphique", "Supports Corporate"],
    mainImage: `${BASE}/ISD GROUP/03 Contenus/Visuels/LOGO ISD PNG-01.png`,
    gallery: [
      `${BASE}/ISD GROUP/05 Archives/logo isd groupe-01-01.png`,
    ],
    gridSpan: "md:col-span-5",
    gridRatio: "aspect-[5/8]",
  },
  {
    title: "ONG3D — Motion Design Budgétaire",
    slug: "ong3d-motion-design",
    client: "ONG3D / PASC",
    category: "Design Graphique",
    year: "2026",
    description: "Production de vidéos motion design pour la présentation budgétaire et la transparence financière. Vidéos 4K verticales et horizontales pour diffusion digitale et événementielle.",
    services: ["Motion Design", "Production Vidéo", "Design Graphique"],
    mainImage: `${BASE}/../Organisaton/01_PROJETS/CLIENTS/ONG3D/logos_HD/logo_ONG3D_HD.png`,
    gallery: [],
    gridSpan: "md:col-span-7",
    gridRatio: "aspect-[16/9]",
  },
];

console.log(`\nUploading ${projects.length} projects...\n`);

for (let i = 0; i < projects.length; i++) {
  const p = projects[i];
  console.log(`[${i + 1}/${projects.length}] ${p.title}`);

  // Upload main image
  const mainUrl = await upload(p.mainImage, "portfolio");
  if (!mainUrl) { console.error("  ✗ Skipping — main image failed"); continue; }

  // Upload gallery
  const galleryUrls = [];
  for (const img of p.gallery) {
    const url = await upload(img, "portfolio/gallery");
    if (url) galleryUrls.push(url);
  }

  // Insert into portfolio
  const { error } = await supabase.from("portfolio").insert({
    id: crypto.randomUUID(),
    title: p.title,
    slug: p.slug,
    client: p.client,
    category: p.category,
    year: p.year,
    description: p.description,
    services: p.services,
    main_image: mainUrl,
    gallery: galleryUrls,
    grid_span: p.gridSpan,
    grid_ratio: p.gridRatio,
    grid_order: 10 + i, // After existing 9 projects
  });

  if (error) {
    console.error("  ✗ DB insert failed:", error.message);
  } else {
    console.log(`  ✓ Inserted with ${galleryUrls.length} gallery images`);
  }
}

console.log("\nDone!");
process.exit(0);
