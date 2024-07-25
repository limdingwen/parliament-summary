import proxyToResponse from "./proxy-to-response.ts";

export default function proxyToResponseWrapper(
  fn: (req: Request) => Promise<{ body: BodyInit; init: ResponseInit }>,
) {
  return async (req: Request) => {
    const proxy = await fn(req);
    return proxyToResponse(proxy);
  };
}
