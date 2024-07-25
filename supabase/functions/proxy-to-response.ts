export default function proxyToResponse(proxy: {
  body: BodyInit;
  init: ResponseInit;
}) {
  console.log(`Response ${proxy.init.status}: ${proxy.body}`);
  return new Response(proxy.body, proxy.init);
}
