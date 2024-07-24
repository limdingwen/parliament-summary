import { createClient } from "@/utils/supabase/client";
import PageTitle from "@/app/components/PageTitle";
import React from "react";
import HumanFriendlyColumn from "@/app/components/HumanFriendlyColumn";
import StandardStack from "@/app/components/StandardStack";
import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import BillSummary from "@/app/components/BillSummary";
import BillTimeline from "@/app/components/BillTimeline";

export const runtime = "edge";

function buildBillNoFromBillPath(year: string, billNoOfYear: string) {
  return `${billNoOfYear}/${year}`;
}

async function getBill(billNo: string) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("bill")
    .select(
      "bill_no, name, summary, pdf_url, date_introduced, second_reading_date_type, second_reading_date, is_passed, passed_date",
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
    <HumanFriendlyColumn>
      <StandardStack>
        <PageTitle
          title={bill.name}
          subtitle={`Explore the details of bill number ${bill.bill_no}.`}
        />

        <BillSummary bill={bill} />

        <StandardCard>
          <StandardCardTitle>Timeline</StandardCardTitle>
          <BillTimeline bill={bill} />
        </StandardCard>
      </StandardStack>
    </HumanFriendlyColumn>
  );
}
