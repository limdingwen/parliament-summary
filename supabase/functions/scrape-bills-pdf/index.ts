import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import scrapeBillsPdf from "../lib/shared-functions/scrape-bills-pdf.ts";

Deno.serve(proxyToResponseWrapper(scrapeBillsPdf));
