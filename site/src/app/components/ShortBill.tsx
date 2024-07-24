import { Badge, Group, Stack } from "@mantine/core";
import moment from "moment/moment";
import Markdown from "react-markdown";
import SummaryAiDisclaimer from "@/app/components/SummaryAiDisclaimer";
import StandardCard from "@/app/components/StandardCard";
import StandardCardTitle from "@/app/components/StandardCardTitle";
import StandardCardDescription from "@/app/components/StandardCardDescription";
import SummaryNotAvailableApology from "@/app/components/SummaryNotAvailableApology";
import StandardButton from "@/app/components/StandardButton";
import BillOriginalPdfButton from "@/app/components/BillOriginalPdfButton";

function flipBillNo(billNo: string) {
  const [billOfYear, year] = billNo.split("/");
  return `${year}/${billOfYear}`;
}
export default async function ShortBill({
  bill,
}: {
  bill: {
    bill_no: string;
    name: string;
    second_reading_date_type: string;
    second_reading_date: string | null;
    is_passed: boolean;
    passed_date: string | null;
    summary: string | null;
    pdf_url: string;
  };
}) {
  return (
    <StandardCard>
      <Group justify="space-between">
        <StandardCardTitle>{bill.name}</StandardCardTitle>
        {bill.is_passed ? (
          <Badge color="gray">
            Passed {moment(bill.passed_date).fromNow()}
          </Badge>
        ) : (
          <Badge color="pink">
            {bill.second_reading_date_type == "explicit"
              ? `Reading ${moment(bill.second_reading_date).fromNow()}`
              : "Reading during next seating"}
          </Badge>
        )}
      </Group>

      <StandardCardDescription>
        {bill.summary ? (
          <Stack>
            <Markdown>{bill.summary}</Markdown>
            <SummaryAiDisclaimer />
          </Stack>
        ) : (
          <SummaryNotAvailableApology />
        )}
      </StandardCardDescription>

      <Group grow mt="md">
        <StandardButton
          colour="blue"
          href={`/bills/${flipBillNo(bill.bill_no)}`}
        >
          Overview
        </StandardButton>
        <BillOriginalPdfButton bill={bill} />
      </Group>
    </StandardCard>
  );
}
