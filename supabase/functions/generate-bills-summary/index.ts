import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import generateBillsSummary from "../lib/shared-functions/generate-bills-summary.ts";

Deno.serve(proxyToResponseWrapper(generateBillsSummary));
