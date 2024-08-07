import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import refreshDebateBillMatchView from "../lib/shared-functions/refresh-debate-bill-match-view.ts";

Deno.serve(proxyToResponseWrapper(refreshDebateBillMatchView));
