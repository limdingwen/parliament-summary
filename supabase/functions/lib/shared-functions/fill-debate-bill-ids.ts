import buildResponseProxy from "../utils/build-response-proxy.ts";
import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

async function getBillDebateMatches(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("debate_bill_match_view")
    .select("debate_id, bill_id")
    // Filter to make sure the debate's bill_id is null, so we don't run up on the limit selecting unneeded matches
    .is("debate_bill_id", null);
  if (error) throw error;
  return data;
}

async function updateDebateWithBillId(
  supabase: SupabaseClient,
  rowId: number,
  billId: number,
) {
  const { error } = await supabase
    .from("debate")
    .update({ bill_id: billId })
    .eq("id", rowId);
  if (error) throw error;
}

export default async function fillDebateBillIds(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  let rowCount = 0;
  const matches = await getBillDebateMatches(supabase);
  for (const match of matches) {
    await updateDebateWithBillId(supabase, match.debate_id, match.bill_id);
    rowCount++;
  }

  return buildResponseProxy({
    message: `Filled bill IDs for ${rowCount} debates.`,
  });
}
