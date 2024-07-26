import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import proxyToResponseWrapper from "../lib/utils/proxy-to-response-wrapper.ts";
import fillDebateSpeakerIds from "../lib/shared-functions/fill-debate-speaker-ids.ts";

Deno.serve(proxyToResponseWrapper(fillDebateSpeakerIds));
