export const runtime = "edge";

export default async function FullBill({
  params,
}: {
  params: { billNo: string[] };
}) {
  return <>{JSON.stringify(params.billNo)}</>;
}
