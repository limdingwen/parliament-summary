import { createClient } from "@/utils/supabase/client";
import { Center, Stack, Title } from "@mantine/core";

export const runtime = "edge";

function buildBillNoFromBillPath(year: string, billNoOfYear: string) {
  return `${billNoOfYear}/${year}`;
}

async function getBill(billNo: string) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, second_reading_date_type, second_reading_date, is_passed, passed_date, summary",
    )
    .eq("bill_no", billNo)
    .single();
  if (error) throw error;
  return data;
}

export default async function FullBill({
  params,
}: {
  params: { year: string; billNoOfYear: string };
}) {
  const bill = await getBill(
    buildBillNoFromBillPath(params.year, params.billNoOfYear),
  );

  return (
    <Center>
      <Stack gap="md" justify="center" align="stretch" maw={800}>
        <div className="fill-parent-max-width">
          <Title>{bill.name}</Title>

          <p>Test test hi</p>
        </div>
      </Stack>
    </Center>
  );
}
