import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client without cookies — safe for generateStaticParams and build-time operations
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
