import { createClient } from "https://esm.sh/@supabase/supabase-js@v2.24.0";
import { Database } from "./database.types.ts";

export function createSupabase() {
  return createClient<Database>(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}
