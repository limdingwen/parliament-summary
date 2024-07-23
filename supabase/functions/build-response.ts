export function buildResponse(
  data: object,
  status: number | undefined = undefined,
) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}
