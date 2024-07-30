import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import scrapeSittingDates from "../lib/shared-functions/scrape-sitting-dates.ts";

Deno.serve(proxyToResponseWrapper(scrapeSittingDates));
