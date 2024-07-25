import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import scrapeBillsPdf from "../scrape-bills-pdf.ts";
import generateBillsSummary from "../generate-bills-summary.ts";
import { buildResponse } from "../build-response.ts";

Deno.serve(async (req) => {
  return buildResponse([
    await scrapeBillsPdf(req),
    await generateBillsSummary(req),
  ]);
});
