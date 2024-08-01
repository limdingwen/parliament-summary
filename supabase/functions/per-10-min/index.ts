import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import scrapeBillsPdf from "../lib/shared-functions/scrape-bills-pdf.ts";
import generateBillsSummary from "../lib/shared-functions/generate-bills-summary.ts";
import { buildResponse } from "../lib/utils/build-response.ts";
// import fillDebateSpeakerIds from "../lib/shared-functions/fill-debate-speaker-ids.ts";
import generateDebateSummary from "../lib/shared-functions/generate-debate-summary.ts";
// import fillDebateBillIds from "../lib/shared-functions/fill-debate-bill-ids.ts";

Deno.serve(async (req) => {
  return buildResponse([
    // await fillDebateSpeakerIds(req),
    // await fillDebateBillIds(req),
    await scrapeBillsPdf(req),
    await generateBillsSummary(req),
    await generateDebateSummary(req),
  ]);
});
