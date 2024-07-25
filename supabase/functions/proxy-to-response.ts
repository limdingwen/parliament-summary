export default function proxyToResponse(proxy: {
  body: BodyInit;
  init: ResponseInit;
}) {
  return new Response(proxy.body, proxy.init);
}
