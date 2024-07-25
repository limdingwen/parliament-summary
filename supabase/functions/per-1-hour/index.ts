import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { buildResponse } from "../build-response.ts";
import scrapeBillsIntroduced from "../scrape-bills-introduced.ts";

Deno.serve(async (req) => {
  return buildResponse([await scrapeBillsIntroduced(req)]);
});
