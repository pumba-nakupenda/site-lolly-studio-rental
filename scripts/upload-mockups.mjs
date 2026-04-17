import { createClient } from "@supabase/supabase-js";
import { readFileSync, statSync } from "fs";
import { basename } from "path";

const supabase = createClient(
  "https://mrycrcktcetlffxdpvvf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeWNyY2t0Y2V0bGZmeGRwdnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTk5NTUsImV4cCI6MjA4OTA3NTk1NX0.eqF-yfGCT9BPijP4-2ChS4qRUo8MsGQUlfIH3M-5CkY"
);

const { error: authError } = await supabase.auth.signInWithPassword({
  email: "oudama@lolly.sn", password: "781227",
});
if (authError) { console.error("Auth failed:", authError.message); process.exit(1); }
console.log("Authenticated ✓\n");

const BASE = "/Users/oudama/Library/CloudStorage/SynologyDrive-LOLLY/03_RESSOURCES_MEDIA/Mockups/MOCKUP";

async function upload(filePath, folder) {
  try {
    const stat = statSync(filePath);
    if (stat.size === 0 || stat.size > 200 * 1024 * 1024) {
      console.log(`  ⊘ Skip (${stat.size === 0 ? "empty" : "too large"}): ${basename(filePath)}`);
      return null;
    }
    const file = readFileSync(filePath);
    const ext = filePath.split(".").pop().toLowerCase();
    const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const ct = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const { error } = await supabase.storage.from("media").upload(name, file, { contentType: ct, upsert: false });
    if (error) { console.log(`  ✗ ${basename(filePath)}: ${error.message}`); return null; }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(name);
    console.log(`  ✓ ${basename(filePath)}`);
    return publicUrl;
  } catch (e) { console.log(`  ✗ ${basename(filePath)}: ${e.message}`); return null; }
}

// Map slug → mockup folder + update existing projects with gallery
const existingUpdates = [
  { slug: "ndi-institutionnel", folder: "ndi", files: [
    `${BASE}/ndi/MOCKUP - Echarpe - Atelier de capitalisation - V01.jpg`,
    `${BASE}/ndi/KAKEMONO.jpg`,
    `${BASE}/ndi/9291816[1].jpg`,
    `${BASE}/ndi/O7DBBU1[1]-Recovered.jpg`,
    `${BASE}/ndi/plastic-tree-interior-decoration-Recovered.jpg`,
  ]},
  { slug: "branding-omvs-forum", folder: "omvs", files: [
    `${BASE}/omvs/MOCKUP OMVS.jpg`,
    `${BASE}/omvs/OMVS.jpg`,
    `${BASE}/omvs/SAVE THE DATE.jpg`,
    `${BASE}/omvs/hivernage 225.jpg`,
  ]},
  { slug: "kadior-melokaan", folder: "kadior", files: [
    `${BASE}/kadior/MELOKAAN.jpg`,
  ]},
  { slug: "luxia-boutique", folder: "luxia", files: [
    `${BASE}/luxia/branding boutique-01.jpg`,
    `${BASE}/luxia/branding boutique-02.jpg`,
  ]},
  { slug: "tapisserie-torrejon", folder: "torrejon", files: [
    `${BASE}/tapicerie torrejon/LOGO TAPICERIE TORREJON THIAM.jpg`,
  ]},
  { slug: "lolly-branding", folder: "lolly", files: [
    `${BASE}/lolly/3 INGREDIENTS DUN BRANDING (1)-01.jpg`,
    `${BASE}/lolly/sercive lolly-01.jpg`,
  ]},
  { slug: "raob-branding", folder: "raob", files: [
    `${BASE}/raob/bache raob.jpg`,
    `${BASE}/raob/Notepad8[1].jpg`,
    `${BASE}/raob/agenda raob.jpg`,
  ]},
  { slug: "investment-advice", folder: "investment", files: [
    `${BASE}/investiment advice/investiment advice.jpg`,
    `${BASE}/investiment advice/investiment advice (1).jpg`,
    `${BASE}/investiment advice/investiment advice (2).jpg`,
  ]},
  { slug: "isd-group", folder: "isd", files: [
    `${BASE}/isd groups/PEINTURE.jpg`,
    `${BASE}/isd groups/carreaux-01.jpg`,
    `${BASE}/isd groups/carreaux-02.jpg`,
    `${BASE}/isd groups/carreaux-03.jpg`,
    `${BASE}/isd groups/tole indule carre.jpg`,
  ]},
];

// Also update main_image for projects that had Sanity CDN placeholders
const mainImageUpdates = [
  { slug: "ndi-institutionnel", file: `${BASE}/ndi/KAKEMONO.jpg` },
  { slug: "kadior-melokaan", file: `${BASE}/kadior/MELOKAAN.jpg` },
  { slug: "luxia-boutique", file: `${BASE}/luxia/branding boutique-01.jpg` },
  { slug: "raob-branding", file: `${BASE}/raob/bache raob.jpg` },
  { slug: "investment-advice", file: `${BASE}/investiment advice/investiment advice.jpg` },
  { slug: "tapisserie-torrejon", file: `${BASE}/tapicerie torrejon/LOGO TAPICERIE TORREJON THIAM.jpg` },
  { slug: "lolly-branding", file: `${BASE}/lolly/3 INGREDIENTS DUN BRANDING (1)-01.jpg` },
  { slug: "isd-group", file: `${BASE}/isd groups/PEINTURE.jpg` },
  { slug: "branding-omvs-forum", file: `${BASE}/omvs/MOCKUP OMVS.jpg` },
];

console.log("=== Uploading main images ===\n");
for (const { slug, file } of mainImageUpdates) {
  console.log(`[${slug}] main image`);
  const url = await upload(file, `portfolio/${slug}`);
  if (url) {
    await supabase.from("portfolio").update({ main_image: url }).eq("slug", slug);
    console.log(`  → main_image updated`);
  }
}

console.log("\n=== Uploading gallery mockups ===\n");
for (const { slug, folder, files } of existingUpdates) {
  console.log(`[${slug}] ${files.length} files`);
  const urls = [];
  for (const f of files) {
    const url = await upload(f, `portfolio/${folder}`);
    if (url) urls.push(url);
  }
  if (urls.length > 0) {
    // Append to existing gallery
    const { data: current } = await supabase.from("portfolio").select("gallery").eq("slug", slug).single();
    const existing = current?.gallery ?? [];
    const merged = [...existing, ...urls];
    await supabase.from("portfolio").update({ gallery: merged }).eq("slug", slug);
    console.log(`  → gallery: ${existing.length} existing + ${urls.length} new = ${merged.length} total`);
  }
}

console.log("\nDone!");
process.exit(0);
