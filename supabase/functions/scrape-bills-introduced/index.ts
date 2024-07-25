import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../proxy-to-response-wrapper.ts";
import scrapeBillsIntroduced from "../scrape-bills-introduced.ts";

Deno.serve(proxyToResponseWrapper(scrapeBillsIntroduced));
