import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { buildResponse } from "../lib/utils/build-response.ts";
import scrapeBillsIntroduced from "../lib/shared-functions/scrape-bills-introduced.ts";
import fetchMpData from "../lib/shared-functions/fetch-mp-data.ts";
import scrapeSittingReport from "../lib/shared-functions/scrape-sitting-report.ts";
import scrapeOrderPaperDates from "../lib/shared-functions/scrape-order-paper-dates.ts";

Deno.serve(async (req) => {
  return buildResponse([
    await fetchMpData(req),
    await scrapeOrderPaperDates(req),
    await scrapeSittingReport(req),
    await scrapeBillsIntroduced(req),
  ]);
});
