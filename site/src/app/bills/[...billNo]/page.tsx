import { AppShell, AppShellMain } from "@mantine/core";

export const runtime = "edge";

export default async function FullBill({
  params,
}: {
  params: { billNo: string[] };
}) {
  return (
    <AppShell padding="md">
      <AppShellMain>{JSON.stringify(params.billNo)}</AppShellMain>
    </AppShell>
  );
}
