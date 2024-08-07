import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import buildResponseProxy from "../utils/build-response-proxy.ts";

async function refresh() {
  const supabase = createSupabase();
  const { error } = await supabase.rpc("refresh_materialized_view", {
    view_name: "public.debate_bill_match_view",
  });
  if (error) throw error;
}

export default async function refreshDebateBillMatchView(req: Request) {
  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  await refresh();

  return buildResponseProxy({
    message: "Refreshed debate_bill_match_view.",
  });
}
