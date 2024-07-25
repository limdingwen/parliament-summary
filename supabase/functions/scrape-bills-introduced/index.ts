import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import scrapeBillsIntroduced from "../lib/shared-functions/scrape-bills-introduced.ts";

Deno.serve(proxyToResponseWrapper(scrapeBillsIntroduced));
