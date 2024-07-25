import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../proxy-to-response-wrapper.ts";
import scrapeBillsPdf from "../scrape-bills-pdf.ts";

Deno.serve(proxyToResponseWrapper(scrapeBillsPdf));
