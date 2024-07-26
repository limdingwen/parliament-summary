import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import scrapeSittingReport from "../lib/shared-functions/scrape-sitting-report.ts";

Deno.serve(proxyToResponseWrapper(scrapeSittingReport));
