import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabase = createClient(
  "https://mrycrcktcetlffxdpvvf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeWNyY2t0Y2V0bGZmeGRwdnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0OTk5NTUsImV4cCI6MjA4OTA3NTk1NX0.eqF-yfGCT9BPijP4-2ChS4qRUo8MsGQUlfIH3M-5CkY"
);

const { error: authError } = await supabase.auth.signInWithPassword({
  email: "oudama@lolly.sn",
  password: "781227",
});
if (authError) { console.error("Auth failed:", authError.message); process.exit(1); }
console.log("Authenticated ✓\n");

// Upload BudgetPresentation.mp4 (33MB)
const videoPath = "/Users/oudama/Library/CloudStorage/SynologyDrive-LOLLY/Organisaton/01_PROJETS/CLIENTS/ONG3D/001_VIDEOS_REMOTION/out/BudgetPresentation.mp4";
console.log("Uploading BudgetPresentation.mp4 (33MB)...");

const file = readFileSync(videoPath);
const storagePath = `portfolio/video/ong3d-budget-presentation.mp4`;

const { error: uploadError } = await supabase.storage.from("media").upload(storagePath, file, {
  contentType: "video/mp4",
  upsert: true,
});

if (uploadError) {
  console.error("Upload failed:", uploadError.message);
  process.exit(1);
}

const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(storagePath);
console.log(`✓ Uploaded → ${publicUrl}\n`);

// Add video as content_block to ONG3D project
const contentBlocks = [
  {
    type: "text",
    title: "Le Projet",
    body: "Production de vidéos motion design pour la présentation budgétaire de l'ONG3D/PASC. Un outil de transparence financière destiné aux citoyens et partenaires institutionnels."
  },
  {
    type: "video",
    url: publicUrl,
    caption: "Motion Design — Présentation Budgétaire ONG3D/PASC"
  },
  {
    type: "text",
    title: "Approche",
    body: "Vidéos 4K produites en motion design via Remotion, avec infographies animées pour rendre les données budgétaires accessibles et engageantes. Versions verticale et horizontale pour diffusion sur réseaux sociaux et événements."
  }
];

const { error: updateError } = await supabase
  .from("portfolio")
  .update({ content_blocks: contentBlocks, video_url: publicUrl })
  .eq("slug", "ong3d-motion-design");

if (updateError) {
  console.error("DB update failed:", updateError.message);
} else {
  console.log("✓ Content blocks + video added to ONG3D project");
}

console.log("\nDone!");
process.exit(0);
