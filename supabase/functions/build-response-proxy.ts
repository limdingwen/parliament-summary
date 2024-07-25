export default function buildResponseProxy(data: object, status: number = 200) {
  const dataStr = JSON.stringify(data);
  console.info(`Proxy response ${status}: ${dataStr}`);
  return {
    body: dataStr,
    init: {
      headers: { "Content-Type": "application/json" },
      status,
    },
  };
}
