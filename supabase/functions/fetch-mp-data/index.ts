import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import fetchMpData from "../lib/shared-functions/fetch-mp-data.ts";

Deno.serve(proxyToResponseWrapper(fetchMpData));
