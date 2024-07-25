import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { buildResponse } from "../lib/utils/build-response.ts";
import scrapeBillsIntroduced from "../lib/shared-functions/scrape-bills-introduced.ts";

Deno.serve(async (req) => {
  return buildResponse([await scrapeBillsIntroduced(req)]);
});
