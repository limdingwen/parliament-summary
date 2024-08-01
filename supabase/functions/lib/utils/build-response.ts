import { corsHeaders } from "./cors.ts";

export function buildResponse(data: object, status: number = 200) {
  const dataStr = JSON.stringify(data);
  console.info(`Response ${status}: ${dataStr}`);
  return new Response(dataStr, {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}
