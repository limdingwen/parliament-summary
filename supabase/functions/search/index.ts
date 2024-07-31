import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createSupabase } from "../lib/utils/create-supabase.ts";
import { SupabaseClient } from "https://esm.sh/v135/@supabase/supabase-js@2.24.0/dist/module/index.d.ts";
import { buildResponse } from "../lib/utils/build-response.ts";
import { corsHeaders } from "../lib/utils/cors.ts";

type ClientFriendlyData = {
  href: string;
  title: string;
};

function removeDuplicates<T>(data: T[], propertyKeyToDeduplicate: keyof T) {
  const seen = new Set();
  return data.filter((item) => {
    const value = item[propertyKeyToDeduplicate];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

async function getDebateSearchResults(
  supabase: SupabaseClient,
  query: string,
): Promise<ClientFriendlyData[]> {
  const { data, error } = await supabase
    .from("debate_speech_full_text_view")
    .select("debate_id, title")
    .textSearch("full_text", query, { type: "websearch" });
  if (error) throw error;
  const dedupData = removeDuplicates(data, "debate_id");
  return dedupData.map((debate) => ({
    href: `/debate/${debate.debate_id}`,
    title: debate.title,
  }));
}

function flipBillNo(billNo: string) {
  const [billOfYear, year] = billNo.split("/");
  return `${year}/${billOfYear}`;
}

async function getBillSearchResults(
  supabase: SupabaseClient,
  query: string,
): Promise<ClientFriendlyData[]> {
  const { data, error } = await supabase
    .from("bill_full_text_view")
    .select("bill_no, name")
    .textSearch("full_text", query, { type: "websearch" });
  if (error) throw error;
  const dedupData = removeDuplicates(data, "bill_no");
  return dedupData.map((bill) => ({
    href: `/bill/${flipBillNo(bill.bill_no)}`,
    title: bill.name,
  }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createSupabase();

  const { query } = await req.json();
  const debateSearchResults = await getDebateSearchResults(supabase, query);
  const billSearchResults = await getBillSearchResults(supabase, query);

  return buildResponse({
    debate: debateSearchResults,
    bill: billSearchResults,
  });
});
