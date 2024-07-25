export function isAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  return token == Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
}
