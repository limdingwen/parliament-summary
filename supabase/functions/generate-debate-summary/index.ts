import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import generateDebateSummary from "../lib/shared-functions/generate-debate-summary.ts";

Deno.serve(proxyToResponseWrapper(generateDebateSummary));
