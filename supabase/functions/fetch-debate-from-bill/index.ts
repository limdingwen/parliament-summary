import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createSupabase } from "../lib/utils/create-supabase.ts";
import { buildResponse } from "../lib/utils/build-response.ts";
import { corsHeaders } from "../lib/utils/cors.ts";

async function getDebateIdFromBillId(billId: number) {
  const supabase = createSupabase();
  const { data, error } = await supabase
    .from("debate_bill_match_view")
    .select("debate_id")
    .eq("bill_id", billId)
    .eq("is_second_reading", true)
    // If there's multiple second readings detected, just ignore it for now...
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? data.debate_id : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { billId } = await req.json();
  const debateId = await getDebateIdFromBillId(billId);

  return buildResponse({
    debateId,
  });
});
