import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import fillDebateBillIds from "../lib/shared-functions/fill-debate-bill-ids.ts";

Deno.serve(proxyToResponseWrapper(fillDebateBillIds));
