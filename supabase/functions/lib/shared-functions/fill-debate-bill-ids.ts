import buildResponseProxy from "../utils/build-response-proxy.ts";
import { createSupabase } from "../utils/create-supabase.ts";
import { isAdmin } from "../utils/check-admin.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";

async function getDebatesWithNoBillLinked(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("debate")
    .select("id, title, bill_id")
    .is("bill_id", null);
  if (error) throw error;
  return data;
}

async function fetchBillIdFromBillName(
  supabase: SupabaseClient,
  billName: string,
) {
  const { data, error } = await supabase
    .from("bill")
    .select("id")
    .eq("name", billName)
    .limit(1)
    .maybeSingle();
  if (error) throw error;

  const result = data ? data.id : null;
  console.log(`Found bill ID for ${billName}: ${result}`);

  return result;
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

// Goes through all debate speeches and fills in the bill_id field via the title field
// This is to enable dynamic aliasing without needing to re-scrape the entire database
export default async function fillDebateBillIds(req: Request) {
  const supabase = createSupabase();

  if (!isAdmin(req)) {
    return buildResponseProxy({ message: "Unauthorised." }, 401);
  }

  let rowCount = 0;
  let potentialRowCount = 0;

  const debatesWithNoBillLinked = await getDebatesWithNoBillLinked(supabase);

  for (const debateWithNoBillLinked of debatesWithNoBillLinked) {
    const billId = await fetchBillIdFromBillName(
      supabase,
      debateWithNoBillLinked.title,
    );

    // We assume that we are only working with billId = null rows, so if billId is still null,
    // don't bother updating it.
    if (billId) {
      await updateDebateWithBillId(supabase, debateWithNoBillLinked.id, billId);
      rowCount++;
    }

    potentialRowCount++;
  }

  return buildResponseProxy({
    message: `Filled bill IDs for ${rowCount} out of ${potentialRowCount} debates.`,
  });
}
