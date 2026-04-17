import { createClient } from "./client";

const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/media/";

/**
 * Extract the storage path from a Supabase public URL
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/media/portfolio/123.jpg" → "portfolio/123.jpg"
 */
function extractStoragePath(url: string): string | null {
  if (!url || !url.includes("/storage/v1/object/public/media/")) return null;
  const parts = url.split("/storage/v1/object/public/media/");
  return parts[1] || null;
}

/**
 * Delete a file from Supabase Storage by its public URL
 */
export async function deleteStorageFile(url: string): Promise<void> {
  const path = extractStoragePath(url);
  if (!path) return; // Not a Supabase Storage URL (external URL like Sanity CDN)

  const supabase = createClient();
  await supabase.storage.from("media").remove([path]);
}

/**
 * Delete multiple files from Supabase Storage
 */
export async function deleteStorageFiles(urls: (string | null | undefined)[]): Promise<void> {
  const paths = urls
    .filter((url): url is string => !!url)
    .map(extractStoragePath)
    .filter((p): p is string => !!p);

  if (paths.length === 0) return;

  const supabase = createClient();
  await supabase.storage.from("media").remove(paths);
}

/**
 * Collect all Supabase Storage URLs from a portfolio item (main_image, gallery, content_blocks)
 */
export function collectPortfolioUrls(item: {
  main_image?: string | null;
  gallery?: string[] | null;
  content_blocks?: Array<{
    type: string;
    url?: string;
    images?: string[];
  }> | null;
}): string[] {
  const urls: string[] = [];

  if (item.main_image) urls.push(item.main_image);
  if (item.gallery) urls.push(...item.gallery);

  if (item.content_blocks) {
    for (const block of item.content_blocks) {
      if (block.url) urls.push(block.url);
      if (block.images) urls.push(...block.images);
    }
  }

  return urls;
}
