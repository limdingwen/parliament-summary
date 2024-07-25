import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../proxy-to-response-wrapper.ts";
import generateBillsSummary from "../generate-bills-summary.ts";

Deno.serve(proxyToResponseWrapper(generateBillsSummary));
