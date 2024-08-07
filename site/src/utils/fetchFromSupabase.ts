export default async function fetchFromSupabase<T>(
  functionName: string,
  body: object,
) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${functionName}`;
  const headers = new Headers({
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  });
  const request = new Request(url, {
    headers: headers,
    method: "POST",
    body: JSON.stringify(body),
  });
  const response = await fetch(request);
  return (await response.json()) as Promise<T>;
}
